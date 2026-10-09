import React, { useState } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [includeNotif, setIncludeNotif] = useState(true);
  const [includeSms, setIncludeSms] = useState(true);
  const [includeWa, setIncludeWa] = useState(true);
  const [includeCost, setIncludeCost] = useState(true);
  const [format, setFormat] = useState<'csv' | 'pdf' | 'json'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();

      // Trigger dummy file download
      const filename = `Permata_Engine_Consolidated_Report_${Date.now()}.${format}`;
      const dummyContent = format === 'json'
        ? JSON.stringify({ cluster: 'PERMATA-DC-ID-01', timestamp: new Date().toISOString(), status: 'HEALTHY' }, null, 2)
        : `Timestamp,Engine,Template,Recipient,Status\n14:48:12,Notification,FRBS9482387,CUST-883921980,DELIVERED\n14:48:11,SMS,OTP-AUTH-3990,+628129843XXXX,DELIVERED\n`;

      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Consolidated report downloaded successfully (${filename})`, 'success');
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-[#001B3A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0066FF] text-2xl">file_download</span>
            <h3 className="text-base sm:text-lg text-[#002244] font-bold">
              Export Cross-Engine Consolidated Report
            </h3>
          </div>
          <button
            className="text-slate-400 hover:text-[#0F172A] p-1 rounded-lg cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="py-4 flex flex-col gap-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
              Target Engine Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  checked={includeNotif}
                  onChange={(e) => setIncludeNotif(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  type="checkbox"
                />
                <span className="font-medium text-[#002244]">Notification Engine (Push)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  checked={includeSms}
                  onChange={(e) => setIncludeSms(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  type="checkbox"
                />
                <span className="font-medium text-[#002244]">SMS Gateway (SMPP)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  checked={includeWa}
                  onChange={(e) => setIncludeWa(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  type="checkbox"
                />
                <span className="font-medium text-[#002244]">WhatsApp Engine (Meta)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  checked={includeCost}
                  onChange={(e) => setIncludeCost(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-[#0066FF]"
                  type="checkbox"
                />
                <span className="font-medium text-[#002244]">Cost &amp; SLA Breakdown</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
              Export Format
            </label>
            <div className="flex items-center flex-wrap gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#002244] cursor-pointer">
                <input
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                  className="text-[#0066FF] focus:ring-[#0066FF]"
                  name="export-format"
                  type="radio"
                  value="csv"
                />
                <span>CSV Spreadsheet (.csv)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#002244] cursor-pointer">
                <input
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  className="text-[#0066FF] focus:ring-[#0066FF]"
                  name="export-format"
                  type="radio"
                  value="pdf"
                />
                <span>Executive PDF (.pdf)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#002244] cursor-pointer">
                <input
                  checked={format === 'json'}
                  onChange={() => setFormat('json')}
                  className="text-[#0066FF] focus:ring-[#0066FF]"
                  name="export-format"
                  type="radio"
                  value="json"
                />
                <span>Raw JSON Telemetry (.json)</span>
              </label>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-200">
            <div className="flex items-center justify-between font-mono">
              <span>Generated By: <strong>Ahmad Arif (Admin)</strong></span>
              <span>Ref: <strong>EXP-2025-05-HUB</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-slate-100 text-[#002244] hover:bg-slate-200 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#0066FF] text-white hover:bg-[#0052CC] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            onClick={handleDownload}
            disabled={isExporting}
            type="button"
          >
            <span className={`material-symbols-outlined text-sm ${isExporting ? 'animate-spin' : ''}`}>
              {isExporting ? 'refresh' : 'download'}
            </span>
            <span>{isExporting ? 'Compiling File...' : 'Download Consolidated Export'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
