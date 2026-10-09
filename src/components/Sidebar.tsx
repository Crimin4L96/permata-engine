import React from 'react';
import { ActiveEngine, Role } from '../types';
import { WhatsAppSubScreen } from './WhatsAppEngineView';
import { NotificationSubScreen } from './NotificationEngineView';
import { SmsSubScreen } from './SmsEngineView';
import { HomeSubScreen } from './HomeReportingView';

interface SidebarProps {
  activeEngine: ActiveEngine;
  setActiveEngine: (engine: ActiveEngine) => void;
  currentRole: Role;
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
  waSubScreen: WhatsAppSubScreen;
  setWaSubScreen: (screen: WhatsAppSubScreen) => void;
  notifSubScreen: NotificationSubScreen;
  setNotifSubScreen: (screen: NotificationSubScreen) => void;
  smsSubScreen: SmsSubScreen;
  setSmsSubScreen: (screen: SmsSubScreen) => void;
  homeSubScreen: HomeSubScreen;
  setHomeSubScreen: (screen: HomeSubScreen) => void;
  onOpenMatrixModal?: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeEngine,
  setActiveEngine,
  currentRole,
  isMobileOpen,
  closeMobileSidebar,
  waSubScreen,
  setWaSubScreen,
  notifSubScreen,
  setNotifSubScreen,
  smsSubScreen,
  setSmsSubScreen,
  homeSubScreen,
  setHomeSubScreen,
  onOpenMatrixModal,
  showToast,
}) => {
  return (
    <>
      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#001B3A]/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Main Aside */}
      <aside
        className={`fixed left-0 top-[108px] md:top-16 bottom-0 w-64 bg-[#001529] z-40 flex flex-col justify-between overflow-y-auto shadow-2xl border-r border-white/10 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* ======================================================== */}
          {/* WHATSAPP ENGINE SIDEBAR */}
          {/* ======================================================== */}
          {activeEngine === 'whatsapp' && (
            <>
              <div className="px-5 pt-5 pb-4 bg-[#001B3A] border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[11px] text-[#EBF3FF] uppercase tracking-wider font-bold">
                      WABA Node
                    </span>
                  </div>
                  <button
                    className="lg:hidden text-white/70 hover:text-white p-1"
                    onClick={closeMobileSidebar}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
                <div className="text-lg text-white font-bold leading-tight mt-1.5">WhatsApp Engine</div>
                <p className="text-[12px] text-slate-400 mt-0.5">Meta Cloud HSM Gateway</p>
              </div>

              <div className="px-4 py-2">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Engine Modules
                </div>
              </div>

              <nav className="flex flex-col px-2.5 gap-1">
                {/* HSM Template Studio */}
                <button
                  type="button"
                  onClick={() => {
                    setWaSubScreen('studio');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-xs cursor-pointer ${
                    waSubScreen === 'studio'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">assignment</span>
                  <span className="font-bold">HSM Template Studio</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-[#001B3A] text-white font-mono uppercase">
                    V3
                  </span>
                </button>

                {/* Template Directory */}
                <button
                  type="button"
                  onClick={() => {
                    setWaSubScreen('directory');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                    waSubScreen === 'directory'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">folder_open</span>
                    <span>Template Directory</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">6</span>
                </button>

                {/* Meta Account (WABA) */}
                <button
                  type="button"
                  onClick={() => {
                    setWaSubScreen('account');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                    waSubScreen === 'account'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">domain_verification</span>
                    <span>Meta Account (WABA)</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="WABA Linked"></span>
                </button>

                {/* Conversations */}
                <button
                  type="button"
                  onClick={() => {
                    setWaSubScreen('conversations');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                    waSubScreen === 'conversations'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">forum</span>
                    <span>Conversations</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#0066FF]/30 text-[#EBF3FF] text-[10px] font-semibold">
                    Live
                  </span>
                </button>

                {/* Failover Guard */}
                <button
                  type="button"
                  onClick={() => {
                    setWaSubScreen('studio');
                    closeMobileSidebar();
                    showToast('Failover Guard: SMS Auto-fallback active (60s SLA)', 'info');
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all text-left text-xs font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">safety_check</span>
                  <span>Failover Guard</span>
                </button>

                {/* Webhook & Dispatch Logs */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveEngine('home');
                    closeMobileSidebar();
                    showToast('Opening consolidated dispatch logs', 'info');
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all text-left text-xs font-medium cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">webhook</span>
                  <span>Webhook &amp; Dispatch Logs</span>
                </button>
              </nav>
            </>
          )}

          {/* ======================================================== */}
          {/* NOTIFICATION ENGINE SIDEBAR */}
          {/* ======================================================== */}
          {activeEngine === 'notification' && (
            <>
              <div className="px-5 pt-5 pb-4 bg-[#001B3A] border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0066FF] shadow-[0_0_6px_#0066FF]"></span>
                    <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
                      Push &amp; In-App Subsystem
                    </span>
                  </div>
                  <button className="lg:hidden p-1 text-white/70 hover:text-white" onClick={closeMobileSidebar}>
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div className="text-lg text-white font-bold leading-tight mt-1.5">Hi, Ahmad Arif</div>
                <p className="text-xs text-blue-200/80 mt-0.5">Role: {currentRole === 'Admin' ? 'Super Admin' : currentRole}</p>
              </div>

              <div className="px-4 pt-4 pb-2">
                <div className="px-2 text-[11px] text-blue-300 uppercase tracking-wider font-bold">
                  Notification Engine Menu
                </div>
              </div>

              <nav className="flex flex-col px-3 gap-1">
                {/* Template Configuration */}
                <button
                  type="button"
                  onClick={() => {
                    setNotifSubScreen('config');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left text-xs cursor-pointer ${
                    notifSubScreen === 'config'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-blue-100 hover:bg-[#002D5C] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">format_paint</span>
                    <span>Template Editor</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px] font-bold">
                    EDIT
                  </span>
                </button>

                {/* Template Directory */}
                <button
                  type="button"
                  onClick={() => {
                    setNotifSubScreen('directory');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left text-xs cursor-pointer ${
                    notifSubScreen === 'directory'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-blue-100 hover:bg-[#002D5C] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">folder_open</span>
                    <span>Template Directory</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">6</span>
                </button>

                {/* Push Broadcast Dispatch */}
                <button
                  type="button"
                  onClick={() => {
                    setNotifSubScreen('broadcast');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-xs font-medium cursor-pointer ${
                    notifSubScreen === 'broadcast'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-blue-100 hover:bg-[#002D5C] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">send_and_archive</span>
                  <span>Push Broadcast Dispatch</span>
                </button>

                {/* FCM & APNs Config */}
                <button
                  type="button"
                  onClick={() => {
                    setNotifSubScreen('gateway');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-xs font-medium cursor-pointer ${
                    notifSubScreen === 'gateway'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-blue-100 hover:bg-[#002D5C] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                  <span>FCM &amp; APNs Config</span>
                </button>
              </nav>
            </>
          )}

          {/* ======================================================== */}
          {/* HOME SIDEBAR */}
          {/* ======================================================== */}
          {activeEngine === 'home' && (
            <>
              <div className="px-5 pt-4 pb-3 bg-[#001B3A] border-b border-white/10">
                <div className="font-bold text-base text-white leading-tight">Hi, Ahmad Arif</div>
                <p className="text-[12px] text-slate-300 mt-0.5">Micro Frontend Reporting Space</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Mode:</span>
                  <span className="px-2 py-0.5 rounded bg-[#0066FF]/20 text-[#EBF3FF] font-mono text-[10px] font-bold border border-[#0066FF]/40">
                    {currentRole.toUpperCase()} ACCESS
                  </span>
                </div>
              </div>

              <div className="px-4 pt-3 pb-1">
                <span className="px-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Home Reporting Views
                </span>
              </div>

              <nav className="flex flex-col px-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setHomeSubScreen('executive');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                    homeSubScreen === 'executive'
                      ? 'bg-[#0066FF] text-white shadow-sm border-l-4 border-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">dashboard</span>
                  <span>Executive Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHomeSubScreen('logs');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                    homeSubScreen === 'logs'
                      ? 'bg-[#0066FF] text-white shadow-sm border-l-4 border-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">receipt_long</span>
                    <span>Consolidated Logs</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] font-bold">
                    LIVE
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHomeSubScreen('sla');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                    homeSubScreen === 'sla'
                      ? 'bg-[#0066FF] text-white shadow-sm border-l-4 border-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl">verified_user</span>
                    <span>SLA &amp; Compliance</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </button>
              </nav>

              {/* USER CONTROL SECTION (ONLY SHOWN IF ROLE === ADMIN) */}
              {currentRole === 'Admin' && (
                <div className="flex flex-col mt-4 pt-3 border-t border-white/10 transition-all duration-300">
                  <div className="px-4 pb-1 flex items-center justify-between">
                    <span className="px-2 text-[10px] text-blue-200 uppercase tracking-wider font-bold">
                      User Control
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#0066FF] text-white font-mono text-[9px] font-bold">
                      ADMIN ONLY
                    </span>
                  </div>
                  <nav className="flex flex-col px-3 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setHomeSubScreen('user-mgmt');
                        closeMobileSidebar();
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                        homeSubScreen === 'user-mgmt'
                          ? 'bg-[#0066FF] text-white font-bold'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">manage_accounts</span>
                      <span>User Management</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        closeMobileSidebar();
                        onOpenMatrixModal?.();
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-medium text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-xl">rule_folder</span>
                        <span>Maker-Checker Matrix</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">
                        12 Rules
                      </span>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}

          {/* ======================================================== */}
          {/* SMS ENGINE SIDEBAR */}
          {/* ======================================================== */}
          {activeEngine === 'sms' && (
            <>
              <div className="px-5 pt-5 pb-4 bg-[#001B3A] border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                    <span className="text-[11px] text-sky-200 uppercase tracking-wider font-bold">
                      SMPP 3.4 Cluster
                    </span>
                  </div>
                  <button className="lg:hidden p-1 text-white/70 hover:text-white" onClick={closeMobileSidebar}>
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
                <div className="text-lg text-white font-bold leading-tight mt-1.5">SMS Engine</div>
                <p className="text-xs text-slate-400 mt-0.5">Telco Aggregator &amp; Masking Hub</p>
              </div>

              <div className="px-4 py-2">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  SMS Subsystems
                </div>
              </div>

              <nav className="flex flex-col px-2.5 gap-1">
                {/* SMS Template Studio */}
                <button
                  type="button"
                  onClick={() => {
                    setSmsSubScreen('composer');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-xs cursor-pointer ${
                    smsSubScreen === 'composer'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">sms</span>
                  <span>SMS Template Studio</span>
                </button>

                {/* Carrier Binds & Routes */}
                <button
                  type="button"
                  onClick={() => {
                    setSmsSubScreen('routes');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-xs cursor-pointer ${
                    smsSubScreen === 'routes'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">router</span>
                  <span>Carrier Binds &amp; Routes</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-300 font-mono">
                    4 UP
                  </span>
                </button>

                {/* Sender ID Masking */}
                <button
                  type="button"
                  onClick={() => {
                    setSmsSubScreen('masking');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                    smsSubScreen === 'masking'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">badge</span>
                  <span>Masking Sender IDs</span>
                </button>

                {/* Prepaid Quota & CDR */}
                <button
                  type="button"
                  onClick={() => {
                    setSmsSubScreen('quota');
                    closeMobileSidebar();
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                    smsSubScreen === 'quota'
                      ? 'bg-[#0066FF] text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                  <span>Prepaid Quota &amp; CDR</span>
                </button>
              </nav>
            </>
          )}
        </div>

        {/* Sidebar Footer Strip */}
        <div className="p-3.5 m-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5">
          {activeEngine === 'whatsapp' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-white uppercase tracking-wider font-semibold">
                    Meta Graph Node
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#0066FF] font-bold bg-white/10 px-1 rounded">
                  v20.0
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-400 flex justify-between">
                <span>TPS: 2,500/s</span>
                <span className="text-emerald-300 font-semibold">SYNC 100%</span>
              </div>
            </>
          )}

          {activeEngine === 'notification' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span className="text-[11px] text-white uppercase tracking-wide font-semibold">
                    Permata Push MFE
                  </span>
                </div>
                <span className="text-[#0066FF] text-[10px] font-mono font-bold bg-blue-500/10 px-1 rounded">
                  ONLINE
                </span>
              </div>
              <div className="font-mono text-[11px] text-blue-200/80 flex items-center justify-between mt-0.5">
                <span>Node: 04-JKT</span>
                <span>v3.12.8</span>
              </div>
            </>
          )}

          {activeEngine === 'home' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-white font-bold tracking-wide">MFE Orchestrator</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">Cluster OK</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>Region: JKT-DC01</span>
                <span className="text-white font-semibold">v3.4.1</span>
              </div>
            </>
          )}

          {activeEngine === 'sms' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span className="text-[11px] text-white font-bold tracking-wide">Telco SMPP Hub</span>
                </div>
                <span className="font-mono text-[10px] text-sky-400">4 Binds Active</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 flex items-center justify-between">
                <span>Node: JKT-SEC02</span>
                <span className="text-white font-semibold">v2.8.4</span>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
