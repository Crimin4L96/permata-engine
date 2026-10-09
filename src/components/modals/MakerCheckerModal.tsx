import React from 'react';

interface MakerCheckerModalProps {
  taskTitle: string | null;
  onClose: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const MakerCheckerModal: React.FC<MakerCheckerModalProps> = ({
  taskTitle,
  onClose,
  showToast,
}) => {
  if (!taskTitle) return null;

  const handleApprove = () => {
    onClose();
    showToast(`Task "${taskTitle}" approved by Checker and committed to PROD`, 'success');
  };

  const handleReject = () => {
    onClose();
    showToast(`Task "${taskTitle}" rejected with remarks to submitter`, 'error');
  };

  return (
    <div className="fixed inset-0 bg-[#001B3A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-[#0F172A]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0066FF] text-2xl">verified_user</span>
            <div>
              <h3 className="text-base sm:text-lg text-[#002244] font-bold">
                Dual-Control Approval Inspection
              </h3>
              <span className="text-xs text-slate-500 font-mono">Permata SOX / OJK Protocol</span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-[#0F172A] p-1" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs sm:text-sm">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold block">Requested Action</span>
            <span className="text-base font-bold text-[#002244] block mt-0.5">{taskTitle}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Submitter (Maker)</span>
              <span className="font-semibold text-[#0F172A] text-xs">Ahmad Arif (OPS-441)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Timestamp</span>
              <span className="font-mono text-xs text-slate-700">Today 14:12:08 WIB</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-[#002244] leading-relaxed">
            <strong>Payload Summary:</strong> Temporary throughput rate-limit increase for SMS &amp; WhatsApp gateways from 2,500 TPS to 4,000 TPS for peak campaign dispatches. Requires Dual-Control approval before applying live configuration to gateway proxies.
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer border border-red-200"
            onClick={handleReject}
            type="button"
          >
            Reject Request
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            onClick={handleApprove}
            type="button"
          >
            Authorize &amp; Execute
          </button>
        </div>
      </div>
    </div>
  );
};
