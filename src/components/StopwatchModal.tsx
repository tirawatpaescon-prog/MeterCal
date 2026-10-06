import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Check, X, Timer, Flag, Plus, Sparkles } from 'lucide-react';
import { MeterDiscAnimation } from './MeterDiscAnimation';

interface LapRecord {
  lapNumber: number;
  overallSeconds: number;
  lapDuration: number;
}

interface StopwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTime: (seconds: number, revolutionCount: number) => void;
  initialRevolutions?: number;
}

export const StopwatchModal: React.FC<StopwatchModalProps> = ({
  isOpen,
  onClose,
  onApplyTime,
  initialRevolutions = 5,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [targetRevs, setTargetRevs] = useState<number>(initialRevolutions || 5);
  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  // Update loop
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - accumulatedMsRef.current;
      const tick = () => {
        const now = performance.now();
        const currentMs = now - startTimeRef.current;
        accumulatedMsRef.current = currentMs;
        setElapsedMs(currentMs);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  if (!isOpen) return null;

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
    setLaps([]);
  };

  const handleRecordLap = () => {
    const totalSec = accumulatedMsRef.current / 1000;
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].overallSeconds : 0;
    const lapDuration = totalSec - lastLapTime;

    const newLap: LapRecord = {
      lapNumber: laps.length + 1,
      overallSeconds: totalSec,
      lapDuration: Math.max(0, lapDuration),
    };

    setLaps((prev) => [...prev, newLap]);
  };

  const handleApply = () => {
    const totalSec = +(accumulatedMsRef.current / 1000).toFixed(3);
    const revCount = laps.length > 0 ? laps.length : targetRevs;
    if (totalSec > 0) {
      onApplyTime(totalSec, revCount);
      onClose();
    }
  };

  // Time formatters
  const totalSeconds = elapsedMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const hundredths = Math.floor((elapsedMs % 1000) / 10);

  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;

  const currentLapCount = laps.length;
  const calculatedRpm = totalSeconds > 0 && currentLapCount > 0 ? (currentLapCount / totalSeconds) * 60 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#140e26] border border-purple-500/40 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/50 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-amber-400">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white">นาฬิกาจับเวลาทดสอบจานหมุน</h3>
              <p className="text-xs text-purple-300">กดจับรอบทุกครั้งที่มาร์คสีดำหมุนผ่านขีดอ้างอิง</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1">
          {/* Rotating Simulation Disc */}
          <MeterDiscAnimation
            rpm={calculatedRpm > 0 ? calculatedRpm : isRunning ? 20 : 0}
            isRunning={isRunning}
            onMarkPassed={isRunning ? handleRecordLap : undefined}
            showClickTarget={isRunning}
          />

          {/* Big Time Display */}
          <div className="bg-[#0b0817] border border-purple-500/30 rounded-2xl p-5 text-center shadow-inner relative">
            <div className="text-xs text-purple-300 mb-1 flex items-center justify-center gap-2 font-medium">
              <span>เวลาที่บันทึกได้</span>
              {currentLapCount > 0 && (
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 text-[11px]">
                  บันทึกแล้ว {currentLapCount} รอบ
                </span>
              )}
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-widest text-shadow drop-shadow-md">
              {formattedTime}
            </div>
            <div className="text-xs font-mono text-purple-400 mt-1">
              ({totalSeconds.toFixed(3)} วินาที)
            </div>
          </div>

          {/* Quick Target Revolutions Preset */}
          <div className="flex items-center justify-between text-xs text-slate-300 bg-purple-950/30 p-2.5 rounded-xl border border-purple-900/40">
            <span className="font-medium text-purple-200">รอบเป้าหมายที่ต้องการจับ:</span>
            <div className="flex gap-1.5">
              {[1, 5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTargetRevs(num)}
                  className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-all ${
                    targetRevs === num
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {num} รอบ
                </button>
              ))}
            </div>
          </div>

          {/* Primary Controls */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={handleStartPause}
              className={`py-3.5 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> พักเวลา
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> {elapsedMs > 0 ? 'จับต่อ' : 'เริ่มจับเวลา'}
                </>
              )}
            </button>

            <button
              type="button"
              disabled={!isRunning && elapsedMs === 0}
              onClick={handleRecordLap}
              className="py-3.5 px-3 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:hover:bg-purple-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-purple-900/30 active:scale-95 transition-all"
            >
              <Flag className="w-4 h-4 text-amber-300" />
              <span>รอบ (Lap)</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-3.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 border border-slate-700/60 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> รีเซ็ต
            </button>
          </div>

          {/* Recorded Laps Table */}
          {laps.length > 0 && (
            <div className="bg-[#0e0a1f] border border-purple-900/40 rounded-xl p-3 max-h-36 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] font-semibold text-purple-300 pb-1.5 border-b border-purple-900/30 mb-1.5">
                <span>รอบที่</span>
                <span>เวลาของรอบนี้</span>
                <span>เวลารวมสะสม</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                {laps.map((lap) => (
                  <div key={lap.lapNumber} className="flex items-center justify-between text-slate-300 py-0.5">
                    <span className="text-amber-400 font-semibold">#{lap.lapNumber}</span>
                    <span className="text-slate-200">+{lap.lapDuration.toFixed(3)}s</span>
                    <span className="text-purple-300">{lap.overallSeconds.toFixed(3)}s</span>
                  </div>
                ))}
              </div>
              {laps.length > 1 && (
                <div className="mt-2 pt-1.5 border-t border-purple-900/30 text-[11px] text-slate-400 flex justify-between">
                  <span>เวลาเฉลี่ยต่อรอบ:</span>
                  <span className="font-mono text-emerald-400 font-medium">
                    {(totalSeconds / laps.length).toFixed(3)} วินาที/รอบ
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-purple-900/40 mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={totalSeconds <= 0}
            onClick={handleApply}
            className="py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-900/40 flex items-center justify-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" /> นำค่าไปใช้งาน ({currentLapCount || targetRevs} รอบ, {totalSeconds.toFixed(2)}s)
          </button>
        </div>
      </div>
    </div>
  );
};
