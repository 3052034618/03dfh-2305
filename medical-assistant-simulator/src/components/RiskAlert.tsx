import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

interface RiskAlertProps {
  type: 'correct' | 'wrong';
  message: string;
  risk?: string;
  duration?: number;
}

export function RiskAlert({ type, message, risk, duration = 3000 }: RiskAlertProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 max-w-md z-50 animate-slide-up ${
        exiting ? 'opacity-0 translate-y-4' : ''
      } transition-all duration-300`}
    >
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        type === 'correct'
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
      }`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              type === 'correct' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {type === 'correct' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                type === 'correct' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
              {risk && (
                <p className="text-sm text-red-600 mt-1">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  {risk}
                </p>
              )}
            </div>
            <button
              onClick={() => { setExiting(true); setTimeout(() => setVisible(false), 300); }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className={`h-1 ${type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`} style={{
          animation: `shrink ${duration}ms linear forwards`
        }}></div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
