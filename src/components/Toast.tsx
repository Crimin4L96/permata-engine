import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full">
      {toasts.map((toast) => {
        let bgStyle = 'bg-[#001B3A] text-white border-white/20';
        let icon = 'info';

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-600 text-white border-emerald-400/30';
          icon = 'check_circle';
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-600 text-white border-amber-400/30';
          icon = 'warning';
        } else if (toast.type === 'error') {
          bgStyle = 'bg-red-600 text-white border-red-400/30';
          icon = 'error';
        }

        return (
          <div
            key={toast.id}
            className={`p-3.5 px-4 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 pointer-events-auto border animate-in slide-in-from-bottom-3 duration-200 ${bgStyle}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 opacity-80 hover:opacity-100 cursor-pointer text-xs"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
