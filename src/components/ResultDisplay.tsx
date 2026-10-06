import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Zap,
  Gauge,
  Percent,
  FileCheck,
  BookmarkPlus,
  Info,
} from 'lucide-react';
import { MeterCalculationResult, MeterFormData } from '../types/meter';
import {
  formatNum,
  PEA_ERROR_TOLERANCE,
} from '../utils/calculator';

interface ResultDisplayProps {
  result: MeterCalculationResult | null;
  form: MeterFormData;
  onOpenReport: () => void;
  onSaveHistory: () => void;
  isSaved?: boolean;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  form,
  onOpenReport,
  onSaveHistory,
  isSaved = false,
}) => {
  if (!result) {
    return (
      <div className="bg-[#140e26]/85 backdrop-blur-xl border border-purple-500/25 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-3 shadow-inner">
          <Gauge className="w-8 h-8 text-purple-400/80 animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">ผลการคำนวณจะแสดงที่นี่</h3>
        <p className="text-xs text-slate-400 max-w-xs">
          กรอกข้อมูลให้ครบถ้วนเพื่อตรวจสอบความคลาดเคลื่อน
        </p>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-purple-300/80 bg-purple-950/30 px-3 py-1 rounded-xl border border-purple-900/40">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>เกณฑ์มาตรฐาน PEA: ±{PEA_ERROR_TOLERANCE.toFixed(2)}%</span>
        </div>
      </div>
    );
  }

  const sign = result.errorPercent > 0 ? '+' : '';

  return (
    <div className="bg-[#140e26]/85 backdrop-blur-xl border border-purple-500/25 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-purple-400" />
            <span>ผลการตรวจสอบ</span>
          </h2>
          <span className="text-xs text-purple-300 font-mono">
            {result.calculatedAt} น.
          </span>
        </div>

        {/* Status Badge */}
        <div
          className={`w-full py-3.5 px-4 rounded-2xl text-center font-bold flex items-center justify-center gap-3 transition-all mb-4 border shadow-lg ${
            result.isNormal
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 glow-emerald'
              : 'bg-rose-950/80 text-rose-300 border-rose-500/60 glow-rose'
          }`}
        >
          {result.isNormal ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <span className="text-base sm:text-lg">
            {result.isNormal
              ? 'ปกติ (ผ่านเกณฑ์มาตรฐาน ±2%)'
              : result.errorPercent > 0
              ? 'ผิดปกติ (หมุนเร็ว / คิดไฟเกิน)'
              : 'ผิดปกติ (หมุนช้า / คิดไฟขาด)'}
          </span>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Card 1: P_meter */}
          <div className="bg-[#0b0817] border border-purple-950 rounded-2xl p-3.5 shadow-inner">
            <span className="text-xs text-purple-300 block mb-0.5">จานหมุน (P_meter)</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {formatNum(result.meterKw, 4)}
              <span className="text-xs font-normal text-slate-400 ml-1">kW</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              อ้างอิง: {formatNum(result.refKw, 4)} kW
            </div>
          </div>

          {/* Card 2: % Error */}
          <div className="bg-[#0b0817] border border-purple-950 rounded-2xl p-3.5 shadow-inner">
            <span className="text-xs text-purple-300 block mb-0.5">ความคลาดเคลื่อน</span>
            <div
              className={`text-xl sm:text-2xl font-bold font-mono ${
                result.isNormal ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {sign}
              {formatNum(result.errorPercent, 2)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ต่าง {formatNum(Math.abs(result.diffKw), 4)} kW
            </div>
          </div>
        </div>

        {/* Compact Speed info */}
        <div className="flex items-center justify-between text-xs bg-[#0e0a1f] px-3.5 py-2 rounded-xl border border-purple-900/40">
          <span className="text-slate-400">
            ความเร็วรอบ: <strong className="text-white font-mono">{formatNum(result.rpm, 1)} RPM</strong>
          </span>
          <span className="text-slate-400">
            เวลา/รอบ: <strong className="text-amber-300 font-mono">{formatNum(result.timePerRev, 2)} วินาที</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-2">
        <button
          type="button"
          onClick={onOpenReport}
          className="py-3 px-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <FileCheck className="w-4 h-4 shrink-0" />
          <span>ออกรายงาน / LINE</span>
        </button>

        <button
          type="button"
          onClick={onSaveHistory}
          disabled={isSaved}
          className={`py-3 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all active:scale-95 ${
            isSaved
              ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300'
              : 'bg-[#0e0a1f] hover:bg-slate-800 text-slate-200 border-purple-900/60'
          }`}
        >
          <BookmarkPlus className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{isSaved ? 'บันทึกแล้ว' : 'บันทึกประวัติ'}</span>
        </button>
      </div>
    </div>
  );
};
