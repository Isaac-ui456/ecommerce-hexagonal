import { useEffect } from 'react';

const stylesByType = {
  success: 'bg-white border-green-200 text-green-800',
  error: 'bg-white border-red-200 text-red-800',
  info: 'bg-white border-blue-200 text-blue-800',
};

const dotByType = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slideInRight">
      <div className={`flex items-center gap-3 border rounded-xl shadow-lg px-4 py-3 min-w-[280px] max-w-sm ${stylesByType[type]}`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotByType[type]}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm leading-none">
          ✕
        </button>
      </div>
    </div>
  );
}
