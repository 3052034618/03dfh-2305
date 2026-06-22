import { useState, useEffect } from 'react';
import { MessageSquare, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DoctorCommand } from '../types';

interface CommandModalProps {
  command: DoctorCommand;
  startTime: number;
  onResponse: (optionId: string, reactionTime: number) => void;
  onTimeout: () => void;
}

export function CommandModal({ command, startTime, onResponse, onTimeout }: CommandModalProps) {
  const [timeLeft, setTimeLeft] = useState(command.timeLimit);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, command.timeLimit - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0 && !showResult) {
        onTimeout();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [command.timeLimit, startTime, onTimeout, showResult]);

  const handleSelect = (optionId: string) => {
    if (selectedOption || showResult) return;
    
    setSelectedOption(optionId);
    setShowResult(true);
    
    const reactionTime = (Date.now() - startTime) / 1000;
    
    setTimeout(() => {
      onResponse(optionId, reactionTime);
    }, 2000);
  };

  const progress = (timeLeft / command.timeLimit) * 100;
  const isUrgent = timeLeft < command.timeLimit * 0.3;

  const getTimerColor = () => {
    if (isUrgent) return '#ef4444';
    if (timeLeft < command.timeLimit * 0.6) return '#f59e0b';
    return '#14b8a6';
  };

  const selectedOptionData = selectedOption ? command.options.find(o => o.id === selectedOption) : null;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content command-pulse border-4 border-red-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">医生口令</h3>
                <p className="text-sm text-gray-500">请在限定时间内做出正确响应</p>
              </div>
            </div>
            
            <div className="text-center">
              <div 
                className="timer-ring w-16 h-16"
                style={{
                  '--progress': `${progress}%`,
                  '--color': getTimerColor()
                } as React.CSSProperties}
              >
                <div className="timer-ring-inner">
                  <span className={`text-xl font-bold ${isUrgent ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                    {timeLeft.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">剩余秒数</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl mb-6 ${isUrgent ? 'bg-red-50' : 'bg-yellow-50'}`}>
            <p className="text-xl font-semibold text-gray-800 text-center">
              <span className="text-gray-400 mr-2">👨‍⚕️</span>
              "{command.content}"
            </p>
          </div>

          <div className="space-y-3">
            {command.options.map(option => {
              const isSelected = selectedOption === option.id;
              const showCorrect = showResult && option.isCorrect;
              const showWrong = showResult && isSelected && !option.isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50 animate-shake'
                      : isSelected
                      ? 'border-medical-500 bg-medical-50'
                      : 'border-gray-200 hover:border-medical-300 hover:bg-gray-50'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      showCorrect
                        ? 'bg-green-500 border-green-500'
                        : showWrong
                        ? 'bg-red-500 border-red-500'
                        : isSelected
                        ? 'bg-medical-500 border-medical-500'
                        : 'border-gray-300'
                    }`}>
                      {showCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                      {showWrong && <XCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        showCorrect ? 'text-green-700' : showWrong ? 'text-red-700' : 'text-gray-800'
                      }`}>
                        {option.text}
                      </p>
                      
                      {showResult && isSelected && (
                        <div className={`mt-2 p-3 rounded-lg ${
                          option.isCorrect ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <p className={`text-sm ${option.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {option.feedback}
                          </p>
                          {option.risk && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4" />
                              {option.risk}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {!showResult && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                风险等级：
                <span className={`ml-1 badge badge-risk-${command.riskLevel}`}>
                  {command.riskLevel === 'high' ? '高' : command.riskLevel === 'medium' ? '中' : '低'}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
