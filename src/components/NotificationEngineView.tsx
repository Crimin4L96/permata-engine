import React, { useState, useRef } from 'react';
import { Role } from '../types';

export type NotificationSubScreen = 'config' | 'directory' | 'broadcast' | 'inbox' | 'gateway';

interface NotificationEngineViewProps {
  currentRole: Role;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenAuditModal: () => void;
  activeSubScreen?: NotificationSubScreen;
  setActiveSubScreen?: (screen: NotificationSubScreen) => void;
}

export const NotificationEngineView: React.FC<NotificationEngineViewProps> = ({
  currentRole,
  showToast,
  onOpenAuditModal,
  activeSubScreen: controlledSubScreen,
  setActiveSubScreen: setControlledSubScreen,
}) => {
  const [internalSubScreen, setInternalSubScreen] = useState<NotificationSubScreen>('config');
  const subScreen = controlledSubScreen || internalSubScreen;
  const setSubScreen = setControlledSubScreen || setInternalSubScreen;

  // Form fields
  const [templateName, setTemplateName] = useState('International Transfer LLD v2');
  const [templateDesc, setTemplateDesc] = useState('International Transfer LLD v2 push notification for PMOBX');
  const [category, setCategory] = useState('00001 - Transaction');
  const [messageType, setMessageType] = useState('00001 - Saving Account');
  const [messageSubType, setMessageSubType] = useState('00283 - International Transfer');
  const [isActive, setIsActive] = useState(true);
  const [titleMessage, setTitleMessage] = useState('Transfer Internasional');
  const [bodyMessage, setBodyMessage] = useState(
    'Transaksi pengiriman dana LLD sebesar {currency} {amount} ke {beneficiary_name} berhasil diproses. No. Referensi: {ref_number}.'
  );

  // Test Payload Injector fields
  const [testAmount, setTestAmount] = useState('4,500.00');
  const [testCurrency, setTestCurrency] = useState('USD');
  const [testBeneficiary, setTestBeneficiary] = useState('BARKLEYS BANK UK');

  // Simulator settings
  const [devicePlatform, setDevicePlatform] = useState<'ios' | 'android'>('ios');
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [isTestDispatching, setIsTestDispatching] = useState(false);
  const [isCardPulsing, setIsCardPulsing] = useState(false);

  // Unsaved changes tracker
  const [unsavedCount, setUnsavedCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Governance checker status
  const [checkerStatus, setCheckerStatus] = useState<'Approved' | 'Review' | 'Rejected'>('Approved');

  // Directory filter & search
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCat, setDirectoryCat] = useState('ALL');

  // Broadcast wizard state
  const [broadcastTitle, setBroadcastTitle] = useState('Promo Spesial Gajian Permata ME');
  const [broadcastTarget, setBroadcastTarget] = useState('All PermataMobile X Users (1.8M)');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const registerChange = () => {
    if (currentRole === 'Checker') return;
    setUnsavedCount((prev) => prev + 1);
  };

  const insertToken = (token: string) => {
    if (currentRole === 'Checker') {
      showToast('Tokens cannot be altered while in Checker review mode', 'warning');
      return;
    }
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const current = bodyMessage;
    const updated = current.substring(0, start) + token + current.substring(end);
    setBodyMessage(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + token.length;
      }
    }, 10);
    registerChange();
    showToast(`Injected token ${token} into push payload`, 'info');
  };

  const getRenderedBody = () => {
    let result = bodyMessage;
    result = result.replace(/{amount}/g, testAmount);
    result = result.replace(/{currency}/g, testCurrency);
    result = result.replace(/{beneficiary_name}/g, testBeneficiary);
    result = result.replace(/{ref_number}/g, 'TRX-99214819');
    result = result.replace(/{channel_time}/g, '14:32 WIB');
    return result;
  };

  const randomizeTestData = () => {
    const amounts = ['1,250.00', '8,420.50', '25,000.00', '350.00', '98,200.00'];
    const currencies = ['USD', 'EUR', 'SGD', 'JPY', 'GBP'];
    const names = [
      'STANDARD CHARTERED SG',
      'HSBC HONG KONG',
      'MITSUBISHI UFJ TOKYO',
      'BNP PARIBAS FR',
      'CITIBANK NEW YORK',
    ];
    setTestAmount(amounts[Math.floor(Math.random() * amounts.length)]);
    setTestCurrency(currencies[Math.floor(Math.random() * currencies.length)]);
    setTestBeneficiary(names[Math.floor(Math.random() * names.length)]);
    showToast('Simulation test parameters randomized', 'info');
  };

  const dispatchTestPush = () => {
    setIsTestDispatching(true);
    setTimeout(() => {
      setIsTestDispatching(false);
      setIsCardPulsing(true);
      setTimeout(() => setIsCardPulsing(false), 1200);
      showToast(`Push delivered to PermataMobile X Sandbox device (${devicePlatform.toUpperCase()})`, 'success');
    }, 700);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setUnsavedCount(0);
      showToast('Template FRBS9482387 saved successfully and synced to Kafka cluster', 'success');
    }, 800);
  };

  const handleDiscard = () => {
    setTemplateName('International Transfer LLD v2');
    setTemplateDesc('International Transfer LLD v2 push notification for PMOBX');
    setTitleMessage('Transfer Internasional');
    setBodyMessage(
      'Transaksi pengiriman dana LLD sebesar {currency} {amount} ke {beneficiary_name} berhasil diproses. No. Referensi: {ref_number}.'
    );
    setUnsavedCount(0);
    showToast('Edits reverted to saved configuration', 'info');
  };

  const handleCheckerApprove = () => {
    setCheckerStatus('Approved');
    showToast('Payload FRBS9482387 Approved and synchronized to Production Kafka', 'success');
  };

  const handleCheckerReject = () => {
    setCheckerStatus('Rejected');
    showToast('Payload FRBS9482387 rejected and returned to Maker queue with audit notes', 'error');
  };

  const isLocked = currentRole === 'Checker';

  const notificationTemplates = [
    { code: 'FRBS9482387', name: 'International Transfer LLD v2', channel: 'PERMATAMOBILE X', cat: '00001 - Transaction', status: 'ACTIVE', subType: 'International Transfer' },
    { code: 'FRBS9482101', name: 'Domestic BI-FAST Debit Alert', channel: 'PERMATAMOBILE X', cat: '00001 - Transaction', status: 'ACTIVE', subType: 'Domestic BI-FAST' },
    { code: 'FRBS8839201', name: 'Mobile Banking Login OTP Auth', channel: 'PERMATAMOBILE X', cat: '00002 - Security & OTP', status: 'ACTIVE', subType: 'Security & Auth' },
    { code: 'FRBS7721092', name: 'Permata Tabungan Bebas Cashback', channel: 'PERMATAMOBILE X', cat: '00003 - Promotion & Marketing', status: 'ACTIVE', subType: 'Promo Reward' },
    { code: 'FRBS6610293', name: 'Suspicious Card Activity Flag', channel: 'PERMATAMOBILE X', cat: '00002 - Security & OTP', status: 'ACTIVE', subType: 'Fraud Detection' },
    { code: 'FRBS1092004', name: 'QRIS Merchant Instant Settlement', channel: 'PERMATAMOBILE X', cat: '00001 - Transaction', status: 'ACTIVE', subType: 'QRIS Merchant' },
  ];

  const filteredNotifs = notificationTemplates.filter((item) => {
    if (directoryCat !== 'ALL' && item.cat !== directoryCat) return false;
    if (directorySearch.trim()) {
      const q = directorySearch.toLowerCase();
      return item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full">
      {/* Sub-navigation tabs within Notification Engine */}
      <div className="bg-[#002244] text-white px-4 md:px-8 py-2.5 flex items-center justify-between overflow-x-auto border-b border-[#003366] shadow-sm">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold mr-2 hidden sm:inline">
            Notification Views:
          </span>
          <button
            type="button"
            onClick={() => setSubScreen('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'config'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">format_paint</span>
            <span>Template Configuration (FRBS9482387)</span>
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
            onClick={() => setSubScreen('broadcast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'broadcast'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">send_and_archive</span>
            <span>Push Broadcast Dispatch</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('gateway')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'gateway'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">cell_tower</span>
            <span>FCM &amp; APNs Config</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>PermataMobile X Subsystem • Online</span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* SCREEN 1: TEMPLATE CONFIGURATION (MATCHES IMAGE 2) */}
      {/* ============================================================= */}
      {subScreen === 'config' && (
        <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 max-w-[1600px] mx-auto w-full">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Permata Engine</span>
                <span className="material-symbols-outlined text-[12px] opacity-60">chevron_right</span>
                <span>Notification Engine</span>
                <span className="material-symbols-outlined text-[12px] opacity-60">chevron_right</span>
                <button
                  type="button"
                  onClick={() => setSubScreen('directory')}
                  className="hover:text-[#0066FF] cursor-pointer"
                >
                  Template Directory
                </button>
                <span className="material-symbols-outlined text-[12px] opacity-60">chevron_right</span>
                <span className="text-[#0066FF] font-semibold">Edit Template</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#002244] tracking-tight">
                  Template Configuration
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse"></span>
                  PRODUCTION ACTIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Bank Push Channel Template Configuration &amp; Layout Payload Editor (Maker-Checker Compliant)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenAuditModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#002244] text-xs font-semibold transition-all border border-[#DDE5F0] shadow-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-[#0066FF]">history</span>
                <span>Audit Log</span>
                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#0066FF] font-mono text-[11px] font-bold">
                  v3.4
                </span>
              </button>

              <button
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#002244] text-xs font-semibold transition-all border border-[#DDE5F0] shadow-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px] text-[#0066FF]">smartphone</span>
                <span>{isPreviewVisible ? 'Hide Preview' : 'Show Preview'}</span>
              </button>

              <button
                onClick={() => setSubScreen('directory')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0066FF] text-white hover:bg-[#0052CC] transition-all text-xs font-semibold shadow-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">arrow_back</span>
                <span>Back to Templates</span>
              </button>
            </div>
          </div>

          {/* Navigation Back Link */}
          <div
            onClick={() => setSubScreen('directory')}
            className="flex items-center gap-1.5 cursor-pointer text-[#0066FF] hover:text-[#0052CC] transition-colors w-fit group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              chevron_left
            </span>
            <span className="text-xs sm:text-sm font-bold">Back to Template List</span>
          </div>

          {/* Dual Role Info Banner when Checker is active */}
          {currentRole === 'Checker' && (
            <div className="p-3.5 px-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-[#002244] animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#0066FF] text-[20px]">policy</span>
                <span className="text-xs sm:text-sm font-semibold text-[#002244]">
                  Checker Mode Active: You are reviewing pending updates submitted by Maker Ahmad Arif (OPS-441). Fields are locked for audit inspection.
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF] text-white text-xs font-bold whitespace-nowrap">
                Dual-Control Audit #CH-9921
              </span>
            </div>
          )}

          {/* Main Grid Workspace */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <div
              className={`${
                isPreviewVisible ? 'xl:col-span-8' : 'xl:col-span-12'
              } bg-white rounded-xl shadow-[0_4px_20px_rgba(0,34,68,0.05)] overflow-hidden transition-all duration-300 border border-[#DDE5F0]`}
            >
              <div className="h-12 bg-[#002244] px-5 sm:px-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#0066FF] bg-white/10 p-1 rounded">
                    tune
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-wide">
                    Template Information &amp; Payload Schema
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-blue-100">
                  <span className="hidden sm:inline opacity-80">ID:</span>
                  <span className="bg-[#001B3A] px-2 py-0.5 rounded font-semibold text-white border border-white/10">
                    #FRBS-9482387
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-7 md:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Template Code
                  </label>
                  <div className="sm:col-span-8 flex items-center justify-between p-2.5 px-3.5 rounded-lg bg-[#F4F8FC] border border-[#DDE5F0]">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#002244] tracking-wider">
                      FRBS9482387
                    </span>
                    <button
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-[#0066FF] text-xs font-semibold transition-colors border border-[#DDE5F0] shadow-2xs cursor-pointer"
                      onClick={() => {
                        navigator.clipboard?.writeText('FRBS9482387');
                        showToast('Template code FRBS9482387 copied to clipboard', 'success');
                      }}
                      title="Copy Code"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                      <span>Copy</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Template Name
                  </label>
                  <div className="sm:col-span-8">
                    <div className="relative">
                      <input
                        disabled={isLocked}
                        className="w-full pb-2 pr-16 bg-transparent text-[#002244] text-xs sm:text-sm font-medium border-b border-[#DDE5F0] focus:border-b-2 focus:border-[#0066FF] outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        maxLength={50}
                        type="text"
                        value={templateName}
                        onChange={(e) => {
                          setTemplateName(e.target.value);
                          registerChange();
                        }}
                      />
                      <span className="absolute right-0 bottom-2 font-mono text-[11px] text-slate-400">
                        {templateName.length}/50
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Description
                  </label>
                  <div className="sm:col-span-8">
                    <div className="relative">
                      <input
                        disabled={isLocked}
                        className="w-full pb-2 pr-16 bg-transparent text-[#002244] text-xs sm:text-sm font-medium border-b border-[#DDE5F0] focus:border-b-2 focus:border-[#0066FF] outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        maxLength={100}
                        type="text"
                        value={templateDesc}
                        onChange={(e) => {
                          setTemplateDesc(e.target.value);
                          registerChange();
                        }}
                      />
                      <span className="absolute right-0 bottom-2 font-mono text-[11px] text-slate-400">
                        {templateDesc.length}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Channel
                  </label>
                  <div className="sm:col-span-8 flex flex-wrap items-center gap-3">
                    <span className="text-sm sm:text-base text-[#002244] font-bold">
                      PERMATAMOBILE X
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] text-xs font-semibold flex items-center gap-1.5 border border-blue-200">
                      <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                      Native Push &amp; In-App
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Sub Channel
                  </label>
                  <div className="sm:col-span-8">
                    <span className="text-sm sm:text-base text-[#002244] font-bold">PMOBX SYSTEM X</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Category
                  </label>
                  <div className="sm:col-span-8 relative">
                    <select
                      disabled={isLocked}
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        registerChange();
                      }}
                      className="w-full pb-2 bg-transparent text-[#002244] text-xs sm:text-sm font-medium border-b border-[#DDE5F0] focus:border-b-2 focus:border-[#0066FF] outline-none appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="00001 - Transaction">00001 - Transaction</option>
                      <option value="00002 - Security & OTP">00002 - Security & OTP</option>
                      <option value="00003 - Promotion & Marketing">00003 - Promotion & Marketing</option>
                      <option value="00004 - Regulatory Disclosures">00004 - Regulatory Disclosures</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-0 bottom-2 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Message Type
                  </label>
                  <div className="sm:col-span-8 relative">
                    <select
                      disabled={isLocked}
                      value={messageType}
                      onChange={(e) => {
                        setMessageType(e.target.value);
                        registerChange();
                      }}
                      className="w-full pb-2 bg-transparent text-[#002244] text-xs sm:text-sm font-medium border-b border-[#DDE5F0] focus:border-b-2 focus:border-[#0066FF] outline-none appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="00001 - Saving Account">00001 - Saving Account</option>
                      <option value="00002 - Current Account">00002 - Current Account</option>
                      <option value="00003 - Credit Card / Financing">00003 - Credit Card / Financing</option>
                      <option value="00004 - Wealth & Investment">00004 - Wealth & Investment</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-0 bottom-2 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Message Sub Type
                  </label>
                  <div className="sm:col-span-8 relative">
                    <select
                      disabled={isLocked}
                      value={messageSubType}
                      onChange={(e) => {
                        setMessageSubType(e.target.value);
                        registerChange();
                      }}
                      className="w-full pb-2 bg-transparent text-[#002244] text-xs sm:text-sm font-medium border-b border-[#DDE5F0] focus:border-b-2 focus:border-[#0066FF] outline-none appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="00283 - International Transfer">00283 - International Transfer</option>
                      <option value="00284 - Domestic BI-FAST">00284 - Domestic BI-FAST</option>
                      <option value="00285 - Real Time Gross Settlement (RTGS)">00285 - Real Time Gross Settlement (RTGS)</option>
                      <option value="00286 - QRIS Merchant Debit">00286 - QRIS Merchant Debit</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-0 bottom-2 text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Status
                  </label>
                  <div className="sm:col-span-8 flex items-center justify-between pb-2 border-b border-[#DDE5F0]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-500 shadow-[0_0_6px_#10B981]'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      <span className="text-xs sm:text-sm font-bold text-[#002244]">
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <button
                      disabled={isLocked}
                      className="px-3 py-1 rounded-lg bg-[#F4F8FC] hover:bg-[#EBF3FA] text-[#0066FF] text-xs font-semibold transition-colors flex items-center gap-1.5 border border-[#DDE5F0] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => {
                        setIsActive(!isActive);
                        registerChange();
                        showToast(isActive ? 'Status switched to Inactive' : 'Status switched to Active', 'info');
                      }}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">sync_alt</span>
                      <span>{isActive ? 'Switch to Inactive' : 'Switch to Active'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-center">
                  <label className="sm:col-span-4 text-xs sm:text-sm font-semibold text-slate-500">
                    Title Message
                  </label>
                  <div className="sm:col-span-8">
                    <div className="relative">
                      <input
                        disabled={isLocked}
                        className="w-full pb-2 pr-16 bg-transparent text-[#002244] text-xs sm:text-sm font-bold border-b border-[#DDE5F0] focus:border-b-2 focus:border-[#0066FF] outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        maxLength={300}
                        type="text"
                        value={titleMessage}
                        onChange={(e) => {
                          setTitleMessage(e.target.value);
                          registerChange();
                        }}
                      />
                      <span className="absolute right-0 bottom-2 font-mono text-[11px] text-slate-400">
                        {titleMessage.length}/300
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-start">
                  <div className="sm:col-span-4 flex flex-col gap-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-[#002244]">
                      Payload Body Template
                    </label>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Click pill tokens to inject dynamic customer payload parameters.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertToken('{amount}')}
                        disabled={isLocked}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs transition-all border border-[#DDE5F0] hover:border-[#0066FF] shadow-2xs flex items-center gap-1 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>+</span> {'{amount}'}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertToken('{beneficiary_name}')}
                        disabled={isLocked}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs transition-all border border-[#DDE5F0] hover:border-[#0066FF] shadow-2xs flex items-center gap-1 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>+</span> {'{beneficiary_name}'}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertToken('{currency}')}
                        disabled={isLocked}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs transition-all border border-[#DDE5F0] hover:border-[#0066FF] shadow-2xs flex items-center gap-1 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>+</span> {'{currency}'}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertToken('{ref_number}')}
                        disabled={isLocked}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs transition-all border border-[#DDE5F0] hover:border-[#0066FF] shadow-2xs flex items-center gap-1 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>+</span> {'{ref_number}'}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertToken('{channel_time}')}
                        disabled={isLocked}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] font-mono text-xs transition-all border border-[#DDE5F0] hover:border-[#0066FF] shadow-2xs flex items-center gap-1 cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>+</span> {'{channel_time}'}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-8 space-y-2">
                    <div className="relative bg-[#F4F8FC] rounded-xl p-3 sm:p-4 border border-[#DDE5F0] focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/10 transition-all">
                      <textarea
                        ref={textareaRef}
                        disabled={isLocked}
                        className="w-full bg-transparent text-[#002244] text-xs sm:text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        maxLength={500}
                        placeholder="Type notification message here..."
                        rows={4}
                        value={bodyMessage}
                        onChange={(e) => {
                          setBodyMessage(e.target.value);
                          registerChange();
                        }}
                      />
                      <div className="flex items-center justify-between pt-2.5 border-t border-[#DDE5F0] mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-[#0066FF]">check_circle</span>
                          Permata Mobile Engine Markdown: Supported
                        </span>
                        <span className="font-mono text-xs text-slate-500">
                          {bodyMessage.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Device Push Simulator */}
            {isPreviewVisible && (
              <div className="xl:col-span-4 flex flex-col gap-6 animate-in fade-in">
                <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,34,68,0.05)] overflow-hidden border border-[#DDE5F0]">
                  <div className="h-12 bg-[#002244] px-4 flex items-center justify-between text-white border-b border-[#001B3A]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#0066FF] bg-white/10 p-1 rounded">
                        dock_to_left
                      </span>
                      <span className="text-xs sm:text-sm font-bold">Device Push Simulator</span>
                    </div>

                    <div className="flex items-center bg-[#001B3A] p-0.5 rounded-lg border border-white/10 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setDevicePlatform('ios');
                          showToast('Simulator switched to iOS 17 APNs layout', 'info');
                        }}
                        className={`px-2.5 py-0.5 rounded-md transition-all font-bold cursor-pointer ${
                          devicePlatform === 'ios'
                            ? 'bg-[#0066FF] text-white shadow-xs'
                            : 'text-blue-200 hover:text-white'
                        }`}
                      >
                        iOS 17
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDevicePlatform('android');
                          showToast('Simulator switched to Android 14 FCM layout', 'info');
                        }}
                        className={`px-2.5 py-0.5 rounded-md transition-all font-bold cursor-pointer ${
                          devicePlatform === 'android'
                            ? 'bg-[#0066FF] text-white shadow-xs'
                            : 'text-blue-200 hover:text-white'
                        }`}
                      >
                        Android 14
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col items-center bg-[#F4F8FC]">
                    <div className="w-full max-w-[320px] rounded-[38px] p-3.5 bg-[#001B3A] shadow-2xl relative transition-all duration-300 border-4 border-slate-700/50">
                      <div className="h-4.5 w-28 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
                        {devicePlatform === 'ios' ? (
                          <>
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-white/10"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
                          </>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-black ring-1 ring-white/20"></div>
                        )}
                      </div>

                      <div className="w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#002244] via-[#003366] to-[#001B3A] p-4 min-h-[380px] flex flex-col justify-between relative shadow-inner">
                        <div className="text-center pt-2">
                          <div className="text-xs text-blue-200 font-medium tracking-wide">
                            Wednesday, Oct 23
                          </div>
                          <div className="text-[44px] leading-tight font-extrabold text-white tracking-tight font-mono">
                            14:32
                          </div>
                        </div>

                        <div
                          className={`transition-all transform ${
                            isCardPulsing ? 'ring-4 ring-[#0066FF] scale-105' : ''
                          } ${
                            devicePlatform === 'ios'
                              ? 'rounded-2xl p-3.5 bg-white/95 backdrop-blur-md shadow-xl my-auto border border-white/60'
                              : 'rounded-xl p-3 bg-white/95 shadow-md my-auto border-l-4 border-l-[#0066FF]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-[#0066FF] flex items-center justify-center text-white font-extrabold text-[10px] shadow-xs">
                                P
                              </div>
                              <span className="text-xs font-bold text-[#002244] tracking-wide">
                                PERMATAMOBILE X
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-500">just now</span>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs sm:text-sm text-[#002244] font-bold leading-snug">
                              {titleMessage || 'Notification Title'}
                            </div>
                            <div className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                              {getRenderedBody() || 'Notification body content...'}
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-500">
                            <span className="text-[11px] flex items-center gap-1 text-[#0066FF] font-semibold">
                              <span className="material-symbols-outlined text-[14px]">touch_app</span> Tap to review details
                            </span>
                            <span className="material-symbols-outlined text-[16px] text-slate-400">
                              chevron_right
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3 pt-3 opacity-75 text-white">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[16px]">flashlight_on</span>
                          </div>
                          <div className="w-16 h-1 bg-white/60 rounded-full"></div>
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-5 p-4 rounded-xl bg-white space-y-3 border border-[#DDE5F0] shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#002244] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#0066FF]">tune</span>
                          Test Payload Injector
                        </span>
                        <button
                          className="text-xs text-[#0066FF] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          onClick={randomizeTestData}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[14px]">shuffle</span> Randomize
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-500 block font-semibold">Amount</label>
                          <input
                            className="w-full p-2 rounded-lg bg-[#F4F8FC] font-mono text-xs text-[#002244] outline-none border border-[#DDE5F0] focus:border-[#0066FF]"
                            type="text"
                            value={testAmount}
                            onChange={(e) => setTestAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 block font-semibold">Currency</label>
                          <input
                            className="w-full p-2 rounded-lg bg-[#F4F8FC] font-mono text-xs text-[#002244] outline-none border border-[#DDE5F0] focus:border-[#0066FF]"
                            type="text"
                            value={testCurrency}
                            onChange={(e) => setTestCurrency(e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[11px] text-slate-500 block font-semibold">Beneficiary Name</label>
                          <input
                            className="w-full p-2 rounded-lg bg-[#F4F8FC] text-xs font-medium text-[#002244] outline-none border border-[#DDE5F0] focus:border-[#0066FF]"
                            type="text"
                            value={testBeneficiary}
                            onChange={(e) => setTestBeneficiary(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        className="w-full py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                        onClick={dispatchTestPush}
                        disabled={isTestDispatching}
                        type="button"
                      >
                        <span className={`material-symbols-outlined text-[18px] ${isTestDispatching ? 'animate-spin' : ''}`}>
                          {isTestDispatching ? 'refresh' : 'send'}
                        </span>
                        <span>{isTestDispatching ? 'Emulating APNs/FCM delivery...' : 'Dispatch Staging Test Push'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,34,68,0.05)] space-y-3 border border-[#DDE5F0]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#002244] text-xs sm:text-sm font-bold">
                      <span className="material-symbols-outlined text-[18px] text-[#0066FF]">verified_user</span>
                      <span>Permata Dual-Control Governance</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0066FF] text-[10px] font-bold border border-blue-200">
                      SOX &amp; OJK COMPLIANT
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex justify-between py-1.5 border-b border-[#DDE5F0]">
                      <span>Maker / Submitter</span>
                      <span className="font-semibold text-[#002244]">Ahmad Arif (OPS-441)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#DDE5F0]">
                      <span>Checker Status</span>
                      {checkerStatus === 'Approved' && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">check_circle</span> Approved (PROD)
                        </span>
                      )}
                      {checkerStatus === 'Review' && (
                        <span className="text-[#0066FF] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">pending_actions</span> In Review
                        </span>
                      )}
                      {checkerStatus === 'Rejected' && (
                        <span className="text-red-600 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px]">cancel</span> Rejected
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#DDE5F0]">
                      <span>Core Gateway Routing</span>
                      <span className="font-mono text-[#002244] font-semibold text-[11px]">
                        FCM-Prod-Kafka02
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span>Audit Stamp</span>
                      <span className="font-mono text-[#002244] text-[11px]">2024-10-23 11:24:02 UTC</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-4 z-30 p-3.5 sm:px-6 rounded-xl bg-white/95 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#DDE5F0] mt-6">
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-ping"></span>
              <span className="text-xs sm:text-sm text-slate-500">
                Unsaved edits:{' '}
                <span className="font-bold text-[#0066FF]">
                  {unsavedCount} field{unsavedCount !== 1 ? 's' : ''} modified
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {currentRole === 'Checker' ? (
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCheckerReject}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 border border-red-200 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    <span>Reject Payload</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckerApprove}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    <span>Approve &amp; Deploy to PROD</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#F4F8FC] hover:bg-[#EBF3FA] text-[#002244] text-xs sm:text-sm font-semibold transition-colors border border-[#DDE5F0] cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isSaving ? 'animate-spin' : ''}`}>
                      {isSaving ? 'refresh' : 'save'}
                    </span>
                    <span>{isSaving ? 'Saving...' : 'Save Template'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 2: TEMPLATE DIRECTORY (PUSH TEMPLATES DIRECTORY) */}
      {/* ============================================================= */}
      {subScreen === 'directory' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Bank Push Notification Template Directory</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized registry of transactional &amp; broadcast push notification templates for PermataMobile X.
              </p>
            </div>
            <button
              onClick={() => {
                setSubScreen('config');
                showToast('Opened Template Creator schema', 'info');
              }}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm self-start md:self-auto"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>New Push Template</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search code or template title..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0066FF]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">
                  search
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto max-w-full">
                {['ALL', '00001 - Transaction', '00002 - Security & OTP', '00003 - Promotion & Marketing'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDirectoryCat(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                      directoryCat === cat
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    type="button"
                  >
                    {cat.replace(/0000[0-9] - /, '')}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Template Code</th>
                    <th className="px-4 py-3">Template Title</th>
                    <th className="px-4 py-3">Channel</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Sub-Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[#0F172A]">
                  {filteredNotifs.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-[#0066FF]">
                        {item.code}
                      </td>
                      <td className="px-4 py-3.5 font-medium">{item.name}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-600">{item.channel}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {item.cat}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{item.subType}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ACTIVE
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSubScreen('config');
                            setTemplateName(item.name);
                            showToast(`Loaded ${item.code} for configuration`, 'info');
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-[#0066FF] hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          type="button"
                        >
                          Configure
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
      {/* SCREEN 3: PUSH BROADCAST DISPATCH STUDIO */}
      {/* ============================================================= */}
      {subScreen === 'broadcast' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Push Broadcast Dispatch Studio</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatch mass push broadcast notifications via Google FCM v1 and Apple APNs HTTP/2.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-mono text-xs font-bold border border-blue-200">
              Kafka Queue: 0 Pending
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#002244]">Broadcast Campaign Details</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 font-bold block mb-1">Target Customer Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  >
                    <option value="All PermataMobile X Users (1.8M)">All PermataMobile X Users (1.8M devices)</option>
                    <option value="Segment: Syariah Customers (420k)">Segment: Syariah Customers (420k devices)</option>
                    <option value="Segment: Priority Banking (85k)">Segment: Priority Banking (85k devices)</option>
                    <option value="Segment: Credit Card Active (610k)">Segment: Credit Card Active (610k devices)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 font-bold block mb-1">Push Broadcast Title</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-slate-500 font-bold block mb-1">Push Message Body</label>
                  <textarea
                    rows={3}
                    defaultValue="Dapatkan cashback hingga 10% setiap transaksi QRIS dengan PermataTabungan Bebas. Promo berlaku hingga akhir bulan!"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Estimated Delivery Latency:</span>
                  <span className="font-mono text-emerald-600 font-bold">&lt; 45 seconds for 1.8M tokens</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsBroadcasting(true);
                    setTimeout(() => {
                      setIsBroadcasting(false);
                      showToast(`Push broadcast "${broadcastTitle}" dispatched to ${broadcastTarget}`, 'success');
                    }, 900);
                  }}
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span className={`material-symbols-outlined text-base ${isBroadcasting ? 'animate-spin' : ''}`}>
                    {isBroadcasting ? 'refresh' : 'send_and_archive'}
                  </span>
                  <span>{isBroadcasting ? 'Dispatching to FCM/APNs...' : 'Dispatch Broadcast Now'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-sm text-[#002244]">Live Gateway Pipeline</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold">Apple APNs Pipeline</span>
                  <span className="text-emerald-600 font-semibold">ONLINE • HTTP/2 Multiplexing</span>
                  <span className="font-mono text-slate-400 text-[11px]">Throughput: 6,000 pings/s</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1">
                  <span className="text-slate-500 font-bold">Google Firebase Cloud (FCM v1)</span>
                  <span className="text-emerald-600 font-semibold">ONLINE • High Priority Payload</span>
                  <span className="font-mono text-slate-400 text-[11px]">Throughput: 12,000 pings/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 4: FCM & APNS GATEWAY CONFIG */}
      {/* ============================================================= */}
      {subScreen === 'gateway' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Push Gateway Credentials &amp; Node Health</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configured secure tunnel endpoints for iOS (Apple APNs) and Android (Google FCM v1).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#002244]">Apple Push Notification Service (APNs)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">HEALTHY</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono text-slate-600">
                  <div>Auth Mode: <strong>Token-based p8 (.p8 Auth Key)</strong></div>
                  <div>Team ID: <strong>9P8K294821 (PT Bank Permata Tbk)</strong></div>
                  <div>Bundle ID: <strong>com.permatabank.permatamobilex</strong></div>
                  <div>Latency: <strong>9.4 ms avg (HTTP/2 persistent socket)</strong></div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Ping APNs Gateway: 200 OK (8.2ms)', 'success')}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-[#0066FF] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Test APNs Handshake
                </button>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#002244]">Google Firebase Cloud Messaging (FCM v1)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">HEALTHY</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono text-slate-600">
                  <div>API Protocol: <strong>Firebase Cloud Messaging v1 REST API</strong></div>
                  <div>Project ID: <strong>permatamobilex-prod-fcm</strong></div>
                  <div>Service Account: <strong>fcm-dispatcher@permatamobilex-prod.iam</strong></div>
                  <div>Latency: <strong>14.1 ms avg</strong></div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Ping FCM Gateway: 200 OK (11.8ms)', 'success')}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-[#0066FF] rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Test FCM Handshake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
