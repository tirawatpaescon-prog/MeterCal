import React, { useState } from 'react';
import {
  Sliders,
  RotateCw,
  Hash,
  Clock,
  Zap,
  Timer,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MeterFormData } from '../types/meter';
import { POPULAR_CONSTANTS, calculateReferenceKw, formatNum } from '../utils/calculator';

interface InputFormProps {
  form: MeterFormData;
  onChange: (updated: Partial<MeterFormData>) => void;
  onCalculate: () => void;
  onReset: () => void;
  onOpenStopwatch: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  form,
  onChange,
  onCalculate,
  onReset,
  onOpenStopwatch,
}) => {
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  const previewRefKw = calculateReferenceKw(form);

  const handleChipSelect = (val: number) => {
    onChange({ revKwh: val });
  };

  const handleRevChipSelect = (revs: number) => {
    onChange({ revolutions: revs });
  };

  return (
    <div className="bg-[#140e26]/85 backdrop-blur-xl border border-purple-500/25 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-400" />
          <span>กรอกข้อมูลการทดสอบ</span>
        </h2>
        <span className="text-xs text-purple-300 font-medium">
          <span className="text-amber-400">*</span> จำเป็นต้องกรอก
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="space-y-4"
      >
        {/* 1. Meter Constant (rev/kWh) */}
        <div>
          <label htmlFor="revKwhInput" className="text-sm font-medium text-slate-200 block mb-1.5">
            ค่าคงที่มิเตอร์ (rev/kWh) <span className="text-amber-400">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <RotateCw className="w-5 h-5" />
            </div>
            <input
              id="revKwhInput"
              type="number"
              step="any"
              min="1"
              max="10000"
              required
              value={form.revKwh || ''}
              onChange={(e) => onChange({ revKwh: parseFloat(e.target.value) || 0 })}
              placeholder="1200, 720, 400, 200..."
              className="w-full pl-11 pr-20 py-2.5 bg-[#0a0715] border border-purple-950 hover:border-purple-800 focus:border-purple-500 rounded-xl text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-purple-400 font-medium">
              rev/kWh
            </div>
          </div>

          {/* Quick Selection Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {POPULAR_CONSTANTS.map((c) => {
              const isSelected = form.revKwh === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleChipSelect(c.value)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${
                    isSelected
                      ? 'bg-purple-700 text-white border-purple-400 font-bold shadow-sm'
                      : 'bg-[#0e0a1f] hover:bg-purple-900/50 text-slate-300 border-purple-900/50'
                  }`}
                >
                  {c.value}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Revolutions Count */}
        <div>
          <label htmlFor="revolutionsInput" className="text-sm font-medium text-slate-200 block mb-1.5">
            จำนวนรอบที่จับ (รอบ) <span className="text-amber-400">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <Hash className="w-5 h-5" />
            </div>
            <input
              id="revolutionsInput"
              type="number"
              step="1"
              min="1"
              required
              value={form.revolutions || ''}
              onChange={(e) => onChange({ revolutions: parseInt(e.target.value, 10) || 0 })}
              placeholder="5 หรือ 10"
              className="w-full pl-11 pr-16 py-2.5 bg-[#0a0715] border border-purple-950 hover:border-purple-800 focus:border-purple-500 rounded-xl text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-purple-400 font-medium">
              รอบ
            </div>
          </div>

          {/* Preset Revolutions */}
          <div className="flex gap-1.5 mt-2">
            {[1, 2, 5, 10, 20].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleRevChipSelect(n)}
                className={`text-xs px-2.5 py-0.5 rounded-lg border font-mono transition-all ${
                  form.revolutions === n
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-[#0e0a1f] text-slate-400 hover:text-white border-purple-950'
                }`}
              >
                {n} รอบ
              </button>
            ))}
          </div>
        </div>

        {/* 3. Time Elapsed (Seconds) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="timeSecInput" className="text-sm font-medium text-slate-200">
              เวลาที่ใช้ (วินาที) <span className="text-amber-400">*</span>
            </label>
            <button
              type="button"
              onClick={onOpenStopwatch}
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-purple-900/60 hover:bg-purple-800 px-2 py-0.5 rounded-lg border border-purple-700/50 transition-colors shadow-sm"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>จับเวลาในตัว</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <input
              id="timeSecInput"
              type="number"
              step="any"
              min="0.001"
              required
              value={form.timeSec || ''}
              onChange={(e) => onChange({ timeSec: parseFloat(e.target.value) || 0 })}
              placeholder="เช่น 36.45"
              className="w-full pl-11 pr-24 py-2.5 bg-[#0a0715] border border-purple-950 hover:border-purple-800 focus:border-purple-500 rounded-xl text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-purple-400 font-medium">
              วินาที (s)
            </div>
          </div>
        </div>

        {/* 4. ระบบมิเตอร์ (1 เฟส vs 3 เฟส 4 สาย พร้อมตัวคูณมิเตอร์) */}
        <div className="p-3.5 rounded-2xl bg-[#0e0a1f] border border-purple-900/50 space-y-3">
          <label className="text-sm font-semibold text-white block">
            ระบบมิเตอร์
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ phaseMode: '1phase', voltage: 220, multiplier: 1 })}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                form.phaseMode === '1phase'
                  ? 'bg-purple-700 text-white border-purple-400 shadow-md'
                  : 'bg-[#0a0715] text-slate-400 hover:text-white border-purple-950'
              }`}
            >
              1 เฟส 2 สาย (220V)
            </button>
            <button
              type="button"
              onClick={() => onChange({ phaseMode: '3phase', voltage: 380 })}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                form.phaseMode === '3phase'
                  ? 'bg-purple-700 text-white border-purple-400 shadow-md'
                  : 'bg-[#0a0715] text-slate-400 hover:text-white border-purple-950'
              }`}
            >
              3 เฟส 4 สาย (380V)
            </button>
          </div>

          {/* หัวข้อตัวคูณมิเตอร์ อยู่ร่วมกับมิเตอร์ 3 เฟส 4 สาย */}
          {form.phaseMode === '3phase' && (
            <div className="pt-2 border-t border-purple-950 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  ตัวคูณมิเตอร์ (Multiplier / อัตราทด CT)
                </span>
                <span className="text-[10px] text-slate-400">ต่อตรง = 1x</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[1, 10, 20, 40].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ multiplier: m })}
                    className={`py-1 text-xs rounded-lg border font-mono transition-all ${
                      form.multiplier === m
                        ? 'bg-purple-700 text-white border-purple-400 font-bold shadow-sm'
                        : 'bg-[#0a0715] text-slate-400 hover:text-white border-purple-950'
                    }`}
                  >
                    {m === 1 ? '1x ต่อตรง' : `${m}x`}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="1"
                  value={form.multiplier || 1}
                  onChange={(e) => onChange({ multiplier: parseFloat(e.target.value) || 1 })}
                  placeholder="1"
                  className="w-full px-3 py-1.5 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-purple-400">
                  เท่า
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Reference Load (Pref) */}
        <div className="p-3.5 rounded-2xl bg-[#0e0a1f] border border-purple-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              โหลดอ้างอิง (Pref) <span className="text-amber-400">*</span>
            </label>

            {/* Mode Switch Tabs */}
            <div className="flex bg-[#070510] p-0.5 rounded-lg border border-purple-950">
              <button
                type="button"
                onClick={() => onChange({ refMode: 'direct' })}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all font-medium ${
                  form.refMode === 'direct'
                    ? 'bg-purple-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ระบุ kW
              </button>
              <button
                type="button"
                onClick={() => onChange({ refMode: 'vipf' })}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-all font-medium ${
                  form.refMode === 'vipf'
                    ? 'bg-purple-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                V, I, PF
              </button>
            </div>
          </div>

          {form.refMode === 'direct' ? (
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  required
                  value={form.directKw || ''}
                  onChange={(e) => onChange({ directKw: parseFloat(e.target.value) || 0 })}
                  placeholder="เช่น 2.74"
                  className="w-full pl-3 pr-16 py-2.5 bg-[#0a0715] border border-purple-950 hover:border-purple-800 focus:border-purple-500 rounded-xl text-white font-mono text-base placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs text-purple-400 font-bold">
                  kW
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {/* Voltage & PF */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">แรงดัน V (โวลต์)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.voltage || ''}
                    onChange={(e) => onChange({ voltage: parseFloat(e.target.value) || 0 })}
                    placeholder={form.phaseMode === '1phase' ? '220' : '380'}
                    className="w-full px-3 py-2 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Power Factor (cos θ)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="1.0"
                    value={form.powerFactor || ''}
                    onChange={(e) => onChange({ powerFactor: parseFloat(e.target.value) || 1 })}
                    placeholder="1.00 หรือ 0.95"
                    className="w-full px-3 py-2 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Current Inputs based on selected Phase */}
              {form.phaseMode === '1phase' ? (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">กระแสโหลด I (แอมป์ A)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.current || ''}
                    onChange={(e) => onChange({ current: parseFloat(e.target.value) || 0 })}
                    placeholder="เช่น 12.5"
                    className="w-full px-3 py-2 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">กระแส 3 เฟส (IA, IB, IC หรือ เฉลี่ย)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="IA (แอมป์)"
                      value={form.currentA || ''}
                      onChange={(e) => onChange({ currentA: parseFloat(e.target.value) || 0 })}
                      className="px-2.5 py-2 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="IB (แอมป์)"
                      value={form.currentB || ''}
                      onChange={(e) => onChange({ currentB: parseFloat(e.target.value) || 0 })}
                      className="px-2.5 py-2 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder="IC (แอมป์)"
                      value={form.currentC || ''}
                      onChange={(e) => onChange({ currentC: parseFloat(e.target.value) || 0 })}
                      className="px-2.5 py-2 bg-[#0a0715] border border-purple-950 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Live Preview of Calculated kW */}
              <div className="bg-[#070510] p-2.5 rounded-lg border border-purple-950 flex items-center justify-between">
                <span className="text-xs text-slate-400">คำนวณกำลังไฟฟ้าได้:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">
                  {formatNum(previewRefKw, 4)} kW
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 6. Expandable Field Information (PEA Meter No, Customer, Inspector) */}
        <div className="border-t border-purple-900/40 pt-2">
          <button
            type="button"
            onClick={() => setShowAdvancedDetails((prev) => !prev)}
            className="w-full flex items-center justify-between py-1.5 text-xs font-medium text-purple-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              ข้อมูลมิเตอร์และสถานที่ (ระบุหรือไม่ก็ได้)
            </span>
            {showAdvancedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvancedDetails && (
            <div className="p-3.5 bg-[#0a0715] rounded-2xl border border-purple-950 space-y-2.5 mt-2 animate-in fade-in">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">หมายเลขเครื่องวัด (PEA Meter No.)</label>
                <input
                  type="text"
                  value={form.meterNo}
                  onChange={(e) => onChange({ meterNo: e.target.value })}
                  placeholder="เช่น 12-345678-9"
                  className="w-full px-3 py-2 bg-[#140e26] border border-purple-900/50 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ชื่อผู้ใช้ไฟฟ้า / สถานที่</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => onChange({ customerName: e.target.value })}
                    placeholder="เช่น บ้านนายสมชาย หรือ ซอย 4"
                    className="w-full px-3 py-2 bg-[#140e26] border border-purple-900/50 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ผู้ตรวจสอบ (Inspector)</label>
                  <input
                    type="text"
                    value={form.inspectorName}
                    onChange={(e) => onChange({ inspectorName: e.target.value })}
                    placeholder="เช่น นายช่างวิศวกรรม PEA"
                    className="w-full px-3 py-2 bg-[#140e26] border border-purple-900/50 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">บันทึกเพิ่มเติม (Notes)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => onChange({ notes: e.target.value })}
                  placeholder="เช่น สภาพฝาครอบปกติ"
                  className="w-full px-3 py-2 bg-[#140e26] border border-purple-900/50 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Activity className="w-5 h-5 text-amber-300" />
            <span>คำนวณผลลัพธ์</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 px-4 bg-[#0e0a1f] hover:bg-slate-800 text-slate-300 hover:text-white border border-purple-900/40 rounded-xl font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>ล้างข้อมูล</span>
          </button>
        </div>
      </form>
    </div>
  );
};
