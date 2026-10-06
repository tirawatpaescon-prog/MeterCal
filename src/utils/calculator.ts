import { MeterFormData, MeterCalculationResult, HistoryRecord, PopularConstant } from '../types/meter';

export const PEA_ERROR_TOLERANCE = 2.0; // ±2.00% standard

export const POPULAR_CONSTANTS: PopularConstant[] = [
  { value: 1200, label: '1200', typicalMeter: '1 เฟส 5(15)A ยอดนิยม (เช่น Mitsubishi MF-33E)', currentRating: '5(15)A' },
  { value: 720, label: '720', typicalMeter: '1 เฟส 15(45)A (รุ่นจานหมุนทั่วไป)', currentRating: '15(45)A' },
  { value: 600, label: '600', typicalMeter: '1 เฟส 15(45)A หรือ 3 เฟส', currentRating: '15(45)A' },
  { value: 400, label: '400', typicalMeter: '1 เฟส 15(45)A / 30(100)A', currentRating: '15(45)A' },
  { value: 300, label: '300', typicalMeter: '1 เฟส 30(100)A', currentRating: '30(100)A' },
  { value: 200, label: '200', typicalMeter: '1 เฟส 50(150)A', currentRating: '50(150)A' },
  { value: 120, label: '120', typicalMeter: '3 เฟส 4 สาย (เช่น 15/45A หรือ 30/100A)', currentRating: '3P 15(45)A' },
  { value: 60, label: '60', typicalMeter: '3 เฟส 50(150)A', currentRating: '3P 50(150)A' },
  { value: 40, label: '40', typicalMeter: '3 เฟส ต่อผ่าน CT (5A)', currentRating: '3P CT' },
];

/**
 * Calculate reference kW from V, I, PF or direct input
 */
export function calculateReferenceKw(form: MeterFormData): number {
  if (form.refMode === 'direct') {
    return form.directKw;
  }

  const pf = Math.max(0.1, Math.min(1.0, form.powerFactor || 1.0));
  const mult = form.multiplier > 0 ? form.multiplier : 1;

  if (form.phaseMode === '1phase') {
    // P = (V * I * PF) / 1000 * Multiplier
    const v = form.voltage || 220;
    const i = form.current || 0;
    return ((v * i * pf) / 1000) * mult;
  } else {
    // 3-Phase 4-Wire
    // Check if user entered individual 3 phases or average current
    const vLL = form.voltage || 380;
    if (form.currentA > 0 || form.currentB > 0 || form.currentC > 0) {
      // Sum of individual phases: P = (V_phase * (Ia + Ib + Ic) * PF) / 1000
      // V_phase = V_LL / sqrt(3) ~= 220V
      const vPhase = vLL / Math.sqrt(3);
      const totalI = (form.currentA || 0) + (form.currentB || 0) + (form.currentC || 0);
      return ((vPhase * totalI * pf) / 1000) * mult;
    } else {
      // P = (sqrt(3) * V_LL * I_avg * PF) / 1000
      const i = form.current || 0;
      return ((Math.sqrt(3) * vLL * i * pf) / 1000) * mult;
    }
  }
}

/**
 * Main Meter Calculation
 */
export function calculateMeter(form: MeterFormData): MeterCalculationResult | null {
  const { revKwh, revolutions, timeSec } = form;
  const mult = form.multiplier > 0 ? form.multiplier : 1;

  if (!revKwh || revKwh <= 0 || !revolutions || revolutions <= 0 || !timeSec || timeSec <= 0) {
    return null;
  }

  const refKw = calculateReferenceKw(form);
  if (refKw <= 0) {
    return null;
  }

  // P_meter = ((N * 3600) / (Kh * t)) * Multiplier
  const meterKw = ((revolutions * 3600) / (revKwh * timeSec)) * mult;

  // % Error = ((P_meter - P_ref) / P_ref) * 100
  const errorPercent = ((meterKw - refKw) / refKw) * 100;
  const isNormal = Math.abs(errorPercent) <= PEA_ERROR_TOLERANCE;
  const diffKw = meterKw - refKw;

  // RPM = (N / t) * 60
  const rpm = (revolutions / timeSec) * 60;
  const timePerRev = timeSec / revolutions;

  return {
    meterKw,
    refKw,
    errorPercent,
    isNormal,
    diffKw,
    rpm,
    timePerRev,
    multiplier: mult,
    calculatedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

/**
 * Format float numbers with custom decimals
 */
export function formatNum(val: number, decimals: number = 2): string {
  if (isNaN(val)) return '0.00';
  return val.toLocaleString('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Generate concise diagnostic summary & recommendation in Thai
 */
export function getDiagnosticSummary(result: MeterCalculationResult): {
  headline: string;
  recommendation: string;
} {
  const sign = result.errorPercent > 0 ? '+' : '';
  const errStr = `${sign}${formatNum(result.errorPercent, 2)}%`;

  if (result.isNormal) {
    return {
      headline: `ปกติ (${errStr})`,
      recommendation: 'มิเตอร์วัดได้เที่ยงตรง อยู่ในเกณฑ์มาตรฐาน PEA ±2% ใช้งานต่อได้ตามปกติ',
    };
  }

  if (result.errorPercent > PEA_ERROR_TOLERANCE) {
    return {
      headline: `หมุนเร็วเกินเกณฑ์ (${errStr})`,
      recommendation: 'มิเตอร์หมุนเร็ว คิดค่าไฟเกิน (สาเหตุพบบ่อย: แม่เหล็กหน่วงเสื่อมสภาพ) แนะนำส่งสอบเทียบหรือเปลี่ยนมิเตอร์',
    };
  }

  return {
    headline: `หมุนช้าเกินเกณฑ์ (${errStr})`,
    recommendation: 'มิเตอร์หมุนช้า คิดค่าไฟขาด (สาเหตุพบบ่อย: ลูกปืนฝืด/สึกหรอ หรือมีสิ่งกีดขวางจานหมุน) แนะนำตรวจสอบหรือเปลี่ยนมิเตอร์',
  };
}

/**
 * Generate copy-pasteable work order report for Thai electric utilities / LINE
 */
export function generateLineReportText(
  form: MeterFormData,
  result: MeterCalculationResult
): string {
  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  const sign = result.errorPercent > 0 ? '+' : '';

  return `📊 [รายงานผลการตรวจสอบมิเตอร์จานหมุน PEA]
━━━━━━━━━━━━━━━━━━━━
📅 วันที่ตรวจ: ${dateStr} เวลา ${timeStr} น.
🔢 หมายเลขมิเตอร์ (PEA): ${form.meterNo || '-'}
👤 ผู้ใช้ไฟฟ้า/สถานที่: ${form.customerName || form.location || '-'}
👷 ผู้ตรวจสอบ: ${form.inspectorName || '-'}

⚙️ ข้อมูลการวัดภาคสนาม:
• ค่าคงที่ (rev/kWh): ${form.revKwh} rev/kWh
• จำนวนรอบที่จับ (N): ${form.revolutions} รอบ
• เวลาที่ใช้ (t): ${form.timeSec} วินาที
• ตัวคูณ (Multiplier): ${form.multiplier || 1}x
• โหลดอ้างอิง (Pref): ${formatNum(result.refKw, 4)} kW
• จานหมุนคำนวณได้ (Pmeter): ${formatNum(result.meterKw, 4)} kW

📈 ผลการตรวจสอบ:
• ความคลาดเคลื่อน (% Error): ${sign}${formatNum(result.errorPercent, 2)}%
• เกณฑ์มาตรฐาน PEA: ±${formatNum(PEA_ERROR_TOLERANCE, 2)}%
• สถานะ: ${result.isNormal ? '✅ ปกติ (ผ่านเกณฑ์มาตรฐาน)' : result.errorPercent > 0 ? '❌ ผิดปกติ (หมุนเร็ว/คิดไฟเกิน)' : '❌ ผิดปกติ (หมุนช้า/คิดไฟขาด)'}
${form.notes ? `\n📝 บันทึกเพิ่มเติม: ${form.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Export history items to UTF-8 CSV with BOM for Thai Excel
 */
export function exportHistoryToCsv(records: HistoryRecord[]): void {
  if (records.length === 0) return;

  const headers = [
    'วันที่-เวลา',
    'หมายเลขมิเตอร์ PEA',
    'ชื่อผู้ใช้ไฟฟ้า/สถานที่',
    'ผู้ตรวจสอบ',
    'ค่าคงที่ (rev/kWh)',
    'จำนวนรอบ (N)',
    'เวลา (วินาที)',
    'ตัวคูณ (Multiplier)',
    'โหลดอ้างอิง Pref (kW)',
    'จานหมุน Pmeter (kW)',
    'ความคลาดเคลื่อน (% Error)',
    'สถานะผลการตรวจ',
    'บันทึก',
  ];

  const rows = records.map((r) => {
    const sign = r.errorPercent > 0 ? '+' : '';
    const status = r.isNormal ? 'ปกติ' : r.errorPercent > 0 ? 'หมุนเร็ว' : 'หมุนช้า';
    return [
      `"${r.dateStr} ${r.timestamp}"`,
      `"${r.meterNo || '-'}"`,
      `"${(r.customerName || r.location || '-').replace(/"/g, '""')}"`,
      `"${(r.inspectorName || '-').replace(/"/g, '""')}"`,
      r.revKwh,
      r.revolutions,
      r.timeSec,
      r.multiplier,
      r.refKw.toFixed(4),
      r.meterKw.toFixed(4),
      `"${sign}${r.errorPercent.toFixed(2)}%"`,
      `"${status}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  // UTF-8 BOM so Excel opens Thai characters without garbled text
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `PEA_Meter_Test_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
