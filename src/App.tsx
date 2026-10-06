/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryList } from './components/HistoryList';
import { StopwatchModal } from './components/StopwatchModal';
import { KnowledgeModal } from './components/KnowledgeModal';
import { WorkOrderReportModal } from './components/WorkOrderReportModal';
import { MeterFormData, MeterCalculationResult, HistoryRecord } from './types/meter';
import { calculateMeter } from './utils/calculator';

const STORAGE_KEY_HISTORY = 'pea_induction_meter_history_v2';
const STORAGE_KEY_FORM = 'pea_induction_meter_last_form_v2';

const INITIAL_FORM: MeterFormData = {
  revKwh: 1200,
  revolutions: 5,
  timeSec: 36.45,
  refMode: 'direct',
  directKw: 2.45,
  phaseMode: '1phase',
  voltage: 220,
  current: 11.14,
  powerFactor: 1.0,
  currentA: 0,
  currentB: 0,
  currentC: 0,
  multiplier: 1,
  meterNo: '',
  customerName: '',
  location: '',
  inspectorName: '',
  notes: '',
};

export default function App() {
  const [form, setForm] = useState<MeterFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FORM);
      if (saved) {
        return { ...INITIAL_FORM, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return INITIAL_FORM;
  });

  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [isSavedInHistory, setIsSavedInHistory] = useState<boolean>(false);
  const [isStopwatchOpen, setIsStopwatchOpen] = useState<boolean>(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Compute calculation result live
  const result: MeterCalculationResult | null = useMemo(() => {
    return calculateMeter(form);
  }, [form]);

  // Save form to storage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(form));
    } catch {
      // ignore
    }
    setIsSavedInHistory(false);
  }, [form]);

  // Save history to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const handleFormChange = useCallback((updated: Partial<MeterFormData>) => {
    setForm((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleReset = useCallback(() => {
    setForm({
      revKwh: 1200,
      revolutions: 5,
      timeSec: 0,
      refMode: 'direct',
      directKw: 0,
      phaseMode: '1phase',
      voltage: 220,
      current: 0,
      powerFactor: 1.0,
      currentA: 0,
      currentB: 0,
      currentC: 0,
      multiplier: 1,
      meterNo: '',
      customerName: '',
      location: '',
      inspectorName: '',
      notes: '',
    });
    setIsSavedInHistory(false);
  }, []);

  const handleSaveToHistory = useCallback(() => {
    if (!result) return;

    const record: HistoryRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      dateStr: new Date().toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' }),
      meterNo: form.meterNo,
      customerName: form.customerName,
      location: form.location,
      inspectorName: form.inspectorName,
      revKwh: form.revKwh,
      revolutions: form.revolutions,
      timeSec: form.timeSec,
      refKw: result.refKw,
      meterKw: result.meterKw,
      errorPercent: result.errorPercent,
      isNormal: result.isNormal,
      multiplier: result.multiplier,
      notes: form.notes,
    };

    setHistory((prev) => [record, ...prev].slice(0, 30)); // Keep up to 30 records
    setIsSavedInHistory(true);
  }, [result, form]);

  const handleRestoreRecord = useCallback((record: HistoryRecord) => {
    setForm((prev) => ({
      ...prev,
      revKwh: record.revKwh,
      revolutions: record.revolutions,
      timeSec: record.timeSec,
      multiplier: record.multiplier,
      directKw: record.refKw,
      refMode: 'direct',
      meterNo: record.meterNo || prev.meterNo,
      customerName: record.customerName || prev.customerName,
      location: record.location || prev.location,
      inspectorName: record.inspectorName || prev.inspectorName,
      notes: record.notes || prev.notes,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteRecord = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearAllHistory = useCallback(() => {
    if (window.confirm('คุณต้องการลบประวัติการคำนวณทั้งหมดใช่หรือไม่?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    }
  }, []);

  const handleApplyStopwatchTime = useCallback((seconds: number, revolutionCount: number) => {
    setForm((prev) => ({
      ...prev,
      timeSec: seconds,
      revolutions: revolutionCount > 0 ? revolutionCount : prev.revolutions,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0916] text-slate-100 p-3 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Header
          onOpenStopwatch={() => setIsStopwatchOpen(true)}
          onOpenKnowledge={() => setIsKnowledgeOpen(true)}
          onReset={handleReset}
        />

        {/* Main Grid: Form (Left) & Results (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <InputForm
              form={form}
              onChange={handleFormChange}
              onCalculate={() => {
                if (result) handleSaveToHistory();
              }}
              onReset={handleReset}
              onOpenStopwatch={() => setIsStopwatchOpen(true)}
            />
          </div>

          <div className="lg:col-span-5">
            <ResultDisplay
              result={result}
              form={form}
              onOpenReport={() => setIsReportOpen(true)}
              onSaveHistory={handleSaveToHistory}
              isSaved={isSavedInHistory}
            />
          </div>
        </div>

        {/* Bottom Section: Formula and History */}
        <HistoryList
          records={history}
          onRestore={handleRestoreRecord}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAllHistory}
        />

        {/* Footer */}
        <footer className="mt-10 py-6 text-center text-xs text-purple-400/60 border-t border-purple-950 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PEA Induction Disc Meter Inspection System • การไฟฟ้าส่วนภูมิภาค</span>
          <span>เกณฑ์มาตรฐานความคลาดเคลื่อนยอมรับได้: ±2.00%</span>
        </footer>
      </div>

      {/* Modals */}
      <StopwatchModal
        isOpen={isStopwatchOpen}
        onClose={() => setIsStopwatchOpen(false)}
        onApplyTime={handleApplyStopwatchTime}
        initialRevolutions={form.revolutions}
      />

      <KnowledgeModal
        isOpen={isKnowledgeOpen}
        onClose={() => setIsKnowledgeOpen(false)}
      />

      <WorkOrderReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        form={form}
        result={result}
      />
    </div>
  );
}
