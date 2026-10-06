import React from 'react';
import {
  Download,
  Trash2,
  RotateCcw,
  FileSpreadsheet,
} from 'lucide-react';
import { HistoryRecord } from '../types/meter';
import { formatNum, exportHistoryToCsv } from '../utils/calculator';

interface HistoryListProps {
  records: HistoryRecord[];
  onRestore: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  records,
  onRestore,
  onDeleteRecord,
  onClearAll,
}) => {
  return (
    <div className="mt-6">
      <div className="bg-[#140e26]/85 backdrop-blur-xl border border-purple-500/25 rounded-3xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-400" />
              <span>ประวัติการทดสอบล่าสุด ({records.length})</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {records.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => exportHistoryToCsv(records)}
                  className="text-xs text-purple-300 hover:text-white bg-purple-900/50 hover:bg-purple-800 px-2.5 py-1 rounded-lg border border-purple-700/40 flex items-center gap-1 transition-colors"
                  title="ดาวน์โหลดไฟล์ CSV สำหรับ Excel"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>ส่งออก CSV</span>
                </button>

                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 px-2.5 py-1 rounded-lg border border-rose-900/40 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ล้างประวัติ</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* History Records List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {records.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              ยังไม่มีประวัติการคำนวณ
            </div>
          ) : (
            records.map((item) => {
              const sign = item.errorPercent > 0 ? '+' : '';
              return (
                <div
                  key={item.id}
                  className="p-3 bg-[#0a0715] hover:bg-[#0e0a1f] rounded-2xl border border-purple-950 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-white text-xs">
                        {item.revolutions} รอบ / {item.timeSec}s
                      </span>
                      <span className="text-[10px] text-purple-300 font-mono bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-900">
                        {item.revKwh} rev/kWh
                      </span>
                      {item.meterNo && (
                        <span className="text-[10px] text-amber-300 font-mono truncate max-w-[120px]">
                          #{item.meterNo}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      จานหมุน: {formatNum(item.meterKw, 3)} kW | อ้างอิง: {formatNum(item.refKw, 3)} kW
                      {item.customerName && ` • ${item.customerName}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold border ${
                          item.isNormal
                            ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                            : 'text-rose-400 bg-rose-950/60 border-rose-800'
                        }`}
                      >
                        {sign}
                        {formatNum(item.errorPercent, 2)}%
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {item.timestamp}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRestore(item)}
                      title="โหลดค่านี้กลับมาคำนวณ"
                      className="w-7 h-7 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-300 hover:text-white flex items-center justify-center transition-colors border border-purple-800/40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteRecord(item.id)}
                      title="ลบรายการนี้"
                      className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-rose-900/60 text-slate-500 hover:text-rose-300 flex items-center justify-center transition-colors border border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
