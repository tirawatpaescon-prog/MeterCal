import React from 'react';
import { RotateCw, Sparkles, Activity } from 'lucide-react';

interface MeterDiscAnimationProps {
  rpm: number;
  isRunning?: boolean;
  onMarkPassed?: () => void;
  showClickTarget?: boolean;
}

export const MeterDiscAnimation: React.FC<MeterDiscAnimationProps> = ({
  rpm,
  isRunning = false,
  onMarkPassed,
  showClickTarget = false,
}) => {
  // Calculate spin duration in seconds per full revolution (60 / rpm)
  // Clamp between 0.3s (fast load) and 30s (slow idle load)
  const clampedRpm = Math.max(0, Math.min(120, rpm));
  const spinDuration = clampedRpm > 0 ? (60 / clampedRpm).toFixed(2) : 0;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-purple-500/20 backdrop-blur-md">
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <span className="text-xs font-medium text-purple-300 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          จำลองการหมุนของจานมิเตอร์ (Induction Disc)
        </span>
        <span className="text-[11px] font-mono text-slate-400 bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-800/40">
          {clampedRpm > 0 ? `${clampedRpm.toFixed(1)} RPM` : 'หยุดนิ่ง'}
        </span>
      </div>

      {/* Disc Window Container */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Outer Bezel (Meter Glass Rim) */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-700/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_15px_rgba(123,31,162,0.3)] bg-gradient-to-b from-slate-900 to-slate-950" />

        {/* Center Reference Mark Pointer (Fixed index line at bottom/front of meter window) */}
        <div className="absolute bottom-2 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.9)]" />
          <span className="text-[9px] font-bold text-rose-400 tracking-wider">INDEX</span>
        </div>

        {/* Spinning Aluminum Disc */}
        <div
          onClick={onMarkPassed}
          role={showClickTarget ? 'button' : undefined}
          title={showClickTarget ? 'คลิกเมื่อมาร์คสีดำหมุนผ่านเส้นอ้างอิง' : undefined}
          className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-slate-400/40 shadow-inner flex items-center justify-center transition-transform ${
            showClickTarget ? 'cursor-pointer active:scale-95 hover:border-amber-400' : ''
          }`}
          style={{
            background: 'radial-gradient(circle, #e2e8f0 0%, #94a3b8 40%, #64748b 80%, #475569 100%)',
            animation:
              clampedRpm > 0 || isRunning
                ? `spin ${spinDuration || 4}s linear infinite`
                : 'none',
          }}
        >
          {/* Concentric brushed grooves on aluminum disc */}
          <div className="absolute inset-3 rounded-full border border-slate-500/30" />
          <div className="absolute inset-7 rounded-full border border-slate-600/30" />
          <div className="absolute inset-12 rounded-full border border-slate-600/40" />

          {/* Stroboscopic ticks along outer perimeter (ฟันขอบจานหมุน) */}
          <div className="absolute inset-1 rounded-full border-2 border-dashed border-slate-600/60 pointer-events-none" />

          {/* Distinctive Red/Black Index Reference Bar on Disc */}
          <div className="absolute top-0 bottom-0 w-2.5 bg-gradient-to-b from-black via-rose-700 to-black rounded-sm shadow-md" />

          {/* Center Jewel Spindle (แกนหมุนตรงกลาง) */}
          <div className="relative z-10 w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 via-slate-600 to-slate-400 border-2 border-amber-500/80 shadow-md flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
        </div>

        {/* Glass reflection gloss */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Helpful Hint */}
      <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-amber-400" />
        {showClickTarget ? (
          <span className="text-amber-300 font-medium">กดที่จานหมุน หรือปุ่มจับรอบ เพื่อบันทึกจังหวะมาร์คผ่าน</span>
        ) : (
          <span>สังเกตแถบสีดำ-แดง เมื่อหมุนครบรอบกลับมาที่ตำแหน่งเดิม = 1 รอบ</span>
        )}
      </p>
    </div>
  );
};
