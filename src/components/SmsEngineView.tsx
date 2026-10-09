import React, { useState } from 'react';
import { Role } from '../types';

export type SmsSubScreen = 'composer' | 'routes' | 'masking' | 'quota';

interface SmsEngineViewProps {
  currentRole: Role;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  activeSubScreen?: SmsSubScreen;
  setActiveSubScreen?: (screen: SmsSubScreen) => void;
}

export const SmsEngineView: React.FC<SmsEngineViewProps> = ({
  currentRole,
  showToast,
  activeSubScreen: controlledSubScreen,
  setActiveSubScreen: setControlledSubScreen,
}) => {
  const [internalSubScreen, setInternalSubScreen] = useState<SmsSubScreen>('composer');
  const subScreen = controlledSubScreen || internalSubScreen;
  const setSubScreen = setControlledSubScreen || setInternalSubScreen;

  const [senderId, setSenderId] = useState('PERMATABANK');
  const [templateCode, setTemplateCode] = useState('SMS_OTP_LOGIN_V2');
  const [smsBody, setSmsBody] = useState(
    'PERMATABANK: JANGAN BERIKAN KODE INI KEPADA SIAPAPUN. Kode OTP transaksi Anda adalah {otp_code}. Berlaku {exp_minute} menit. Ref: {ref_id}'
  );
  const [testOtp, setTestOtp] = useState('749281');
  const [testExpiry, setTestExpiry] = useState('5');
  const [testMsisdn, setTestMsisdn] = useState('+62 812-9843-1102');
  const [isDispatching, setIsDispatching] = useState(false);

  // Character and segment calculation (GSM 7-bit standard: 160 chars per SMS segment)
  const charCount = smsBody.length;
  const segments = Math.ceil(charCount / 160) || 1;

  const renderSmsBody = () => {
    let result = smsBody;
    result = result.replace(/{otp_code}/g, testOtp);
    result = result.replace(/{exp_minute}/g, testExpiry);
    result = result.replace(/{ref_id}/g, 'TXN-98421');
    return result;
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      showToast(`SMS dispatched via Telkomsel SMPP to ${testMsisdn}. Delivery ACK: 200 OK (3.8ms)`, 'success');
    }, 700);
  };

  const maskingList = [
    { id: 'PERMATABANK', type: 'Transactional / Alerts', telco: 'All 4 Telcos', status: 'WHITELISTED', regNo: 'KOMINFO-REG-0021' },
    { id: 'PERMATA_OTP', type: 'High Priority OTP', telco: 'All 4 Telcos', status: 'WHITELISTED', regNo: 'KOMINFO-REG-0022' },
    { id: 'PERMATA_INFO', type: 'Marketing & Advisory', telco: 'All 4 Telcos', status: 'WHITELISTED', regNo: 'KOMINFO-REG-0023' },
    { id: 'PERMATAME', type: 'Retail Campaign', telco: 'Telkomsel, Indosat', status: 'IN_REVIEW', regNo: 'KOMINFO-REG-0029' },
  ];

  return (
    <div className="w-full">
      {/* Sub-navigation tabs within SMS Engine */}
      <div className="bg-[#002244] text-white px-4 md:px-8 py-2.5 flex items-center justify-between overflow-x-auto border-b border-[#003366] shadow-sm">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold mr-2 hidden sm:inline">
            SMS Views:
          </span>
          <button
            type="button"
            onClick={() => setSubScreen('composer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'composer'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">sms</span>
            <span>SMS Template Studio (Active)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('routes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'routes'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">router</span>
            <span>Carrier Binds &amp; Routes (4 UP)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('masking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'masking'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>Sender ID Masking Registry</span>
          </button>

          <button
            type="button"
            onClick={() => setSubScreen('quota')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              subScreen === 'quota'
                ? 'bg-[#0066FF] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span>Prepaid Quota &amp; CDR Logs</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-sky-300">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          <span>SMPP 3.4 Aggregator Hub • Cluster OK</span>
        </div>
      </div>

      {/* ============================================================= */}
      {/* SCREEN 1: SMS TEMPLATE & OTP STUDIO */}
      {/* ============================================================= */}
      {subScreen === 'composer' && (
        <>
          <div className="bg-white px-4 md:px-8 py-4 shadow-xs mb-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EBF3FF] text-[#0066FF] text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">cell_tower</span>
                    SMPP 3.4 Cluster Active
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-semibold">
                    Telco Whitelisted PERMATABANK
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl text-[#0F172A] tracking-tight font-bold mt-1">
                  SMS Engine &amp; Carrier Gateway
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Direct SMPP binds to Indonesian Tier-1 Telcos (Telkomsel, Indosat, XL, Smartfren) with dynamic fallback.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Testing SMPP Binds... 4 of 4 connections healthy', 'success')}
                  className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-semibold border border-slate-200 transition-all cursor-pointer shadow-xs"
                  type="button"
                >
                  Test SMPP Binds
                </button>
                <button
                  onClick={() => setSubScreen('routes')}
                  className="px-4 py-2 rounded-lg bg-[#0066FF] text-white hover:bg-[#0052CC] text-xs font-bold shadow-md transition-all cursor-pointer"
                  type="button"
                >
                  Manage Routing Tables
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Left Column: Form */}
              <div className="xl:col-span-7 flex flex-col gap-6">
                <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200">
                  <div className="h-11 bg-[#001B3A] px-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#EBF3FF]">hub</span>
                      <span className="text-sm font-bold tracking-wide">Carrier Bind Status &amp; Throughput</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      4 Binds Connected
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500">Telkomsel Tier-1</span>
                      <span className="text-sm font-bold text-emerald-600 mt-1">BIND ACTIVE</span>
                      <span className="font-mono text-xs text-slate-500 mt-0.5">TPS: 1,200/s</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500">Indosat Ooredoo</span>
                      <span className="text-sm font-bold text-emerald-600 mt-1">BIND ACTIVE</span>
                      <span className="font-mono text-xs text-slate-500 mt-0.5">TPS: 850/s</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500">XL Axiata</span>
                      <span className="text-sm font-bold text-emerald-600 mt-1">BIND ACTIVE</span>
                      <span className="font-mono text-xs text-slate-500 mt-0.5">TPS: 600/s</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
                      <span className="text-[11px] font-bold text-slate-500">Smartfren</span>
                      <span className="text-sm font-bold text-emerald-600 mt-1">BIND ACTIVE</span>
                      <span className="font-mono text-xs text-slate-500 mt-0.5">TPS: 250/s</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden shadow-xs bg-white border border-slate-200">
                  <div className="h-11 bg-[#001B3A] px-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-[#EBF3FF]">sms</span>
                      <span className="text-sm font-bold tracking-wide">SMS Template &amp; Token Configuration</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300">GSM 7-bit Encoding</span>
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Sender ID Masking
                        </label>
                        <select
                          value={senderId}
                          onChange={(e) => setSenderId(e.target.value)}
                          className="h-10 px-3 bg-slate-50 rounded-lg text-sm text-[#0F172A] font-bold border border-slate-200 outline-none focus:ring-2 focus:ring-[#0066FF]"
                        >
                          <option value="PERMATABANK">PERMATABANK (Transactional)</option>
                          <option value="PERMATA_OTP">PERMATA_OTP (High Priority)</option>
                          <option value="PERMATA_INFO">PERMATA_INFO (Marketing &amp; Advisory)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          Template Code
                        </label>
                        <input
                          type="text"
                          value={templateCode}
                          onChange={(e) => setTemplateCode(e.target.value)}
                          className="h-10 px-3 bg-slate-50 rounded-lg text-sm font-mono text-[#0F172A] font-semibold border border-slate-200 outline-none focus:ring-2 focus:ring-[#0066FF]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                          SMS Message Body
                        </label>
                        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                          <span>{charCount} chars</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold">
                            {segments} Segment{segments > 1 ? 's' : ''} (160/seg)
                          </span>
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5 flex-wrap border border-slate-200">
                        <span className="text-[11px] text-slate-500 font-semibold mr-1">Insert Token:</span>
                        <button
                          type="button"
                          onClick={() => setSmsBody((prev) => prev + ' {otp_code}')}
                          className="px-2 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] text-xs font-mono font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{otp_code}'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSmsBody((prev) => prev + ' {exp_minute}')}
                          className="px-2 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] text-xs font-mono font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{exp_minute}'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSmsBody((prev) => prev + ' {ref_id}')}
                          className="px-2 py-1 rounded bg-white hover:bg-[#0066FF] hover:text-white text-[#0066FF] text-xs font-mono font-semibold transition-all shadow-xs border border-slate-200 cursor-pointer"
                        >
                          + {'{ref_id}'}
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={smsBody}
                        onChange={(e) => setSmsBody(e.target.value)}
                        className="w-full p-3 bg-slate-50 text-sm text-[#0F172A] rounded-lg font-mono outline-none border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#0066FF]"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Telco regulation: No sensitive PIN numbers or personal data in plaintext SMS.</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">verified</span> OJK Compliant
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Simulator */}
              <div className="xl:col-span-5 flex flex-col gap-4 xl:sticky xl:top-24">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#0066FF] text-xl">phone_android</span>
                    <span className="text-sm text-[#0F172A] font-bold">SMS Client Simulator</span>
                  </div>
                  <span className="font-mono text-xs text-emerald-600 font-bold">SMPP Loopback Active</span>
                </div>

                <div className="max-w-[360px] w-full mx-auto bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-700/60 ring-1 ring-black/20">
                  <div className="w-full bg-[#F4F6F9] rounded-[32px] overflow-hidden flex flex-col min-h-[500px] shadow-inner">
                    <div className="bg-[#001B3A] text-white px-4 py-2.5 flex items-center justify-between">
                      <span className="font-mono text-xs">09:42</span>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="material-symbols-outlined text-xs">signal_cellular_4_bar</span>
                        <span className="text-[10px] font-bold font-mono">TELKOMSEL</span>
                        <span className="material-symbols-outlined text-xs ml-1">battery_full</span>
                      </div>
                    </div>

                    <div className="bg-white border-b border-slate-200 p-3 flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400">arrow_back</span>
                      <div className="w-8 h-8 rounded-full bg-[#001B3A] text-white flex items-center justify-center font-bold text-xs">
                        P
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0F172A]">{senderId}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Verified Sender ID</span>
                      </div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-end gap-3">
                      <div className="self-center text-[10px] text-slate-400 font-mono">
                        Today 09:42 • Telkomsel SMPP
                      </div>

                      <div className="self-start max-w-[90%] bg-white p-3 rounded-2xl rounded-tl-none shadow-xs border border-slate-200 text-xs text-[#0F172A] leading-relaxed font-mono">
                        {renderSmsBody()}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 border-t border-slate-200 flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-xs text-slate-400">
                        Text message (Read-only OTP)
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">send</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                  <span className="text-xs font-bold text-[#002244] block">
                    Dispatch Test SMPP Push
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block">OTP Code</label>
                      <input
                        type="text"
                        value={testOtp}
                        onChange={(e) => setTestOtp(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-50 font-mono text-xs text-[#002244] border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 font-semibold block">Expiry (Mins)</label>
                      <input
                        type="text"
                        value={testExpiry}
                        onChange={(e) => setTestExpiry(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-50 font-mono text-xs text-[#002244] border border-slate-200"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-500 font-semibold block">Test MSISDN</label>
                      <input
                        type="text"
                        value={testMsisdn}
                        onChange={(e) => setTestMsisdn(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-50 font-mono text-xs text-[#002244] border border-slate-200"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="w-full py-2.5 rounded-lg bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <span className={`material-symbols-outlined text-base ${isDispatching ? 'animate-spin' : ''}`}>
                      {isDispatching ? 'refresh' : 'send'}
                    </span>
                    <span>{isDispatching ? 'Transmitting to SMPP Gateway...' : 'Send Live Test SMS'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================================= */}
      {/* SCREEN 2: CARRIER BINDS & ROUTES */}
      {/* ============================================================= */}
      {subScreen === 'routes' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">SMPP Carrier Binds &amp; Routing Topology</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active connections to Telkomsel, Indosat Ooredoo, XL Axiata, and Smartfren aggregator nodes.
              </p>
            </div>
            <button
              onClick={() => showToast('Re-binding SMPP sessions... All 4 carriers re-synchronized', 'success')}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>Re-Bind All Carriers</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#002244]">Telkomsel Direct SMPP (Node 1 &amp; 2)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">TIER-1 ACTIVE</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>Host: <strong>smpp.telkomsel.co.id:2775</strong></div>
                <div>System ID: <strong>PERMATA_PROD_TSEL01</strong></div>
                <div>Throughput: <strong>1,200 SMS/s</strong></div>
                <div>Delivery Success: <strong>99.98% • Latency 4.2ms</strong></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#002244]">Indosat Ooredoo Direct SMPP</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVE</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>Host: <strong>smpp.indosatooredoo.com:3300</strong></div>
                <div>System ID: <strong>PERMATA_ISAT_GATEWAY</strong></div>
                <div>Throughput: <strong>850 SMS/s</strong></div>
                <div>Delivery Success: <strong>99.91% • Latency 8.8ms</strong></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#002244]">XL Axiata Direct SMPP</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVE</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>Host: <strong>smpp.xl.co.id:2775</strong></div>
                <div>System ID: <strong>PERMATA_XL_PRI</strong></div>
                <div>Throughput: <strong>600 SMS/s</strong></div>
                <div>Delivery Success: <strong>99.85% • Latency 11.4ms</strong></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#002244]">Smartfren Telecom (Gateway Hub)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">ACTIVE</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>Host: <strong>smpp.smartfren.com:2775</strong></div>
                <div>System ID: <strong>PERMATA_SMART_HUB</strong></div>
                <div>Throughput: <strong>250 SMS/s</strong></div>
                <div>Delivery Success: <strong>99.78% • Latency 14.9ms</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 3: SENDER ID MASKING REGISTRY */}
      {/* ============================================================= */}
      {subScreen === 'masking' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">SMS Masking Sender ID Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Kominfo &amp; Telco whitelisted alphanumeric sender identifiers.
              </p>
            </div>
            <button
              onClick={() => showToast('Opening new Masking Sender ID registration modal...', 'info')}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Register New Sender ID</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3">Masking Identifier</th>
                  <th className="px-4 py-3">Service Category</th>
                  <th className="px-4 py-3">Telco Routing Coverage</th>
                  <th className="px-4 py-3">Kominfo Registration</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[#0F172A]">
                {maskingList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-[#0066FF] text-sm">
                      {m.id}
                    </td>
                    <td className="px-4 py-3.5 font-medium">{m.type}</td>
                    <td className="px-4 py-3.5 text-slate-600">{m.telco}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">{m.regNo}</td>
                    <td className="px-4 py-3.5 text-right">
                      {m.status === 'WHITELISTED' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> WHITELISTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px] inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> IN REVIEW
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN 4: PREPAID QUOTA & CDR LOGS */}
      {/* ============================================================= */}
      {subScreen === 'quota' && (
        <div className="p-4 md:p-8 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#002244]">Prepaid SMS Quota &amp; Call Detail Records (CDR)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Financial burn rate, remaining carrier credit pool, and CDR dispatch reconciliation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Remaining Credit Pool</span>
                <div className="text-xl font-bold font-mono text-[#002244] mt-1">IDR 412,800,000</div>
                <div className="w-full bg-slate-200 h-2 rounded mt-2 overflow-hidden">
                  <div className="bg-[#0066FF] h-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">68% of Monthly Allocated Budget</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Estimated Runway</span>
                <div className="text-xl font-bold text-emerald-600 mt-1">4.2 Days at Peak TPS</div>
                <span className="text-[11px] text-slate-500 mt-1 block">Auto-top up scheduled on threshold</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Dispatched Today</span>
                <div className="text-xl font-bold font-mono text-[#002244] mt-1">1,396,420 SMS</div>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">99.94% Delivered Within SLA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
