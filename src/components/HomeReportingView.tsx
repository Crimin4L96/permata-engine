import React, { useState } from 'react';
import { StreamEvent, Role, ActiveEngine } from '../types';

export type HomeSubScreen = 'executive' | 'telemetry' | 'logs' | 'sla' | 'user-mgmt';

interface HomeReportingViewProps {
  currentRole: Role;
  setActiveEngine: (engine: ActiveEngine) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenExportModal: () => void;
  onOpenMakerCheckerReview: (taskTitle: string) => void;
  activeSubScreen?: HomeSubScreen;
  setActiveSubScreen?: (screen: HomeSubScreen) => void;
}

const initialStreamEvents: StreamEvent[] = [
  {
    id: '1',
    ref: '#MSG-99482344',
    timestamp: '14:48:12.102',
    engine: 'NOTIFICATION',
    templateCode: 'FRBS9482387',
    templateTitle: 'International Transfer LLD v2',
    recipient: 'CUST-883921980',
    recipientSub: 'PermataMobile ID',
    channelNode: 'PMOBX SYSTEM X',
    channelNodeSub: 'APNs / iOS 17.4',
    latency: '12.4 ms',
    status: 'DELIVERED',
  },
  {
    id: '2',
    ref: '#MSG-99482343',
    timestamp: '14:48:11.890',
    engine: 'SMS',
    templateCode: 'OTP-AUTH-3990',
    templateTitle: 'Biometric Enrollment Token',
    recipient: '+62 812-9843-XXXX',
    recipientSub: 'MSISDN Telkomsel',
    channelNode: 'Telkomsel SMPP',
    channelNodeSub: 'Node JKT-PRI',
    latency: '18.1 ms',
    status: 'DELIVERED',
  },
  {
    id: '3',
    ref: '#MSG-99482342',
    timestamp: '14:48:10.450',
    engine: 'WHATSAPP',
    templateCode: 'HSM-STMT-MTHLY',
    templateTitle: 'E-Statement Encrypted PDF Alert',
    recipient: '+62 811-2098-XXXX',
    recipientSub: 'WA Account Verified',
    channelNode: 'Meta Cloud API',
    channelNodeSub: 'WABA Singapore',
    latency: '31.4 ms',
    status: 'READ (2-TICK)',
  },
  {
    id: '4',
    ref: '#MSG-99482341',
    timestamp: '14:48:09.112',
    engine: 'WHATSAPP',
    templateCode: 'HSM-CARD-ALERT',
    templateTitle: 'Credit Card Fraud Detection Flag',
    recipient: '+62 813-7721-XXXX',
    recipientSub: 'Unregistered WA → SMS Fallback',
    channelNode: 'Fallback → Tsel SMPP',
    channelNodeSub: 'Auto Recaptured',
    latency: '22.7 ms',
    status: 'RE-ROUTED SMS',
  },
  {
    id: '5',
    ref: '#MSG-99482340',
    timestamp: '14:48:07.720',
    engine: 'NOTIFICATION',
    templateCode: 'FRBS1092004',
    templateTitle: 'QRIS Merchant Instant Settlement',
    recipient: 'MERCH-1029410',
    recipientSub: 'Permata QR Merchant App',
    channelNode: 'PMOBX SYSTEM X',
    channelNodeSub: 'FCM High Priority',
    latency: '9.8 ms',
    status: 'DELIVERED',
  },
];

export const HomeReportingView: React.FC<HomeReportingViewProps> = ({
  currentRole,
  setActiveEngine,
  showToast,
  onOpenExportModal,
  onOpenMakerCheckerReview,
  activeSubScreen: controlledSubScreen,
  setActiveSubScreen: setControlledSubScreen,
}) => {
  const [internalSubScreen, setInternalSubScreen] = useState<HomeSubScreen>('executive');
  const subScreen = controlledSubScreen || internalSubScreen;
  const setSubScreen = setControlledSubScreen || setInternalSubScreen;

  const [engineFilter, setEngineFilter] = useState<'all' | 'notif' | 'sms' | 'wa'>('all');
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'NOTIFICATION' | 'SMS' | 'WHATSAPP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [dailyDispatches, setDailyDispatches] = useState('4,218,920');

  const handleSyncTelemetry = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newDispatches = (4218920 + Math.floor(Math.random() * 250)).toLocaleString('en-US');
      setDailyDispatches(newDispatches);
      showToast('Telemetry metrics updated with latest Permata micro frontend sync', 'success');
    }, 800);
  };

  const filteredEvents = initialStreamEvents.filter((evt) => {
    if (streamFilter !== 'ALL' && evt.engine !== streamFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        evt.ref.toLowerCase().includes(q) ||
        evt.templateCode.toLowerCase().includes(q) ||
        evt.templateTitle.toLowerCase().includes(q) ||
        evt.recipient.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const usersList = [
    { name: 'Ahmad Arif', email: 'ahmad.arif@permatabank.co.id', role: 'Super Admin', dept: 'SecOps & Architecture', status: 'ACTIVE', sso: 'S-82910-JKT' },
    { name: 'Siti Nurhaliza', email: 'siti.nurhaliza@permatabank.co.id', role: 'Maker', dept: 'Retail Product Ops', status: 'ACTIVE', sso: 'S-77291-JKT' },
    { name: 'Budi Santoso', email: 'budi.santoso@permatabank.co.id', role: 'Checker', dept: 'Risk & Compliance Lead', status: 'ACTIVE', sso: 'S-44102-JKT' },
    { name: 'Hendra Gunawan', email: 'hendra.gunawan@permatabank.co.id', role: 'Checker', dept: 'Core Banking Supervision', status: 'ACTIVE', sso: 'S-33190-JKT' },
    { name: 'Rina Wijaya', email: 'rina.wijaya@permatabank.co.id', role: 'Maker', dept: 'Digital Campaign Marketing', status: 'ACTIVE', sso: 'S-22810-JKT' },
  ];

  return (
    <div className="w-full">
      {/* Sub-navigation tabs within Home */}
      <div className="bg-[#002244] text-white px-4 md:px-8 py-2.5 flex items-center justify-between overflow-x-auto border-b border-[#003366] shadow-sm">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold mr-2 hidden sm:inline">
            Home Views:
          </span>
          <button
            type="button"
            onClick={() => setSubScreen('executive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'executive'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Executive Overview (KPIs)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'logs'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">receipt_long</span>
            <span>Consolidated Live Logs</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('sla')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'sla'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>SLA &amp; Compliance Hub</span>
          </button>

          {currentRole === 'Admin' && (
            <button
              type="button"
              onClick={() => setSubScreen('user-mgmt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                subScreen === 'user-mgmt'
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-base">manage_accounts</span>
              <span>User Control (Admin)</span>
            </button>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Orchestrator v3.4.1 • JKT-DC01</span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* SCREEN 1: EXECUTIVE OVERVIEW (MATCHES IMAGE 3) */}
      {/* ============================================================= */}
      {subScreen === 'executive' && (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-[1600px] mx-auto">
          {/* Top Command Strip & Overview Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#001B3A] text-white text-[11px] uppercase tracking-wider font-bold">
                  Cross-Engine Hub Reporting
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-mono text-[11px] font-bold">
                  ENVIRONMENT: PRODUCTION
                </span>
                <span className="font-mono text-xs sm:text-sm text-slate-500">
                  CLUSTER: PERMATA-DC-ID-01
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-[#002244] tracking-tight font-bold mt-1">
                Permata Engine Consolidated Reporting
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-4xl leading-relaxed">
                Real-time multi-engine operational telemetry, cost burn tracking, and delivery diagnostics across PermataMobile X Push, SMS Aggregators, and WhatsApp Business API.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                onClick={handleSyncTelemetry}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 text-[#002244] hover:bg-slate-100 text-xs sm:text-sm transition-all border border-slate-200 font-semibold shadow-xs cursor-pointer"
                type="button"
              >
                <span className={`material-symbols-outlined text-lg ${isSyncing ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>{isSyncing ? 'Syncing...' : 'Sync Telemetry'}</span>
              </button>

              <button
                onClick={onOpenExportModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0066FF] text-white hover:bg-[#0052CC] text-xs sm:text-sm shadow-md transition-all font-semibold cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">ios_share</span>
                <span>Export Consolidated Report</span>
              </button>
            </div>
          </div>

          {/* KPI Header Grid: 4 Core Executive Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Total Daily Dispatches</span>
                <span className="p-2 rounded-lg bg-[#EBF3FF] text-[#0066FF] material-symbols-outlined text-xl">
                  send
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl text-[#002244] font-bold tracking-tight">
                  {dailyDispatches}
                </span>
                <span className="inline-flex items-center text-emerald-600 font-mono text-xs sm:text-sm font-semibold">
                  <span className="material-symbols-outlined text-base">trending_up</span>+6.4%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>All 3 Engines combined</span>
                <span className="font-mono text-[#002244] font-semibold">Peak: 2,510 msg/s</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                <div className="h-full bg-[#0066FF]" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Overall SLA Delivery Rate</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 material-symbols-outlined text-xl">
                  verified
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl text-[#002244] font-bold tracking-tight">99.95%</span>
                <span className="inline-flex items-center text-emerald-600 font-mono text-xs sm:text-sm font-semibold">
                  <span className="material-symbols-outlined text-base">check_circle</span>SLA 99.80%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Failed: 2,109</span>
                <span className="font-mono text-emerald-600 font-semibold">Fail 0.05%</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                <div className="h-full bg-emerald-500" style={{ width: '99.95%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Total Cost Burn (MTD)</span>
                <span className="p-2 rounded-lg bg-slate-100 text-[#002244] material-symbols-outlined text-xl">
                  account_balance_wallet
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-slate-500 font-bold font-mono">IDR</span>
                <span className="text-2xl sm:text-3xl text-[#002244] font-bold tracking-tight">892,450,000</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Budget: IDR 1.25B</span>
                <span className="font-mono text-[#002244] font-semibold">71.3% Used</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                <div className="h-full bg-[#001B3A]" style={{ width: '71.3%' }}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-xs border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">Core Latency (P99)</span>
                <span className="p-2 rounded-lg bg-slate-100 text-[#002244] material-symbols-outlined text-xl">
                  speed
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl text-[#002244] font-bold tracking-tight">18.4</span>
                <span className="text-base sm:text-lg font-semibold text-slate-500">ms</span>
                <span className="ml-2 inline-flex items-center text-emerald-600 font-mono text-xs font-semibold">
                  P50: 6.8ms
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Bus: Kafka v3</span>
                <span className="font-mono text-emerald-600 font-semibold">Ultra Low Jitter</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                <div className="h-full bg-[#0066FF]" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>

          {/* Interactive Engine Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] uppercase font-bold text-slate-500 px-2">Filter View:</span>
              <button
                onClick={() => setEngineFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  engineFilter === 'all'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#002244] hover:bg-slate-100'
                }`}
                type="button"
              >
                All Engines (Consolidated)
              </button>
              <button
                onClick={() => setEngineFilter('notif')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  engineFilter === 'notif'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#002244] hover:bg-slate-100'
                }`}
                type="button"
              >
                Notification Engine
              </button>
              <button
                onClick={() => setEngineFilter('sms')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  engineFilter === 'sms'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#002244] hover:bg-slate-100'
                }`}
                type="button"
              >
                SMS Engine
              </button>
              <button
                onClick={() => setEngineFilter('wa')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  engineFilter === 'wa'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#002244] hover:bg-slate-100'
                }`}
                type="button"
              >
                WhatsApp Engine
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 px-2 font-mono">
              <span>Range: <strong>Today (00:00 - Now WIB)</strong></span>
            </div>
          </div>

          {/* Section: Notification Breakdown */}
          {(engineFilter === 'all' || engineFilter === 'notif') && (
            <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col transition-all">
              <div className="h-12 bg-[#001B3A] px-4 sm:px-6 flex items-center justify-between text-white border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-xl text-[#EBF3FF]">cell_tower</span>
                  <span className="text-sm sm:text-base font-bold tracking-wide">
                    Detailed Reporting: Notification Engine
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">
                    PermataMobile X &amp; Secure Inbox
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-300 font-semibold hidden sm:inline">
                    1,842,500 Dispatches
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    HEALTHY
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Peak Throughput</span>
                    <span className="material-symbols-outlined text-sm">flash_on</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-[#002244]">
                      1,240 <span className="text-xs text-slate-500 font-normal">msg/sec</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Sustained rate: 820 msg/sec</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-[#0066FF] h-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>OS Distribution &amp; Delivery</span>
                    <span className="material-symbols-outlined text-sm">devices</span>
                  </div>
                  <div className="my-2 flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#002244] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>Android (FCM v1)
                      </span>
                      <span className="font-mono font-bold text-[#002244]">64.2% (99.98% OK)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#002244] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#001B3A]"></span>iOS (APNs HTTP/2)
                      </span>
                      <span className="font-mono font-bold text-[#002244]">35.8% (99.99% OK)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden flex">
                    <div className="bg-[#0066FF] h-full" style={{ width: '64.2%' }}></div>
                    <div className="bg-[#001B3A] h-full" style={{ width: '35.8%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Handshake &amp; Ack Latency</span>
                    <span className="material-symbols-outlined text-sm">timer</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-[#002244]">
                      12.6 <span className="text-xs text-slate-500 font-normal">ms avg</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">APNs: 9.4ms • FCM: 14.1ms</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Bounce / Stale Tokens</span>
                    <span className="material-symbols-outlined text-sm">remove_circle_outline</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-[#002244]">0.02%</div>
                    <p className="text-xs text-slate-500 mt-0.5">368 unregistered devices purged</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: '2%' }}></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section: SMS Breakdown */}
          {(engineFilter === 'all' || engineFilter === 'sms') && (
            <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col transition-all">
              <div className="h-12 bg-[#002244] px-4 sm:px-6 flex items-center justify-between text-white border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-xl text-sky-300">sms</span>
                  <span className="text-sm sm:text-base font-bold tracking-wide">
                    Detailed Reporting: SMS Engine
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">
                    SMPP 3.4 Aggregator Cluster
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-300 font-semibold hidden sm:inline">
                    1,396,420 OTP &amp; Alerts
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0066FF] text-white text-[10px] font-bold">
                    ALL BINDS UP
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs sm:text-sm text-[#002244] font-bold">
                      Telco Carrier Routing &amp; Performance
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Window: 24h Aggregated</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[500px]">
                      <thead className="text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5">Telco Partner</th>
                          <th className="py-2.5">Route Type</th>
                          <th className="py-2.5">Volume</th>
                          <th className="py-2.5">Delivery Rate</th>
                          <th className="py-2.5">Avg Latency</th>
                          <th className="py-2.5 text-right">Retry Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-[#002244]">
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>Telkomsel
                          </td>
                          <td className="py-2.5">Tier-1 Direct SMPP</td>
                          <td className="py-2.5">782,100</td>
                          <td className="py-2.5 text-emerald-600 font-bold">99.98%</td>
                          <td className="py-2.5">4.2 ms</td>
                          <td className="py-2.5 text-right text-slate-500">112 (0.01%)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>Indosat Ooredoo
                          </td>
                          <td className="py-2.5">Direct SMPP Bind</td>
                          <td className="py-2.5">341,200</td>
                          <td className="py-2.5 text-emerald-600 font-bold">99.91%</td>
                          <td className="py-2.5">8.8 ms</td>
                          <td className="py-2.5 text-right text-slate-500">84 (0.02%)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>XL Axiata
                          </td>
                          <td className="py-2.5">Direct SMPP Bind</td>
                          <td className="py-2.5">210,120</td>
                          <td className="py-2.5 text-emerald-600 font-bold">99.85%</td>
                          <td className="py-2.5">11.4 ms</td>
                          <td className="py-2.5 text-right text-slate-500">62 (0.03%)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>Smartfren &amp; Others
                          </td>
                          <td className="py-2.5">Secondary Hub</td>
                          <td className="py-2.5">63,000</td>
                          <td className="py-2.5 text-[#002244] font-semibold">99.78%</td>
                          <td className="py-2.5">14.9 ms</td>
                          <td className="py-2.5 text-right text-slate-500">19 (0.03%)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs sm:text-sm text-[#002244] font-bold">
                      Prepaid Quota &amp; Retry Diagnostics
                    </span>
                    <div className="mt-3 flex flex-col gap-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between text-slate-500 mb-1">
                          <span>SMS Credit Balance Pool:</span>
                          <span className="font-mono font-bold text-[#002244]">IDR 412,800,000</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded overflow-hidden">
                          <div className="bg-[#0066FF] h-full" style={{ width: '68%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          Estimated 4.2 days runway at current TPS
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Automatic Carrier Failover:</span>
                          <span className="text-emerald-600 font-bold font-mono">ACTIVE (Tsel &gt; Isat)</span>
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-slate-500 font-medium">Auto Re-route Threshold:</span>
                          <span className="text-[#002244] font-bold font-mono">&gt; 1,200ms ACK delay</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Sender ID Active:</span>
                    <span className="font-mono text-[#002244] font-bold">PERMATABANK (Whitelisted)</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section: WhatsApp Breakdown */}
          {(engineFilter === 'all' || engineFilter === 'wa') && (
            <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col transition-all">
              <div className="h-12 bg-[#001B3A] px-4 sm:px-6 flex items-center justify-between text-white border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-xl text-emerald-400">chat</span>
                  <span className="text-sm sm:text-base font-bold tracking-wide">
                    Detailed Reporting: WhatsApp Engine
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">
                    Meta Cloud API (WABA Singapore)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-300 font-semibold hidden sm:inline">
                    980,000 Dispatched Today
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                    TIER 4 UNLIMITED
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Tier 4 24h Quota Utilization</span>
                    <span className="material-symbols-outlined text-sm">pie_chart</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-[#002244]">49.0%</div>
                    <p className="text-xs text-slate-500 mt-0.5">980,000 / 2,000,000 daily soft cap</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-[#0066FF] h-full" style={{ width: '49%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>HSM Read Velocity (2-Tick)</span>
                    <span className="material-symbols-outlined text-sm">done_all</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-emerald-600">94.2%</div>
                    <p className="text-xs text-slate-500 mt-0.5">Median read speed: 46 seconds</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Failure to Deliver (Invalid WA)</span>
                    <span className="material-symbols-outlined text-sm">error_outline</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-[#002244]">
                      0.42% <span className="text-xs text-slate-500 font-normal">(4,116)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Meta Error 131026 (Unregistered)</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: '4.2%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Auto SMS Fallback Triggered</span>
                    <span className="material-symbols-outlined text-sm">swap_calls</span>
                  </div>
                  <div className="my-2">
                    <div className="font-mono text-2xl font-bold text-[#002244]">
                      4,116 <span className="text-xs text-emerald-600 font-semibold">100% Recaptured</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Rerouted via Telkomsel SMPP</p>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-[#001B3A] h-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Live Consolidated Stream Table */}
          <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg text-[#002244] tracking-tight font-bold">
                    Live Consolidated Cross-Engine Reporting Stream
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-mono text-xs font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live WS
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Aggregated audit events from Push FCM/APNs, Telco SMS Gateways, and Meta WhatsApp Business API.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search stream..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#002244] outline-none focus:border-[#0066FF] w-40 sm:w-48"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-2 text-slate-400 text-sm">
                    search
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setStreamFilter('ALL')}
                    className={`px-3 py-1 rounded text-xs transition-all font-bold cursor-pointer ${
                      streamFilter === 'ALL'
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#002244]'
                    }`}
                  >
                    All Streams
                  </button>
                  <button
                    type="button"
                    onClick={() => setStreamFilter('NOTIFICATION')}
                    className={`px-3 py-1 rounded text-xs transition-all font-semibold cursor-pointer ${
                      streamFilter === 'NOTIFICATION'
                        ? 'bg-[#0066FF] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-[#002244]'
                    }`}
                  >
                    Notification
                  </button>
                  <button
                    type="button"
                    onClick={() => setStreamFilter('SMS')}
                    className={`px-3 py-1 rounded text-xs transition-all font-semibold cursor-pointer ${
                      streamFilter === 'SMS'
                        ? 'bg-[#0066FF] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-[#002244]'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    type="button"
                    onClick={() => setStreamFilter('WHATSAPP')}
                    className={`px-3 py-1 rounded text-xs transition-all font-semibold cursor-pointer ${
                      streamFilter === 'WHATSAPP'
                        ? 'bg-[#0066FF] text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-[#002244]'
                    }`}
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Timestamp / Ref</th>
                    <th className="px-3 sm:px-4 py-3">Engine Origin</th>
                    <th className="px-3 sm:px-4 py-3">Template / Category</th>
                    <th className="px-3 sm:px-4 py-3">Recipient Identifier</th>
                    <th className="px-3 sm:px-4 py-3">Carrier / Channel Node</th>
                    <th className="px-3 sm:px-4 py-3">Latency</th>
                    <th className="px-4 sm:px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm text-[#002244]">
                  {filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <div className="font-mono text-xs sm:text-sm text-[#002244] font-semibold">
                          {evt.timestamp}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">{evt.ref}</div>
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        {evt.engine === 'NOTIFICATION' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3FF] text-[#0066FF] text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-[#0066FF]"></span>
                            Notification
                          </span>
                        )}
                        {evt.engine === 'SMS' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                            SMS Engine
                          </span>
                        )}
                        {evt.engine === 'WHATSAPP' && evt.status === 'RE-ROUTED SMS' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                            WA Failover
                          </span>
                        ) : evt.engine === 'WHATSAPP' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                            WhatsApp
                          </span>
                        ) : null}
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        <div className="text-xs sm:text-sm text-[#002244] font-bold">
                          {evt.templateCode}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">
                          {evt.templateTitle}
                        </div>
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        <span className="font-mono text-xs sm:text-sm text-[#002244] font-medium">
                          {evt.recipient}
                        </span>
                        <span className="text-[11px] text-slate-500 block">{evt.recipientSub}</span>
                      </td>

                      <td className="px-3 sm:px-4 py-3">
                        <span className="text-xs sm:text-sm text-[#002244]">{evt.channelNode}</span>
                        <span className="font-mono text-[11px] text-slate-500 block">
                          {evt.channelNodeSub}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm text-slate-500 font-medium">
                        {evt.latency}
                      </td>

                      <td className="px-4 sm:px-6 py-3 text-right">
                        {evt.status === 'DELIVERED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> DELIVERED
                          </span>
                        )}
                        {evt.status === 'READ (2-TICK)' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> READ (2-TICK)
                          </span>
                        )}
                        {evt.status === 'RE-ROUTED SMS' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span> RE-ROUTED SMS
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Displaying {filteredEvents.length} active buffered events of 4,218,920 records • Real-time stream sampling active
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-white text-[#002244] text-xs hover:bg-slate-100 transition-colors shadow-2xs font-semibold border border-slate-200 cursor-pointer"
                  onClick={onOpenExportModal}
                  type="button"
                >
                  Export Filtered (CSV)
                </button>
                <button
                  className="px-3.5 py-1.5 rounded-lg bg-[#001B3A] text-white text-xs hover:bg-[#002244] transition-colors shadow-2xs font-semibold cursor-pointer"
                  onClick={() => setSubScreen('logs')}
                  type="button"
                >
                  Open Full Explorer →
                </button>
              </div>
            </div>
          </section>

          {/* Bento Governance & SLA Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0066FF] text-xl">signal_cellular_alt</span>
                  <span className="text-xs sm:text-sm text-[#002244] font-bold">
                    Carrier Binds &amp; SMPP Matrix
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono text-xs font-bold">
                  4/4 SMPP UP
                </span>
              </div>
              <div className="flex flex-col gap-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#002244] font-medium">Telkomsel (Primary Node 1 &amp; 2)</span>
                  <span className="font-mono text-emerald-600 font-bold">99.98% • 4.2ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#002244] font-medium">Indosat Ooredoo (Direct SMPP)</span>
                  <span className="font-mono text-emerald-600 font-bold">99.91% • 8.8ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#002244] font-medium">XL Axiata (Direct SMPP)</span>
                  <span className="font-mono text-emerald-600 font-bold">99.85% • 11.4ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#002244] font-medium">Smartfren Telecom (Gateway Hub)</span>
                  <span className="font-mono text-[#002244] font-semibold">99.78% • 14.9ms</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-slate-500 text-xs">
                <span>Dynamic Telco Failover</span>
                <span className="text-emerald-600 font-bold">AUTOMATIC ACTIVE</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0066FF] text-xl">tune</span>
                  <span className="text-xs sm:text-sm text-[#002244] font-bold">
                    Meta WABA SLA &amp; Rate Limits
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[#002244] font-mono text-xs font-bold border border-slate-200">
                  Tier 4 Cap
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Rolling 24h Utilization</span>
                  <span className="font-mono text-[#002244] font-bold">980,000 / 2,000,000</span>
                </div>
                <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0066FF]" style={{ width: '49%' }}></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                  <span>Account Quality Rating</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> High (Green Score)
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-slate-500 text-xs">
                <span>HSM Automated Review SLA</span>
                <span className="font-mono text-[#002244] font-bold">&lt; 3.5 minutes avg</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-slate-200 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0066FF] text-xl">fact_check</span>
                  <span className="text-xs sm:text-sm text-[#002244] font-bold">
                    Maker-Checker Approvals
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF3FF] text-[#0066FF] text-xs font-bold">
                  4 Tasks Pending
                </span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm text-[#002244] font-bold">
                      OTP Rate Limit Override
                    </span>
                    <span className="text-[11px] text-slate-500">SecOps • 18m ago</span>
                  </div>
                  <button
                    className="px-2.5 py-1 rounded-md bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#0052CC] transition-colors shadow-xs cursor-pointer"
                    onClick={() => onOpenMakerCheckerReview('OTP Rate Limit Override')}
                    type="button"
                  >
                    Review
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm text-[#002244] font-bold">
                      Holiday Push Broadcast
                    </span>
                    <span className="text-[11px] text-slate-500">Retail Mktg • 42m ago</span>
                  </div>
                  <button
                    className="px-2.5 py-1 rounded-md bg-[#0066FF] text-white text-xs font-semibold hover:bg-[#0052CC] transition-colors shadow-xs cursor-pointer"
                    onClick={() => onOpenMakerCheckerReview('Holiday Push Broadcast')}
                    type="button"
                  >
                    Review
                  </button>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500 text-xs">
                <span>Dual-Control Enforced</span>
                <button
                  type="button"
                  onClick={() => showToast('Displaying all 4 pending dual-control approval queues', 'info')}
                  className="text-[#0066FF] hover:underline font-bold cursor-pointer"
                >
                  View All 4 Tasks →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 2: FULL CONSOLIDATED LOGS EXPLORER */}
      {/* ============================================================= */}
      {subScreen === 'logs' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Consolidated Log Stream Explorer</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time transaction stream across PermataMobile X Push, SMS Gateways, and Meta WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenExportModal}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold border border-slate-200 cursor-pointer"
                type="button"
              >
                Export CSV
              </button>
              <button
                onClick={handleSyncTelemetry}
                className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm"
                type="button"
              >
                Refresh Stream
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Filter by Ref, template, MSISDN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0066FF]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-sm">
                  search
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-600 font-bold hidden sm:inline">
                ● Live WebSocket: 2,510 events/s
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-5 py-3">Timestamp / Ref</th>
                    <th className="px-4 py-3">Engine Origin</th>
                    <th className="px-4 py-3">Template / Category</th>
                    <th className="px-4 py-3">Recipient Identifier</th>
                    <th className="px-4 py-3">Carrier / Channel Node</th>
                    <th className="px-4 py-3">Latency</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[#0F172A]">
                  {filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono">
                        <div className="font-bold text-[#002244]">{evt.timestamp}</div>
                        <div className="text-[10px] text-slate-400">{evt.ref}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold">{evt.engine}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold">{evt.templateCode}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-xs">{evt.templateTitle}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono">{evt.recipient}</td>
                      <td className="px-4 py-3.5">{evt.channelNode}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">{evt.latency}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                        {evt.status}
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
      {/* SCREEN 3: SLA & COMPLIANCE HUB */}
      {/* ============================================================= */}
      {subScreen === 'sla' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">SLA &amp; Regulatory Compliance Ledger</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audited monthly SLA delivery benchmarks adhering to OJK and Bank Indonesia regulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Overall Monthly SLA</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">99.95%</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Regulated Target: &gt;= 99.80%</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Max Allowed Outage</span>
                <div className="text-2xl font-bold font-mono text-[#002244] mt-1">&lt; 14 Mins/Month</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Zero Outages Recorded</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Audit Ledger Signature</span>
                <div className="text-xs font-bold font-mono text-[#002244] mt-1 truncate">SHA256: 9482bf1092a...</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Signed by SecOps Automated Ledger</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 4: USER CONTROL (ADMIN) */}
      {/* ============================================================= */}
      {subScreen === 'user-mgmt' && currentRole === 'Admin' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">User Management &amp; Persona Access</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Directory of operators, makers, and checkers with SOX dual-control privileges.
              </p>
            </div>
            <button
              onClick={() => showToast('Opening Add Operator / Maker modal...', 'info')}
              className="px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-lg cursor-pointer"
              type="button"
            >
              + Add Operator
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3">User Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">SSO Identifier</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[#0F172A]">
                {usersList.map((u) => (
                  <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#002244]">{u.name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{u.email}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'Super Admin'
                          ? 'bg-blue-100 text-[#0066FF]'
                          : u.role === 'Checker'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{u.dept}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">{u.sso}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                      {u.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
