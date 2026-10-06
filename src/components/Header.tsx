import React from 'react';
import { Gauge, ShieldCheck, Timer, BookOpen, RotateCcw, Zap } from 'lucide-react';
import { PEA_ERROR_TOLERANCE } from '../utils/calculator';

interface HeaderProps {
  onOpenStopwatch: () => void;
  onOpenKnowledge: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenStopwatch,
  onOpenKnowledge,
  onReset,
}) => {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6a1b9a] via-[#7b1fa2] to-[#4a126b] p-5 sm:p-6 mb-6 shadow-2xl border border-purple-500/30 text-white">
      {/* Decorative ambient background */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-2xl border border-white/20 shadow-inner shrink-0">
            <Gauge className="w-8 h-8 text-purple-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-full shadow-sm flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" /> PEA Standard
              </span>
              <span className="text-xs text-purple-200 font-medium">
                ระบบคำนวณและตรวจสอบภาคสนาม
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              เครื่องมือคำนวณมิเตอร์ไฟฟ้าจานหมุน PEA
            </h1>
            <p className="text-xs text-purple-200/90 hidden sm:block">
              ตรวจสอบความคลาดเคลื่อนมิเตอร์จานหมุนตามเกณฑ์ PEA ±2%
            </p>
          </div>
        </div>

        {/* Action Header Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Tolerance Tag */}
          <div className="text-xs text-purple-100 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>เกณฑ์มาตรฐาน:</span>
            <span className="font-bold text-white">±{PEA_ERROR_TOLERANCE.toFixed(2)}%</span>
          </div>

          {/* Quick Stopwatch Button */}
          <button
            type="button"
            onClick={onOpenStopwatch}
            className="text-xs bg-purple-900/60 hover:bg-purple-800 text-white px-3 py-1.5 rounded-xl border border-purple-400/40 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Timer className="w-4 h-4 text-amber-300" />
            <span>จับเวลาในตัว</span>
          </button>

          {/* Standards & Guide */}
          <button
            type="button"
            onClick={onOpenKnowledge}
            className="text-xs bg-purple-900/60 hover:bg-purple-800 text-white px-3 py-1.5 rounded-xl border border-purple-400/40 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>คู่มือ & สูตร</span>
          </button>
        </div>
      </div>
    </header>
  );
};
