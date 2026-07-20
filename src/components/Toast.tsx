import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styleConfig = {
    success: {
      bg: 'bg-gray-900/95 border-emerald-500/40 text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-gray-900/95 border-red-500/40 text-red-400',
      iconBg: 'bg-red-500/20 text-red-400 border-red-500/40',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-gray-900/95 border-amber-500/40 text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-0 animate-slide-in ${styleConfig.bg}`}
    >
      <div className={`p-2 rounded-xl border flex-shrink-0 ${styleConfig.iconBg}`}>
        {styleConfig.icon}
      </div>

      <div className="flex-1 pt-0.5">
        <h4 className="text-sm font-bold text-white leading-tight">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-gray-300 mt-1 leading-snug">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
        aria-label="Close Toast"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
