import React from 'react';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatrixModal: React.FC<MatrixModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const rules = [
    { rule: 'RULE-01', name: 'WhatsApp HSM Template Registration', maker: 'Engine Operator / Admin', checker: 'SecOps Lead', policy: 'Mandatory Dual-Control' },
    { rule: 'RULE-02', name: 'FCM / APNs Direct Push Broadcast (>50,000 users)', maker: 'Marketing Campaign Ops', checker: 'Department Head', policy: 'Mandatory Dual-Control' },
    { rule: 'RULE-03', name: 'SMS Masking Sender ID Provisioning', maker: 'Telecom Integration Engineer', checker: 'Regulatory Compliance Officer', policy: 'OJK Sign-Off Required' },
    { rule: 'RULE-04', name: 'Core Gateway Throughput Rate-Limit Override', maker: 'DevOps / SRE', checker: 'Principal Architect', policy: 'Mandatory Dual-Control' },
    { rule: 'RULE-05', name: 'Template Payload Variable Scheme Editing', maker: 'Template Maker', checker: 'Quality Checker', policy: 'Maker-Checker Compliant' },
    { rule: 'RULE-06', name: 'SMS to WhatsApp Auto-Failover Policy Toggle', maker: 'Network Ops', checker: 'Core Operations Manager', policy: 'Mandatory Dual-Control' },
  ];

  return (
    <div className="fixed inset-0 bg-[#001B3A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-[#0F172A] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0066FF] text-2xl">rule_folder</span>
            <div>
              <h3 className="text-base sm:text-lg text-[#002244] font-bold">
                Maker-Checker Governance Matrix
              </h3>
              <p className="text-xs text-slate-500">12 Active Dual-Control Authorization Rules</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-[#0F172A] p-1" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-2 text-xs">
          {rules.map((r) => (
            <div key={r.rule} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#0066FF]">{r.rule}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                  {r.policy}
                </span>
              </div>
              <span className="font-bold text-[#002244] text-xs sm:text-sm">{r.name}</span>
              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60">
                <span>Maker: <strong>{r.maker}</strong></span>
                <span>Checker: <strong>{r.checker}</strong></span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] cursor-pointer"
            type="button"
          >
            Close Matrix Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
