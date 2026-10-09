import React from 'react';

interface DiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const DiffModal: React.FC<DiffModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#001B3A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 text-[#0F172A] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0066FF] text-2xl">difference</span>
            <div>
              <h3 className="text-base sm:text-lg text-[#002244] font-bold">
                WhatsApp Template Revision Diff
              </h3>
              <p className="text-xs text-slate-500">
                Comparing Production Active (v2.0) vs Working Draft (v3.0)
              </p>
            </div>
          </div>
          <button
            className="text-slate-400 hover:text-[#0F172A] p-1 rounded-lg cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs font-mono">
          {/* Header metadata diff */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Current PROD (v2.0)</span>
              <span className="text-xs font-semibold text-slate-800">WA_PERMATA_TXN_NOTIF_V2</span>
              <div className="text-[11px] text-slate-500 mt-1">Header: TEXT (&quot;NOTIFIKASI PERMATA&quot;)</div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Working Draft (v3.0)</span>
              <span className="text-xs font-semibold text-emerald-700 font-bold">WA_PERMATA_TXN_NOTIF_V3</span>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                Header: PDF e-Receipt (Signed auto-statement)
              </div>
            </div>
          </div>

          {/* Body diff */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-[#002244] border-b border-slate-200">
              Message Body &amp; Tags Diff
            </div>
            <div className="p-3 text-xs leading-relaxed space-y-1 font-mono">
              <div className="text-slate-500">  Halo Nasabah PermataBank Yth. *{'{1}'}*,</div>
              <div className="bg-red-50 text-red-700 px-1 rounded line-through">
                - Transaksi debit rekening *{'{2}'}* sebesar IDR *{'{3}'}* telah berhasil diproses.
              </div>
              <div className="bg-emerald-50 text-emerald-800 px-1 rounded font-semibold">
                + Transaksi debit rekening *{'{2}'}* sebesar *IDR {'{3}'}* ke tujuan *{'{4}'}* berhasil diproses pada sistem core banking kami.
              </div>
              <div className="bg-emerald-50 text-emerald-800 px-1 rounded font-semibold">
                + No. Referensi: *{'{5}'}*
              </div>
              <div className="bg-emerald-50 text-emerald-800 px-1 rounded font-semibold">
                + Waktu: *{'{6}'} WIB*
              </div>
              <div className="text-slate-500">  Apabila Anda tidak mengenali transaksi ini, segera lakukan pemblokiran kartu dan amankan akun melalui PermataTel 1500-111.</div>
            </div>
          </div>

          {/* Action buttons diff */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-[#002244] block mb-2">Button Actions:</span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Unchanged: [CALL] Hubungi PermataTel 1500-111</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Unchanged: [URL] Buka PermataMobile X</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 p-1 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>+ Added Action: [QUICK REPLY] Saya Mengenali Transaksi Ini</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-slate-100 text-[#002244] hover:bg-slate-200 text-xs font-semibold cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Close Diff
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#0066FF] text-white hover:bg-[#0052CC] text-xs font-bold shadow-md cursor-pointer"
            onClick={() => {
              onClose();
              showToast('Audit comparison approved for submission', 'success');
            }}
            type="button"
          >
            Acknowledge Changes
          </button>
        </div>
      </div>
    </div>
  );
};
