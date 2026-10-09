import React, { useState, useRef, useEffect } from 'react';
import { Role, ActiveEngine } from '../types';

interface HeaderProps {
  activeEngine: ActiveEngine;
  setActiveEngine: (engine: ActiveEngine) => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  toggleMobileSidebar: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeEngine,
  setActiveEngine,
  currentRole,
  setCurrentRole,
  toggleMobileSidebar,
  showToast,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setCurrentRole(newRole);
    setIsDropdownOpen(false);
    showToast(`Switched active persona to ${newRole}`, 'info');
  };

  const getRoleDisplayName = (role: Role) => {
    if (role === 'Admin') return 'Super Admin';
    if (role === 'Maker') return 'Maker';
    return 'Checker';
  };

  const navItems: { id: ActiveEngine; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'notification', label: 'Notification Engine', icon: 'notifications' },
    { id: 'sms', label: 'SMS Engine', icon: 'sms' },
    { id: 'whatsapp', label: 'WhatsApp Engine', icon: 'chat' },
  ];

  return (
    <>
      {/* Top Global Header (64px fixed) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#001B3A] z-50 flex items-center justify-between px-3 sm:px-6 shadow-[0_2px_12px_rgba(0,18,48,0.22)] border-b border-[#002D5C]">
        {/* Kiri: Mobile Drawer Toggle & Logo Permata Engine */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <button
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            onClick={toggleMobileSidebar}
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none"
            onClick={() => setActiveEngine('home')}
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <svg className="w-5 h-5 drop-shadow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 12l10 10 10-10L12 2zm0 3.5L18.5 12 12 18.5 5.5 12 12 5.5z" fill="#0066FF" />
              </svg>
            </div>
            <span className="text-white font-bold tracking-tight text-base sm:text-lg lg:text-xl whitespace-nowrap">
              Permata Engine
            </span>
          </div>
        </div>

        {/* Tengah: Navigasi Menu 4 Item Utama (Tampil di Desktop & Tablet) */}
        <nav className="hidden md:flex items-center p-1 rounded-xl bg-white/5 gap-1 border border-white/10 max-w-full overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeEngine === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveEngine(item.id)}
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-1.5 rounded-lg text-xs lg:text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] lg:text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Kanan: Flag PROD & User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Environment Flag */}
          <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PROD</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer select-none text-left focus:outline-none"
              type="button"
              aria-expanded={isDropdownOpen}
            >
              <div className="flex flex-col text-left">
                <span className="text-white text-xs sm:text-[13px] leading-tight font-semibold">Ahmad Arif</span>
                <span className="text-blue-200 text-[10px] sm:text-[11px] leading-tight flex items-center gap-1 font-medium">
                  {getRoleDisplayName(currentRole)}
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-slate-300 text-sm transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {/* User Dropdown Menu Panel */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in text-[#0F172A]">
                <div className="px-4 pb-2.5 border-b border-slate-100 flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">Ahmad Arif</span>
                  <span className="text-xs text-slate-500 font-mono">ahmad.arif@permatabank.co.id</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">ID: 88492019 • SecOps Core</span>
                </div>

                {/* Role Switcher */}
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold block mb-1.5">
                    Simulate Role Access
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleRoleChange('Admin')}
                      className={`py-1 rounded text-center text-xs font-bold transition-all ${
                        currentRole === 'Admin'
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('Maker')}
                      className={`py-1 rounded text-center text-xs font-bold transition-all ${
                        currentRole === 'Maker'
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Maker
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange('Checker')}
                      className={`py-1 rounded text-center text-xs font-bold transition-all ${
                        currentRole === 'Checker'
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Checker
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 italic">
                    {currentRole === 'Admin' && 'Full Administrator with User Control & Matrix access.'}
                    {currentRole === 'Maker' && 'Author mode: Submit payload edits for Maker-Checker review.'}
                    {currentRole === 'Checker' && 'Supervisor mode: Verify & approve/reject pending payloads.'}
                  </p>
                </div>

                {/* Quick Navigation in Dropdown */}
                <div className="px-4 py-2 text-xs border-b border-slate-100 flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Direct Engine Switch
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {navItems.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setActiveEngine(n.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-left text-xs font-semibold flex items-center gap-1.5 ${
                          activeEngine === n.id
                            ? 'bg-[#EBF3FF] text-[#0066FF]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">{n.icon}</span>
                        <span className="truncate">{n.label.replace(' Engine', '')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SSO Session Info */}
                <div className="px-4 py-2 text-xs border-b border-slate-100 flex flex-col gap-1 text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>SSO Permata ID:</span>
                    <span className="font-mono text-[#001B3A] font-semibold">S-82910-JKT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session Expiry:</span>
                    <span className="font-mono text-[#001B3A]">07:42:19 WIB</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-2 pt-2 flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      showToast('Session refreshed securely', 'success');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors text-left w-full"
                  >
                    <span className="material-symbols-outlined text-base">refresh</span>
                    <span>Renew SSO Token</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      showToast('Demo: Signed out session successfully', 'info');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors text-left w-full"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    <span>Sign Out Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bar Navigasi 4 Menu Khusus Mobile / Layar Kecil (< md) */}
      <div className="md:hidden fixed top-16 left-0 right-0 h-11 bg-[#001529] z-40 border-b border-white/10 px-2 flex items-center justify-between gap-1 overflow-x-auto shadow-sm">
        {navItems.map((item) => {
          const isActive = activeEngine === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveEngine(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
