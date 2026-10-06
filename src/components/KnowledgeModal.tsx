import React from 'react';
import { X, BookOpen, AlertTriangle, CheckCircle2, ShieldCheck, HelpCircle, FileText, Gauge } from 'lucide-react';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#140e26] border border-purple-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/50 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">คู่มือมาตรฐานและสูตรการตรวจสอบมิเตอร์ PEA</h3>
              <p className="text-xs text-purple-300">มาตรฐานการไฟฟ้าส่วนภูมิภาค (การทดสอบเครื่องวัดหน่วยไฟฟ้าจานหมุน)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่างคู่มือ"
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto space-y-5 pr-2 text-sm text-slate-300">
          {/* Section 1: Standard Criteria */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
            <h4 className="font-semibold text-white flex items-center gap-2 mb-2 text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              เกณฑ์มาตรฐานความคลาดเคลื่อนของการไฟฟ้าส่วนภูมิภาค (PEA)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              ตามระเบียบและมาตรฐานการทดสอบเครื่องวัดหน่วยไฟฟ้าแบบจานหมุน (Induction Watt-Hour Meter Class 2.0)
              กำหนดให้ความคลาดเคลื่อนต้องอยู่ในช่วง:
            </p>
            <div className="flex items-center justify-center p-3 bg-slate-900/90 rounded-xl border border-emerald-500/40 text-center">
              <span className="text-emerald-400 font-bold text-lg tracking-wide">
                -2.00% ≤ % Error ≤ +2.00%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ผ่านเกณฑ์:</strong> ความคลาดเคลื่อนอยู่ในช่วง ±2.00% ถือว่ามิเตอร์วัดได้เที่ยงตรง</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span><strong>ไม่ผ่านเกณฑ์:</strong> ความคลาดเคลื่อนเกิน ±2.00% ต้องส่งสอบเทียบปรับตั้งหรือเปลี่ยนมิเตอร์</span>
              </div>
            </div>
          </div>

          {/* Section 2: Formulas */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2 text-base">
              <Gauge className="w-5 h-5 text-amber-400" />
              สูตรและขั้นตอนการคำนวณทางไฟฟ้า
            </h4>
            
            <div className="p-3 bg-slate-950 rounded-xl border border-purple-900/40 space-y-1">
              <span className="text-xs font-semibold text-purple-300">1. กำลังไฟฟ้าที่อ่านได้จากจานหมุน (P_meter):</span>
              <p className="font-mono text-xs text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800">
                P_meter (kW) = [ (จำนวนรอบ N × 3600) / (rev/kWh × เวลา t ในวินาที) ] × Multiplier
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-purple-900/40 space-y-1">
              <span className="text-xs font-semibold text-purple-300">2. กำลังไฟฟ้าอ้างอิงจากเครื่องวัดภาคสนาม (P_ref):</span>
              <p className="font-mono text-xs text-amber-300 bg-slate-900 p-2 rounded border border-slate-800">
                • 1 เฟส: P_ref = (V × I × cos θ) / 1000<br />
                • 3 เฟส: P_ref = (√3 × V_LL × I_avg × cos θ) / 1000 หรือ ∑(V_phase × I_phase × cos θ) / 1000
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-purple-900/40 space-y-1">
              <span className="text-xs font-semibold text-purple-300">3. ค่าร้อยละความคลาดเคลื่อน (% Error):</span>
              <p className="font-mono text-xs text-rose-300 bg-slate-900 p-2 rounded border border-slate-800">
                % Error = [ (P_meter - P_ref) / P_ref ] × 100
              </p>
            </div>
          </div>

          {/* Section 3: Physical Causes & Troubleshooting */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white flex items-center gap-2 text-base">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              สาเหตุความผิดปกติของมิเตอร์จานหมุน
            </h4>
            
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/30">
                <span className="font-semibold text-rose-400">🚨 มิเตอร์หมุนเร็ว (% Error เป็นบวกเกิน +2.00%):</span>
                <p className="text-slate-300 mt-1">
                  • แม่เหล็กหน่วง (Braking Magnet) สูญเสียอำนาจแม่เหล็กจากอายุการใช้งาน หรือถูกฟ้าผ่า/ความร้อนสูง<br />
                  • สกรูปรับแต่งความเร็วเบี่ยงเบนจากตำแหน่งโรงงาน<br />
                  • มีกระแสเหนี่ยวนำผิดปกติหรือการเชื่อมต่อสายไม่ถูกต้อง
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/30">
                <span className="font-semibold text-amber-400">⚠️ มิเตอร์หมุนช้า (% Error เป็นลบเกิน -2.00%):</span>
                <p className="text-slate-300 mt-1">
                  • ตลับลูกปืนเม็ดพลอย (Jewel Bearing) หรือเดือยแกนสึกหรอ ฝืด หรือแห้งน้ำมัน<br />
                  • ฝุ่น แมลง หรือคราบสนิมติดบริเวณช่องว่างระหว่างแม่เหล็กกับจานอลูมิเนียม<br />
                  • จานหมุนคดงอเสียดสีกับโครงสร้าง<br />
                  • ขดลวดแรงดัน (Potential Coil) หรือขดลวดกระแส (Current Coil) ลัดวงจรบางส่วน
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/30">
                <span className="font-semibold text-blue-400">ℹ️ การทดสอบการหมุนตามตัว (Creep Test):</span>
                <p className="text-slate-300 mt-1">
                  เมื่อปลดโหลดออกทั้งหมด (กระแส I = 0 A) จานหมุนต้องไม่หมุนครบ 1 รอบเต็ม โดยจะมีขอเกี่ยวยับยั้งการหมุนอิสระ (Anti-creep hole / hook)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-purple-900/40 mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            เข้าใจแล้ว / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
