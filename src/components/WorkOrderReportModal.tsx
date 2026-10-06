import React, { useState } from 'react';
import { X, Copy, Check, Printer, Share2, FileCheck, Building2, UserCheck, ShieldAlert } from 'lucide-react';
import { MeterFormData, MeterCalculationResult } from '../types/meter';
import { formatNum, generateLineReportText, PEA_ERROR_TOLERANCE } from '../utils/calculator';

interface WorkOrderReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: MeterFormData;
  result: MeterCalculationResult | null;
}

export const WorkOrderReportModal: React.FC<WorkOrderReportModalProps> = ({
  isOpen,
  onClose,
  form,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopyLine = async () => {
    const text = generateLineReportText(form, result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const sign = result.errorPercent > 0 ? '+' : '';
  const testDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const testTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#140e26] border border-purple-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/50 mb-4 no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">รายงานผลการตรวจสอบมิเตอร์ (PEA Report)</h3>
              <p className="text-xs text-purple-300">เอกสารสรุปผลการทดสอบภาคสนามสำหรับการบันทึกงาน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่างรายงาน"
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Sheet View */}
        <div className="overflow-y-auto pr-1">
          <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 print:shadow-none print:border-none print:p-0">
            {/* Header Document */}
            <div className="flex items-start justify-between border-b-2 border-purple-900 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-900 text-white text-xs font-bold rounded">PEA</span>
                  <span className="text-xs text-slate-500 font-medium">การไฟฟ้าส่วนภูมิภาค</span>
                </div>
                <h2 className="text-xl font-bold text-purple-950 mt-1">
                  ใบรายงานผลการตรวจสอบมิเตอร์จานหมุนภาคสนาม
                </h2>
                <p className="text-xs text-slate-500">Field Induction Disc Watt-Hour Meter Verification Report</p>
              </div>
              <div className="text-right text-xs text-slate-600">
                <p><strong>วันที่ตรวจ:</strong> {testDate}</p>
                <p><strong>เวลา:</strong> {testTime} น.</p>
                <p><strong>เกณฑ์:</strong> ±{formatNum(PEA_ERROR_TOLERANCE, 2)}%</p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-4">
              <div>
                <span className="text-slate-500">หมายเลขมิเตอร์ (PEA No.):</span>
                <p className="font-bold text-slate-900 font-mono text-sm">{form.meterNo || '-'}</p>
              </div>
              <div>
                <span className="text-slate-500">ผู้ใช้ไฟฟ้า / สถานที่:</span>
                <p className="font-semibold text-slate-900">{form.customerName || form.location || '-'}</p>
              </div>
              <div>
                <span className="text-slate-500">ผู้ตรวจสอบ:</span>
                <p className="font-medium text-slate-900">{form.inspectorName || '-'}</p>
              </div>
              <div>
                <span className="text-slate-500">ระบบไฟฟ้า:</span>
                <p className="font-medium text-slate-900">
                  {form.phaseMode === '1phase' ? '1 เฟส 2 สาย (220V)' : '3 เฟส 4 สาย (380/220V)'}
                </p>
              </div>
            </div>

            {/* Test Measurement Table */}
            <div className="mb-4 text-xs">
              <table className="w-full border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-purple-50 text-purple-950 text-left">
                    <th className="border border-slate-300 p-2 font-semibold">พารามิเตอร์การทดสอบ</th>
                    <th className="border border-slate-300 p-2 font-semibold">ค่าที่วัดได้</th>
                    <th className="border border-slate-300 p-2 font-semibold">หน่วย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="border border-slate-300 p-2">ค่าคงที่มิเตอร์ (Kh)</td>
                    <td className="border border-slate-300 p-2 font-mono font-medium">{form.revKwh}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">rev/kWh</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">จำนวนรอบที่จับ (N)</td>
                    <td className="border border-slate-300 p-2 font-mono font-medium">{form.revolutions}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">รอบ</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">เวลาที่ใช้ (t)</td>
                    <td className="border border-slate-300 p-2 font-mono font-medium">{form.timeSec}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">วินาที</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">ตัวคูณมิเตอร์ (Multiplier)</td>
                    <td className="border border-slate-300 p-2 font-mono font-medium">{form.multiplier || 1}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">เท่า</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="border border-slate-300 p-2 font-medium">กำลังไฟฟ้าอ้างอิง (Pref)</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-amber-900">{formatNum(result.refKw, 4)}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">kW</td>
                  </tr>
                  <tr className="bg-purple-50/50">
                    <td className="border border-slate-300 p-2 font-medium">กำลังไฟฟ้าจานหมุน (Pmeter)</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-purple-900">{formatNum(result.meterKw, 4)}</td>
                    <td className="border border-slate-300 p-2 text-slate-600">kW</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Test Verdict Banner */}
            <div
              className={`p-4 rounded-xl border-2 flex items-center justify-between mb-4 ${
                result.isNormal
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : 'bg-rose-50 border-rose-500 text-rose-900'
              }`}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block">ผลการทดสอบความคลาดเคลื่อน</span>
                <span className="text-2xl font-bold font-mono">
                  % Error = {sign}{formatNum(result.errorPercent, 2)}%
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold inline-block ${
                    result.isNormal
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {result.isNormal ? 'ผ่านเกณฑ์มาตรฐาน (ปกติ)' : 'ไม่ผ่านเกณฑ์ (ผิดปกติ)'}
                </span>
                <p className="text-[11px] mt-1 text-slate-600">
                  เกณฑ์การไฟฟ้า: ±{formatNum(PEA_ERROR_TOLERANCE, 2)}%
                </p>
              </div>
            </div>

            {/* Remarks & Signatures */}
            <div className="border-t border-slate-200 pt-3 text-xs text-slate-700">
              <p><strong>หมายเหตุ:</strong> {form.notes || 'ไม่มีบันทึกเพิ่มเติม'}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 mt-4 text-center text-xs text-slate-600">
              <div className="border-t border-slate-300 pt-2">
                <p>ลงชื่อ ..............................................................</p>
                <p className="mt-1 font-medium">({form.inspectorName || 'พนักงานผู้ตรวจสอบ'})</p>
                <p className="text-[10px] text-slate-400">ผู้ตรวจสอบมิเตอร์ PEA</p>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <p>ลงชื่อ ..............................................................</p>
                <p className="mt-1 font-medium">({form.customerName || 'ผู้ใช้ไฟฟ้า / พยาน'})</p>
                <p className="text-[10px] text-slate-400">ผู้ร่วมสังเกตการณ์ / ผู้ใช้ไฟฟ้า</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-4 border-t border-purple-900/40 mt-4 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
          >
            ปิด
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyLine}
              className="py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" /> คัดลอกแล้ว!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> คัดลอกข้อความส่ง LINE
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" /> พิมพ์เอกสาร / บันทึก PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
