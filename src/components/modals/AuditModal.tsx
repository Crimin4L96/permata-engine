import React from 'react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const logs = [
    { time: '2024-10-23 11:24:02 UTC', user: 'Ahmad Arif (Admin)', action: 'PROD DEPLOY', desc: 'Template FRBS9482387 promoted to Production active state' },
    { time: '2024-10-23 10:15:40 UTC', user: 'Hendra Gunawan (Checker)', action: 'CHECKER_APPROVE', desc: 'Verified and signed payload signature #CH-9921' },
    { time: '2024-10-23 09:44:12 UTC', user: 'Ahmad Arif (Maker)', action: 'MAKER_SUBMIT', desc: 'Updated message template markdown and dynamic parameter tokens' },
    { time: '2024-10-22 16:30:00 UTC', user: 'System (Automated)', action: 'VALIDATION_PASS', desc: 'Meta HSM schema and OJK regulatory compliance pre-flight 100% OK' },
  ];

  return (
    <div className="fixed inset-0 bg-[#001B3A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-[#0F172A] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0066FF] text-2xl">history</span>
            <div>
              <h3 className="text-base sm:text-lg text-[#002244] font-bold">
                Template Configuration Audit Ledger
              </h3>
              <p className="text-xs text-slate-500">Immutable SOX compliance audit trail v3.4</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-[#0F172A] p-1" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-3">
          {logs.map((log, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500">{log.time}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-mono font-bold text-[10px]">
                  {log.action}
                </span>
              </div>
              <div className="font-semibold text-[#002244]">{log.user}</div>
              <p className="text-slate-600">{log.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] cursor-pointer"
            type="button"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
