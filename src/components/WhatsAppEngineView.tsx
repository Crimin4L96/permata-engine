import React, { useState, useRef } from 'react';
import { Role } from '../types';

export type WhatsAppSubScreen = 'studio' | 'directory' | 'account' | 'conversations' | 'failover';

interface WhatsAppEngineViewProps {
  currentRole: Role;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenDiffModal: () => void;
  activeSubScreen?: WhatsAppSubScreen;
  setActiveSubScreen?: (screen: WhatsAppSubScreen) => void;
}

export const WhatsAppEngineView: React.FC<WhatsAppEngineViewProps> = ({
  currentRole,
  showToast,
  onOpenDiffModal,
  activeSubScreen: controlledSubScreen,
  setActiveSubScreen: setControlledSubScreen,
}) => {
  const [internalSubScreen, setInternalSubScreen] = useState<WhatsAppSubScreen>('studio');
  const subScreen = controlledSubScreen || internalSubScreen;
  const setSubScreen = setControlledSubScreen || setInternalSubScreen;

  // Category state
  const [category, setCategory] = useState<'UTILITY' | 'AUTHENTICATION' | 'MARKETING'>('UTILITY');
  const [displayTitle, setDisplayTitle] = useState('PermataBank Real-time Debit Alert');
  
  // Header state
  const [headerType, setHeaderType] = useState<'NONE' | 'TEXT' | 'IMAGE' | 'DOCUMENT'>('DOCUMENT');

  // Body state
  const [bodyText, setBodyText] = useState(
`Halo Nasabah PermataBank Yth. *{{1}}*,

Transaksi debit rekening *{{2}}* sebesar *IDR {{3}}* ke tujuan *{{4}}* berhasil diproses pada sistem core banking kami.

No. Referensi: *{{5}}*
Waktu: *{{6}} WIB*

Apabila Anda tidak mengenali transaksi ini, segera lakukan pemblokiran kartu dan amankan akun melalui PermataTel 1500-111.`
  );

  const [footerText, setFooterText] = useState('PermataBank berizin & diawasi oleh OJK dan BI.');

  // Buttons state
  const [btnCallText, setBtnCallText] = useState('Hubungi PermataTel 1500-111');
  const [btnUrlText, setBtnUrlText] = useState('Buka PermataMobile X');
  const [btnQuickText, setBtnQuickText] = useState('Saya Mengenali Transaksi Ini');

  // Failover state
  const [isFailoverActive, setIsFailoverActive] = useState(true);
  const [failoverTimeout, setFailoverTimeout] = useState('60');

  // Submit & Save buttons
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Template Directory data
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCategory, setDirectoryCategory] = useState('ALL');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic values for simulator preview
  const sampleValues: Record<string, string> = {
    '{{1}}': 'Bambang Susanto',
    '{{2}}': '•••4829',
    '{{3}}': '2.500.000',
    '{{4}}': 'Bank BCA (Transfer BI-FAST)',
    '{{5}}': 'TXN-20241029-9482',
    '{{6}}': '09:41:02',
  };

  const renderFormattedWhatsApp = (text: string) => {
    if (!text) return '';
    let result = text;
    for (const [key, val] of Object.entries(sampleValues)) {
      result = result.split(key).join(val);
    }
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    result = result.replace(/\*(.*?)\*/g, '<strong class="font-bold text-[#0F172A]">$1</strong>');
    result = result.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
    result = result.replace(/~(.*?)~/g, '<del class="line-through">$1</del>');
    return result;
  };

  const handleInsertTag = (tag: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const current = bodyText;
    const tagText = ` *${tag}* `;
    const updated = current.substring(0, start) + tagText + current.substring(end);
    setBodyText(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tagText.length;
      }
    }, 10);
    showToast(`Injected dynamic tag ${tag} into template body`, 'info');
  };

  const handleSubmitToMeta = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      showToast('Meta Review Requested (#WABA-8821) successfully submitted!', 'success');
      setTimeout(() => {
        setIsSubmittedSuccess(false);
      }, 4000);
    }, 1400);
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      showToast('Template draft saved successfully (Local & Cloud Sync)', 'success');
    }, 700);
  };

  const hsmTemplates = [
    { code: 'WA_PERMATA_TXN_NOTIF_V3', title: 'PermataBank Real-time Debit Alert', cat: 'UTILITY', status: 'APPROVED', quality: 'HIGH', tps: '1,420/s', updated: '2024-10-23' },
    { code: 'WA_PERMATA_OTP_AUTH_V1', title: 'Permata Mobile X Biometric OTP', cat: 'AUTHENTICATION', status: 'APPROVED', quality: 'HIGH', tps: '850/s', updated: '2024-10-21' },
    { code: 'WA_PERMATA_E_STATEMENT', title: 'Monthly e-Statement Encrypted PDF', cat: 'UTILITY', status: 'APPROVED', quality: 'HIGH', tps: '520/s', updated: '2024-10-18' },
    { code: 'WA_PERMATA_PROMO_CASHBACK', title: 'Permata ME QRIS 10% Cashback Promo', cat: 'MARKETING', status: 'APPROVED', quality: 'MEDIUM', tps: '310/s', updated: '2024-10-15' },
    { code: 'WA_PERMATA_LOAN_APPROVAL', title: 'KTA Permata Speed Loan Pre-Approval', cat: 'UTILITY', status: 'IN_REVIEW', quality: 'PENDING', tps: '0/s', updated: '2024-10-24' },
    { code: 'WA_PERMATA_CARD_FRAUD_WARN', title: 'Urgent Credit Card Security Warning', cat: 'UTILITY', status: 'APPROVED', quality: 'HIGH', tps: '95/s', updated: '2024-10-10' },
  ];

  const filteredHsm = hsmTemplates.filter((t) => {
    if (directoryCategory !== 'ALL' && t.cat !== directoryCategory) return false;
    if (directorySearch.trim()) {
      const q = directorySearch.toLowerCase();
      return t.code.toLowerCase().includes(q) || t.title.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full">
      {/* Sub-navigation tabs within WhatsApp Engine */}
      <div className="bg-[#002244] text-white px-4 md:px-8 py-2.5 flex items-center justify-between overflow-x-auto border-b border-[#003366] shadow-sm">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold mr-2 hidden sm:inline">
            WhatsApp Views:
          </span>
          <button
            type="button"
            onClick={() => setSubScreen('studio')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'studio'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">assignment</span>
            <span>HSM Template Studio (Active)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('directory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'directory'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">folder_open</span>
            <span>Template Directory (6)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('account')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'account'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">domain_verification</span>
            <span>Meta Account (WABA)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('conversations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'conversations'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">forum</span>
            <span>2-Way Conversations</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Meta Cloud Singapore • High Quality</span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* SCREEN 1: HSM TEMPLATE STUDIO (MATCHES IMAGE 1) */}
      {/* ============================================================= */}
      {subScreen === 'studio' && (
        <>
          {/* Sub-Header / Operational Control Ribbon */}
          <div className="bg-white px-4 md:px-8 py-4 shadow-xs mb-6 border-b border-slate-200">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              {/* Title & Meta Credentials */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0066FF] transition-colors text-xs font-semibold cursor-pointer"
                    onClick={() => setSubScreen('directory')}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    <span>Template Directory</span>
                  </button>
                  <span className="text-slate-300 font-mono text-xs">/</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3FF] text-[#0066FF] text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">api</span>
                    Meta Business API v20.0
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-sm text-emerald-600 fill">verified</span>
                    WABA Official Verified
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                  <h1 className="text-xl md:text-2xl text-[#0F172A] tracking-tight font-bold">
                    WhatsApp Template Studio
                  </h1>
                  <span className="self-start px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-medium border border-slate-200">
                    WABA-ID: 8849-0192-PERMATA
                  </span>
                </div>
              </div>

              {/* Live Meta API Strip & Control Triggers */}
              <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-end xl:self-center flex-wrap">
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Meta WABA Status
                    </span>
                    <span className="font-mono text-xs text-emerald-600 font-bold flex items-center justify-end gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Tier 4 Unlimited • High Quality
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenDiffModal}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-slate-500">history</span>
                  <span>Diff</span>
                </button>

                <button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-[#0F172A] text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  type="button"
                >
                  {isSavingDraft ? 'Saving Draft...' : 'Save Draft'}
                </button>

                <button
                  onClick={handleSubmitToMeta}
                  disabled={isSubmitting}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSubmittedSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#0066FF] hover:bg-[#0052CC]'
                  }`}
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                      <span>Registering with Meta...</span>
                    </>
                  ) : isSubmittedSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-base">task_alt</span>
                      <span>Meta Review Requested (#WABA-8821)</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      <span>Submit to Meta</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Operational Telemetry Cards Strip */}
          <div className="px-4 md:px-8 mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-white shadow-xs flex flex-col justify-between border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                    24h Delivery SLA
                  </span>
                  <span className="material-symbols-outlined text-emerald-600 text-lg">done_all</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-[#0F172A]">99.42%</span>
                  <span className="font-mono text-xs text-emerald-600 font-semibold">+0.18%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.42%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white shadow-xs flex flex-col justify-between border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                    Avg Read Velocity
                  </span>
                  <span className="material-symbols-outlined text-[#0066FF] text-lg">visibility</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-[#0F172A]">87.15%</span>
                  <span className="font-mono text-xs text-slate-500">&lt; 14 sec</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#0066FF] h-full rounded-full" style={{ width: '87.15%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white shadow-xs flex flex-col justify-between border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                    SMS Fallbacks Today
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-lg">forward_to_inbox</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-[#0F172A]">1,418</span>
                  <span className="text-[11px] text-slate-500">0.58% fail</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white shadow-xs flex flex-col justify-between border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold">
                    Active Templates
                  </span>
                  <span className="material-symbols-outlined text-[#0066FF] text-lg">token</span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-[#0F172A]">48</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">4 in review</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#0066FF] h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Workspace: Split Editor & Device Simulator */}
          <div className="px-4 md:px-8 pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Template Specification Workbench */}
              <div className="xl:col-span-7 flex flex-col gap-6">
                {/* Card 1: Permata HSM Template Header & Base Meta */}
                <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200">
                  <div className="h-11 bg-[#001B3A] px-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#EBF3FF]">assignment</span>
                      <span className="text-sm font-bold tracking-wide">1. Template Identity &amp; Classification</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] uppercase font-bold tracking-wider text-slate-200">
                      Meta HSM Spec
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Template Technical Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            className="w-full h-10 px-3 bg-slate-50 text-[#0F172A] font-mono text-xs rounded-lg font-semibold cursor-not-allowed outline-none select-all border border-slate-200"
                            readOnly
                            type="text"
                            value="WA_PERMATA_TXN_NOTIF_V3"
                          />
                          <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-sm">
                            lock
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Permanent Meta HSM identifier (immutable once submitted).
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Meta WABA Category <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setCategory('UTILITY')}
                            className={`py-1.5 rounded text-center text-xs transition-all font-bold cursor-pointer ${
                              category === 'UTILITY'
                                ? 'bg-[#0066FF] text-white shadow-xs'
                                : 'text-slate-600 hover:text-[#0F172A]'
                            }`}
                          >
                            UTILITY
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategory('AUTHENTICATION')}
                            className={`py-1.5 rounded text-center text-xs transition-all font-bold cursor-pointer ${
                              category === 'AUTHENTICATION'
                                ? 'bg-[#0066FF] text-white shadow-xs'
                                : 'text-slate-600 hover:text-[#0F172A]'
                            }`}
                          >
                            AUTH (OTP)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategory('MARKETING')}
                            className={`py-1.5 rounded text-center text-xs transition-all font-bold cursor-pointer ${
                              category === 'MARKETING'
                                ? 'bg-[#0066FF] text-white shadow-xs'
                                : 'text-slate-600 hover:text-[#0F172A]'
                            }`}
                          >
                            MARKETING
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Subject to Meta tiered conversation rates.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                            Display Title
                          </label>
                          <span className="font-mono text-xs text-slate-500">
                            {displayTitle.length}/60
                          </span>
                        </div>
                        <input
                          className="w-full h-10 px-3 text-[#0F172A] text-sm rounded-lg outline-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0066FF] border border-slate-200"
                          maxLength={60}
                          type="text"
                          value={displayTitle}
                          onChange={(e) => setDisplayTitle(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Broadcast Channel Binding
                        </label>
                        <div className="h-10 px-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
                          <span className="text-sm font-semibold text-[#0F172A]">
                            PERMATAMOBILE X &amp; BI-FAST
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#EBF3FF] text-[#0066FF] text-xs font-bold">
                            CORE ROUTED
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        Language &amp; Region
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#0F172A] text-xs sm:text-sm flex items-center gap-2 border border-slate-200 font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
                          id_ID (Indonesian - Primary)
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-xs sm:text-sm flex items-center gap-2 border border-slate-200">
                          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                          en_US (English - Fallback Pack)
                        </span>
                        <button
                          className="text-[#0066FF] hover:text-[#0052CC] text-xs sm:text-sm flex items-center gap-1 font-semibold ml-1 cursor-pointer"
                          type="button"
                          onClick={() => showToast('Additional locale packs: zh_CN, ms_MY available', 'info')}
                        >
                          <span className="material-symbols-outlined text-sm">add_circle</span> Add Locale
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Interactive Template Payload Editor */}
                <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200">
                  <div className="h-11 bg-[#001B3A] px-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#EBF3FF]">chat</span>
                      <span className="text-sm font-bold tracking-wide">
                        2. WhatsApp Message Composition &amp; Dynamic Tags
                      </span>
                    </div>
                    <span className="text-[10px] text-[#EBF3FF] bg-white/10 px-2 py-0.5 rounded font-semibold uppercase">
                      Strict Meta Format
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Header Type (Optional)
                        </label>
                        <span className="text-xs text-[#0066FF] font-semibold">
                          Selected: {headerType === 'NONE' ? 'None' : headerType === 'TEXT' ? 'Text Header' : headerType === 'IMAGE' ? 'Image Media' : 'PDF e-Receipt'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setHeaderType('NONE')}
                          className={`py-2 px-3 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            headerType === 'NONE'
                              ? 'bg-[#0066FF] text-white shadow-xs border border-[#0066FF]'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          None
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderType('TEXT')}
                          className={`py-2 px-3 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            headerType === 'TEXT'
                              ? 'bg-[#0066FF] text-white shadow-xs border border-[#0066FF]'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          Text Header
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderType('IMAGE')}
                          className={`py-2 px-3 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            headerType === 'IMAGE'
                              ? 'bg-[#0066FF] text-white shadow-xs border border-[#0066FF]'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          Image Media
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeaderType('DOCUMENT')}
                          className={`py-2 px-3 rounded-lg text-center text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            headerType === 'DOCUMENT'
                              ? 'bg-[#0066FF] text-white shadow-xs border border-[#0066FF]'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          PDF e-Receipt
                        </button>
                      </div>

                      {headerType === 'DOCUMENT' && (
                        <div className="p-2.5 rounded-lg bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200 animate-in fade-in">
                          <div className="flex items-center gap-2 text-[#0F172A] text-xs sm:text-sm">
                            <span className="material-symbols-outlined text-red-500 text-lg">picture_as_pdf</span>
                            <span className="font-semibold">Permata_Transaction_Receipt_{'{{1}}'}.pdf</span>
                            <span className="font-mono text-[11px] text-slate-500">(Auto BI-FAST statement)</span>
                          </div>
                          <button
                            onClick={() => showToast('PDF template schema: Permata Secure Signed Statement v2.4', 'info')}
                            className="text-[#0066FF] text-xs hover:underline font-semibold self-start sm:self-auto cursor-pointer"
                            type="button"
                          >
                            Configure Template Schema
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Template Body (HSM Payload) <span className="text-red-500">*</span>
                        </label>
                        <span className="font-mono text-xs text-slate-500">
                          {bodyText.length} / 1024
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 flex items-center gap-1.5 flex-wrap border border-slate-200">
                        <span className="text-[11px] text-slate-500 mr-1 font-semibold">Insert Tag:</span>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('{{1}}')}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{{1}}'} Cust Name
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('{{2}}')}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{{2}}'} Account
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('{{3}}')}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{{3}}'} Amount IDR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('{{4}}')}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{{4}}'} Dest Bank
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('{{5}}')}
                          className="px-2.5 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{{5}}'} Ref Num
                        </button>
                      </div>

                      <textarea
                        ref={textareaRef}
                        className="w-full p-3.5 bg-slate-50 text-[#0F172A] text-sm rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-[#0066FF] font-mono resize-y border border-slate-200 leading-relaxed"
                        rows={7}
                        value={bodyText}
                        onChange={(e) => setBodyText(e.target.value)}
                      />

                      <div className="flex items-center justify-between text-slate-500 text-xs">
                        <span>Gunakan format WhatsApp: *bold*, _italic_, ~strikethrough~.</span>
                        <span className="text-emerald-600 flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-sm">check_circle</span> Meta Rules Valid
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Footer Disclaimer (Optional)
                        </label>
                        <span className="font-mono text-xs text-slate-500">
                          {footerText.length}/60
                        </span>
                      </div>
                      <input
                        className="w-full h-10 px-3 bg-slate-50 rounded-lg text-[#0F172A] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#0066FF] border border-slate-200"
                        maxLength={60}
                        type="text"
                        value={footerText}
                        onChange={(e) => setFooterText(e.target.value)}
                      />
                    </div>

                    {/* Interactive Buttons */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Interactive Buttons &amp; CTA Actions (Max 3)
                        </label>
                        <button
                          className="text-[#0066FF] text-xs sm:text-sm flex items-center gap-1 hover:underline font-semibold cursor-pointer"
                          type="button"
                          onClick={() => showToast('Maximum 3 buttons reached according to Meta WABA spec', 'warning')}
                        >
                          <span className="material-symbols-outlined text-sm">add</span> Add Action
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-[#0F172A] text-[10px] font-bold shrink-0">
                              CALL
                            </span>
                            <input
                              className="bg-transparent text-xs sm:text-sm font-semibold text-[#0F172A] outline-none border-b border-transparent focus:border-[#0066FF] flex-1 min-w-0"
                              type="text"
                              value={btnCallText}
                              onChange={(e) => setBtnCallText(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <span className="font-mono text-xs text-slate-500">+62211500111</span>
                            <span className="material-symbols-outlined text-slate-400 text-base">phone_in_talk</span>
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <span className="px-2 py-0.5 rounded bg-[#EBF3FF] text-[#0066FF] text-[10px] font-bold shrink-0">
                              URL
                            </span>
                            <input
                              className="bg-transparent text-xs sm:text-sm font-semibold text-[#0F172A] outline-none border-b border-transparent focus:border-[#0066FF] flex-1 min-w-0"
                              type="text"
                              value={btnUrlText}
                              onChange={(e) => setBtnUrlText(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <span className="font-mono text-xs text-slate-500 truncate max-w-[150px] sm:max-w-[180px]">
                              permatamobilex.page.link
                            </span>
                            <span className="material-symbols-outlined text-slate-400 text-base">link</span>
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200">
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">
                              QUICK
                            </span>
                            <input
                              className="bg-transparent text-xs sm:text-sm font-semibold text-[#0F172A] outline-none border-b border-transparent focus:border-[#0066FF] flex-1 min-w-0"
                              type="text"
                              value={btnQuickText}
                              onChange={(e) => setBtnQuickText(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                            <span className="font-mono text-xs text-slate-500">CONFIRM_TXN_OK</span>
                            <span className="material-symbols-outlined text-slate-400 text-base">touch_app</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Multi-Channel Failover Guard */}
                <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200">
                  <div className="h-11 bg-[#001B3A] px-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#EBF3FF]">hub</span>
                      <span className="text-sm font-bold tracking-wide">
                        3. Multi-Channel Failover Guard (SMS Fallback)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
                      {isFailoverActive ? 'Active Policy' : 'Disabled'}
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base text-[#0F172A] font-bold">
                          Auto-failover to Permata SMS Gateway
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          Jika WhatsApp berstatus Undelivered melampaui timeout SLA, engine otomatis dispatch payload ke SMS Gateway.
                        </span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                          checked={isFailoverActive}
                          onChange={(e) => {
                            setIsFailoverActive(e.target.checked);
                            showToast(
                              e.target.checked
                                ? 'Multi-channel SMS fallback guard activated'
                                : 'SMS fallback policy paused',
                              'info'
                            );
                          }}
                          className="sr-only peer"
                          type="checkbox"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066FF]"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
                      <div className="p-3 rounded-lg bg-slate-50 flex flex-col gap-1 border border-slate-200">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Fallback Timeout SLA
                        </span>
                        <div className="flex items-center justify-between">
                          <select
                            value={failoverTimeout}
                            onChange={(e) => setFailoverTimeout(e.target.value)}
                            className="bg-transparent text-sm sm:text-base text-[#0F172A] font-semibold outline-none cursor-pointer"
                          >
                            <option value="60">60 Detik (Tier 1)</option>
                            <option value="90">90 Detik</option>
                            <option value="120">120 Detik</option>
                          </select>
                          <span className="material-symbols-outlined text-slate-400 text-base">timer</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Mandatory SLA untuk BI-FAST realtime debit alert.
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 flex flex-col gap-1 border border-slate-200">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          SMS Masking Template ID
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base text-[#0F172A] font-semibold">
                            SMS_DEBIT_ALERT_V4
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-[10px] font-semibold">
                            Telkomsel / Indosat
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Koneksi SMPP langsung ke Permata SMS Engine.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: WhatsApp Simulator */}
              <div className="xl:col-span-5 flex flex-col gap-4 xl:sticky xl:top-24 w-full">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0066FF] text-xl">smartphone</span>
                    <span className="text-sm text-[#0F172A] font-bold">WhatsApp Smartphone Simulator</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-xs text-emerald-600 font-bold">Live Synchronized</span>
                  </div>
                </div>

                <div className="max-w-[380px] w-full mx-auto bg-slate-900 rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-700/60 ring-1 ring-black/20">
                  <div className="w-full bg-[#EFEAE2] rounded-[36px] overflow-hidden flex flex-col min-h-[580px] relative shadow-inner">
                    <div className="bg-[#001B3A] px-5 pt-3 pb-2 flex items-center justify-between text-white select-none">
                      <span className="font-mono text-xs font-semibold">09:41</span>
                      <div className="w-16 h-4 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-black/80"></div>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="material-symbols-outlined text-xs">signal_cellular_4_bar</span>
                        <span className="material-symbols-outlined text-xs">wifi</span>
                        <span className="material-symbols-outlined text-xs">battery_full</span>
                      </div>
                    </div>

                    <div className="bg-[#001B3A] text-white px-3 py-2 flex items-center justify-between shadow-md border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg cursor-pointer">arrow_back</span>
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs overflow-hidden p-1 ring-2 ring-[#0066FF]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5L18.5 12 12 18.5 5.5 12 12 5.5z" fill="#0066FF" />
                            </svg>
                          </div>
                          <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-emerald-400 text-sm bg-[#001B3A] rounded-full fill">
                            verified
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 leading-tight">
                            <span className="text-xs font-bold text-white">PermataBank</span>
                            <span className="material-symbols-outlined text-emerald-400 text-xs fill">check_circle</span>
                          </div>
                          <span className="text-[10px] text-slate-300 leading-tight">Official Business Account</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-slate-300">
                        <span className="material-symbols-outlined text-base cursor-pointer">videocam</span>
                        <span className="material-symbols-outlined text-base cursor-pointer">call</span>
                        <span className="material-symbols-outlined text-base cursor-pointer">more_vert</span>
                      </div>
                    </div>

                    <div className="flex-1 p-3 flex flex-col justify-end gap-2 bg-[radial-gradient(#00224412_1px,transparent_1px)] [background-size:14px_14px]">
                      <div className="self-center px-2.5 py-1 rounded-md bg-[#FFF7D6] text-[#614D00] text-center text-[10px] shadow-xs max-w-[92%] flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-xs">lock</span>
                        <span>Pesan ini dikirim oleh akun resmi PermataBank.</span>
                      </div>

                      <div className="self-center px-2 py-0.5 rounded-full bg-white/90 text-slate-500 text-[10px] shadow-xs font-semibold">
                        HARI INI
                      </div>

                      <div className="self-start max-w-[96%] bg-white rounded-lg rounded-tl-none shadow-[0_1px_3px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden border border-black/5">
                        {headerType === 'DOCUMENT' && (
                          <div className="p-2 bg-slate-50 flex items-center justify-between gap-2.5 border-b border-slate-100 transition-all">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-[#0F172A] truncate">
                                  Permata_Receipt_TXN984.pdf
                                </span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  142 KB • 1 page • Signed
                                </span>
                              </div>
                            </div>
                            <div
                              onClick={() => showToast('Downloading simulated e-receipt PDF...', 'info')}
                              className="p-1 rounded-full bg-white text-[#0066FF] shadow-xs cursor-pointer hover:bg-slate-100"
                            >
                              <span className="material-symbols-outlined text-sm">download</span>
                            </div>
                          </div>
                        )}

                        {headerType === 'TEXT' && (
                          <div className="px-3 pt-2 pb-1 border-b border-slate-100 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                            NOTIFIKASI RESMI PERMATABANK
                          </div>
                        )}

                        {headerType === 'IMAGE' && (
                          <div className="w-full h-28 bg-[#001B3A] rounded-t flex flex-col items-center justify-center text-white border-b border-slate-200">
                            <span className="material-symbols-outlined text-3xl text-[#EBF3FF]">account_balance</span>
                            <span className="text-[10px] font-mono text-slate-300 mt-1">PermataMobile X Direct Alert</span>
                          </div>
                        )}

                        <div className="px-2.5 pt-2 pb-1 flex flex-col">
                          <div
                            className="text-[#0F172A] text-xs whitespace-pre-line leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderFormattedWhatsApp(bodyText) }}
                          />

                          <div className="mt-2 pt-1 flex items-end justify-between text-slate-500 border-t border-slate-100">
                            <span className="text-[10px] text-slate-500">{footerText}</span>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <span className="font-mono text-[10px] text-slate-500">09:41</span>
                              <span className="material-symbols-outlined text-[#34B7F1] text-[14px] leading-none fill">
                                done_all
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => showToast(`Dialing ${btnCallText}...`, 'info')}
                          className="w-full py-2 px-3 bg-slate-50/70 hover:bg-slate-100 text-[#0066FF] text-xs flex items-center justify-center gap-1.5 transition-colors border-t border-slate-100 font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-[#0066FF]">call</span>
                          <span>{btnCallText}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => showToast(`Opening PermataMobile X deep link...`, 'info')}
                          className="w-full py-2 px-3 bg-slate-50/70 hover:bg-slate-100 text-[#0066FF] text-xs flex items-center justify-center gap-1.5 transition-colors border-t border-slate-100 font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-[#0066FF]">open_in_new</span>
                          <span>{btnUrlText}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => showToast(`Quick reply sent: "${btnQuickText}"`, 'success')}
                          className="w-full py-2 px-3 bg-slate-50/70 hover:bg-slate-100 text-[#0066FF] text-xs flex items-center justify-center gap-1.5 transition-colors border-t border-slate-100 font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm text-[#0066FF]">reply</span>
                          <span>{btnQuickText}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white px-3 py-1.5 flex items-center gap-2 border-t border-slate-200">
                      <span className="material-symbols-outlined text-slate-400 text-lg">mood</span>
                      <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-[11px] text-slate-500 select-none">
                        Balas pesan atau klik tombol...
                      </div>
                      <span className="material-symbols-outlined text-slate-400 text-lg">attach_file</span>
                      <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center shadow-xs">
                        <span className="material-symbols-outlined text-sm">mic</span>
                      </div>
                    </div>

                    <div className="bg-white pb-1 flex justify-center">
                      <div className="w-24 h-1 bg-slate-400/60 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white shadow-xs flex flex-col gap-2 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#0F172A] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
                      Meta Policy Pre-Flight Check
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      100% PASS
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-xs font-bold">check</span>
                      <span>No promo bait in Utility</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-xs font-bold">check</span>
                      <span>All dynamic tags mapped</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-xs font-bold">check</span>
                      <span>Opt-out contact defined</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-xs font-bold">check</span>
                      <span>HSM schema compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================= */}
      {/* SCREEN 2: TEMPLATE DIRECTORY (LIST OF ALL META HSM TEMPLATES) */}
      {/* ============================================================= */}
      {subScreen === 'directory' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Meta WhatsApp HSM Template Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, review, and author official WhatsApp Business HSM templates registered with Meta Cloud.
              </p>
            </div>
            <button
              onClick={() => {
                setSubScreen('studio');
                showToast('Opened new HSM Template Creator in Studio', 'info');
              }}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm self-start md:self-auto"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Create New HSM Template</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search template code or title..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0066FF]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">
                  search
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {['ALL', 'UTILITY', 'AUTHENTICATION', 'MARKETING'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDirectoryCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      directoryCategory === cat
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Technical Code</th>
                    <th className="px-4 py-3">Template Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Meta Status</th>
                    <th className="px-4 py-3">Quality</th>
                    <th className="px-4 py-3">Current TPS</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[#0F172A]">
                  {filteredHsm.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#0066FF]">
                        {item.code}
                      </td>
                      <td className="px-4 py-3.5 font-medium">{item.title}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {item.cat}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {item.status === 'APPROVED' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> APPROVED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> IN REVIEW
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-emerald-600">{item.quality}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">{item.tps}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSubScreen('studio');
                            setDisplayTitle(item.title);
                            showToast(`Loaded ${item.code} into Studio Workbench`, 'info');
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-[#0066FF] hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          type="button"
                        >
                          Edit Studio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 3: META ACCOUNT (WABA) SPECS */}
      {/* ============================================================= */}
      {subScreen === 'account' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#001B3A] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-emerald-400">verified</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#002244]">Official Meta Business Account (WABA)</h2>
                <p className="text-xs text-slate-500">WABA Entity: PT Bank Permata Tbk • Singapore Node Cluster</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">WABA Business ID</span>
                <div className="text-base font-bold font-mono text-[#002244] mt-1">8849-0192-PERMATA</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">✓ Verified Green Tick Badge</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Phone Number Binding</span>
                <div className="text-base font-bold font-mono text-[#002244] mt-1">+62 21 1500 111</div>
                <span className="text-[11px] text-slate-500 mt-1 block">PermataTel Official Contact Point</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Messaging Tier</span>
                <div className="text-base font-bold text-emerald-600 mt-1">Tier 4 (Unlimited / 24h)</div>
                <span className="text-[11px] text-slate-500 mt-1 block">High Quality (Green Status)</span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-[#002244] block mb-1">Webhook Dispatch Endpoint:</span>
                <div className="p-2.5 rounded bg-slate-50 font-mono text-slate-700 border border-slate-200">
                  https://engine.permatabank.co.id/api/v1/meta/webhook
                </div>
              </div>
              <div>
                <span className="font-bold text-[#002244] block mb-1">Graph API Version &amp; Region:</span>
                <div className="p-2.5 rounded bg-slate-50 font-mono text-slate-700 border border-slate-200">
                  v20.0 • ap-southeast-1 (Singapore Meta PoP)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 4: TWO-WAY CONVERSATIONAL SESSIONS */}
      {/* ============================================================= */}
      {subScreen === 'conversations' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Two-Way Customer Conversational Sessions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active 24-hour service care windows initiated by inbound customer replies.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-mono text-xs font-bold">
              1,420 Active 24h Sessions
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-[#002244]">
                Recent Inbound Conversations
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-3.5 bg-blue-50/50 cursor-pointer">
                  <div className="flex items-center justify-between font-bold text-[#002244]">
                    <span>Bambang Susanto</span>
                    <span className="text-[10px] text-slate-400 font-mono">09:41</span>
                  </div>
                  <p className="text-slate-600 mt-1 truncate">Saya Mengenali Transaksi Ini</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Window: 23h 48m left</span>
                </div>
                <div className="p-3.5 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center justify-between font-bold text-[#002244]">
                    <span>Dewi Anggraini</span>
                    <span className="text-[10px] text-slate-400 font-mono">09:35</span>
                  </div>
                  <p className="text-slate-600 mt-1 truncate">Bagaimana cara cek saldo BI-FAST?</p>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Window: 23h 41m left</span>
                </div>
                <div className="p-3.5 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center justify-between font-bold text-[#002244]">
                    <span>Rudi Hartono</span>
                    <span className="text-[10px] text-slate-400 font-mono">09:20</span>
                  </div>
                  <p className="text-slate-600 mt-1 truncate">Terima kasih atas notifikasi e-statementnya</p>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Window: 23h 24m left</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-[#002244] text-sm">Session: +62 811-2098-XXXX (Bambang Susanto)</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">PermataCare Bot Handshake</span>
                </div>

                <div className="space-y-3 py-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-100 max-w-[85%] text-slate-800">
                    [Outbound HSM] Halo Nasabah PermataBank Yth. Bambang Susanto, Transaksi debit rekening •••4829 sebesar IDR 2.500.000 berhasil diproses.
                  </div>
                  <div className="p-3 rounded-lg bg-[#EBF3FF] text-[#0066FF] max-w-[80%] ml-auto font-medium">
                    [Inbound Quick Reply] Saya Mengenali Transaksi Ini
                  </div>
                  <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                    ✓ Transaksi terverifikasi aman oleh nasabah. Log keamanan dicatat ke Core Banking.
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type care response to customer..."
                  className="flex-1 p-2 bg-slate-50 rounded-lg text-xs border border-slate-200 outline-none"
                />
                <button
                  onClick={() => showToast('Care reply transmitted over Meta Cloud session', 'success')}
                  className="px-4 py-2 bg-[#0066FF] text-white rounded-lg text-xs font-bold cursor-pointer"
                  type="button"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
