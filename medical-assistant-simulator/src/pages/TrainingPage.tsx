import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { cases } from '../data/cases';
import { Play, ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, XCircle, Clock, UserCircle, ClipboardList, Scissors, FileText, BookOpen, Package, ShieldCheck, Hand } from 'lucide-react';
import { CommandModal } from '../components/CommandModal';
import { RiskAlert } from '../components/RiskAlert';
import { KeyInputSection } from '../components/KeyInputSection';

const categoryIcons: Record<string, any> = {
  identity: UserCircle,
  preparation: Package,
  asepsis: ShieldCheck,
  delivery: Hand,
  recording: FileText,
  education: BookOpen
};

const categoryLabels: Record<string, string> = {
  identity: '身份确认',
  preparation: '物品准备',
  asepsis: '无菌操作',
  delivery: '器械传递',
  recording: '手术记录',
  education: '术后宣教'
};

export function TrainingPage() {
  const {
    selectedCase,
    setSelectedCase,
    trainingPhase,
    setTrainingPhase,
    currentStepIndex,
    setCurrentStepIndex,
    nextStep,
    prevStep,
    trainingErrors,
    keyInputValues,
    addTrainingError,
    setKeyInputValue,
    setStartTime,
    resetTraining,
    showCommand,
    currentCommand,
    showCommandModal,
    hideCommandModal,
    commandStartTime,
    setCommandStartTime,
    addCommandResponse,
    setView,
    generateRecord,
    saveRecord,
    currentStudent
  } = useAppStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [showActionChoice, setShowActionChoice] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'wrong'; message: string; risk?: string } | null>(null);
  const [commandQueue, setCommandQueue] = useState<any[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<Set<string>>(new Set());
  const [commandTriggered, setCommandTriggered] = useState(false);
  const [commandCompleted, setCommandCompleted] = useState(false);

  const currentCase = selectedCase;

  useEffect(() => {
    if (!currentCase) {
      const firstCase = cases[0];
      setSelectedCase(firstCase);
    }
  }, [currentCase, setSelectedCase]);

  const currentStep = currentCase?.steps[currentStepIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (trainingPhase === 'running') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [trainingPhase]);

  const startTraining = useCallback(() => {
    setTrainingPhase('running');
    setStartTime(Date.now());
    setElapsedTime(0);
    setStepsCompleted(new Set());
    setCommandTriggered(false);
    setCommandCompleted(false);
    setCommandQueue([]);
    setCurrentCommandIndex(0);
    setSelectedAction(null);
  }, [setTrainingPhase, setStartTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActionSelect = (action: string, isWrong: boolean, wrongAction?: any) => {
    setSelectedAction(action);
    setShowActionChoice(false);

    if (currentStep) {
      setStepsCompleted(prev => new Set(prev).add(currentStep.id));
    }

    if (isWrong && wrongAction) {
      const error: any = {
        id: `e-${Date.now()}`,
        stepId: currentStep?.id,
        stepName: currentStep?.name,
        errorType: wrongAction.action.includes('核对') ? 'missing_check' : 
                   wrongAction.action.includes('记录') ? 'incomplete_record' :
                   wrongAction.action.includes('过期') || wrongAction.action.includes('污染') ? 'wrong_item' : 'timing_error',
        description: wrongAction.action,
        riskLevel: wrongAction.riskLevel,
        deduction: wrongAction.deduction,
        timestamp: elapsedTime,
        userAction: action,
        correctAction: currentStep?.correctActions[0]
      };
      addTrainingError(error);

      setShowFeedback({
        type: 'wrong',
        message: '操作错误！',
        risk: wrongAction.risk
      });

      setTimeout(() => setShowFeedback(null), 3000);
    } else {
      setShowFeedback({
        type: 'correct',
        message: '操作正确！'
      });
      setTimeout(() => setShowFeedback(null), 1500);
    }
  };

  const handleNextStep = () => {
    if (!currentStep) return;

    if (!stepsCompleted.has(currentStep.id)) {
      setShowFeedback({
        type: 'wrong',
        message: '请先选择操作！',
        risk: '每一步都需要至少执行一次操作才能进入下一步'
      });
      setTimeout(() => setShowFeedback(null), 2500);
      return;
    }

    const remainingCommands = commandQueue.length - currentCommandIndex;
    if (commandQueue.length > 0 && remainingCommands > 0 && !showCommand) {
      setShowFeedback({
        type: 'wrong',
        message: '还有口令未完成！',
        risk: `本步骤还有 ${remainingCommands} 条医生口令需要响应`
      });
      setTimeout(() => setShowFeedback(null), 2500);
      return;
    }

    const missingInputs = currentStep.keyInputs?.filter(
      input => input.required && !keyInputValues[input.id]
    );

    if (missingInputs && missingInputs.length > 0) {
      const error: any = {
        id: `e-${Date.now()}`,
        stepId: currentStep.id,
        stepName: currentStep.name,
        errorType: 'incomplete_record',
        description: `未填写: ${missingInputs.map(i => i.label).join(', ')}`,
        riskLevel: 'medium',
        deduction: 10,
        timestamp: elapsedTime
      };
      addTrainingError(error);
      
      setShowFeedback({
        type: 'wrong',
        message: '关键信息未填写完整！',
        risk: '医疗文书不完整可能影响后续诊疗'
      });
      setTimeout(() => setShowFeedback(null), 3000);
      return;
    }

    if (currentStepIndex === currentCase!.steps.length - 1) {
      finishTraining();
    } else {
      nextStep();
      setSelectedAction(null);
      setCurrentCommandIndex(0);
      setCommandTriggered(false);
      setCommandCompleted(false);
    }
  };

  const triggerNextCommand = useCallback(() => {
    if (commandQueue.length > 0 && currentCommandIndex < commandQueue.length) {
      const cmd = commandQueue[currentCommandIndex];
      showCommandModal(cmd);
      setCurrentCommandIndex(prev => prev + 1);
      setCommandCompleted(false);
    }
  }, [commandQueue, currentCommandIndex, showCommandModal]);

  const handleCommandResponse = (optionId: string, reactionTime: number) => {
    if (!currentCommand) return;

    const selectedOption = currentCommand.options.find(o => o.id === optionId);
    
    const response = {
      commandId: currentCommand.id,
      commandContent: currentCommand.content,
      selectedOption: selectedOption?.text || '',
      isCorrect: selectedOption?.isCorrect || false,
      reactionTime,
      timeLimit: currentCommand.timeLimit
    };

    addCommandResponse(response);

    if (!selectedOption?.isCorrect) {
      const error: any = {
        id: `e-${Date.now()}`,
        stepId: currentCommand.stepId,
        stepName: currentStep?.name || '口令响应',
        errorType: 'timing_error',
        description: `错误响应: ${currentCommand.content}`,
        riskLevel: currentCommand.riskLevel,
        deduction: 8,
        timestamp: elapsedTime,
        userAction: selectedOption?.text,
        correctAction: currentCommand.correctAction
      };
      addTrainingError(error);
    }

    hideCommandModal();
    setCommandCompleted(true);
  };

  const handleCommandTimeout = () => {
    if (!currentCommand) return;

    const response = {
      commandId: currentCommand.id,
      commandContent: currentCommand.content,
      selectedOption: '超时未响应',
      isCorrect: false,
      reactionTime: currentCommand.timeLimit,
      timeLimit: currentCommand.timeLimit
    };

    addCommandResponse(response);

    const error: any = {
      id: `e-${Date.now()}`,
      stepId: currentCommand.stepId,
      stepName: currentStep?.name || '口令响应',
      errorType: 'timing_error',
      description: `响应超时: ${currentCommand.content}`,
      riskLevel: currentCommand.riskLevel,
      deduction: 10,
      timestamp: elapsedTime
    };
    addTrainingError(error);

    hideCommandModal();
    setCommandCompleted(true);
  };

  useEffect(() => {
    if (commandCompleted && currentCommandIndex < commandQueue.length) {
      const timer = setTimeout(() => {
        triggerNextCommand();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [commandCompleted, currentCommandIndex, commandQueue.length, triggerNextCommand]);

  const finishTraining = () => {
    setTrainingPhase('completed');
    const record = generateRecord();
    saveRecord(record);
    
    if (window.electronAPI) {
      window.electronAPI.saveRecord(record);
    }
  };

  const goToResults = () => {
    setView('records');
    resetTraining();
  };

  useEffect(() => {
    if (trainingPhase === 'running' && currentStep && !commandTriggered) {
      const stepCommands = currentCase?.commands.filter(c => c.stepId === currentStep.id) || [];
      setCommandQueue(stepCommands);
      setCurrentCommandIndex(0);
      setCommandTriggered(true);

      if (stepCommands.length > 0) {
        const delay = Math.random() * 2000 + 1000;
        const timer = setTimeout(() => {
          triggerNextCommand();
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStepIndex, trainingPhase, currentStep, currentCase, commandTriggered, triggerNextCommand]);

  if (!currentCase || !currentStep) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="card text-center">
          <p className="text-gray-500 mb-4">请先选择一个训练案例</p>
          <button onClick={() => setView('case-select')} className="btn-primary">
            去选择案例
          </button>
        </div>
      </div>
    );
  }

  if (trainingPhase === 'preparing') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card text-center py-12">
          <div className="w-24 h-24 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-12 h-12 text-medical-600 ml-1" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentCase.name}</h2>
          <p className="text-gray-500 mb-8">{currentCase.description}</p>
          
          <div className="grid grid-cols-3 gap-6 mb-8 max-w-lg mx-auto">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-medical-600">{currentCase.steps.length}</p>
              <p className="text-sm text-gray-500">训练步骤</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-600">{currentCase.commands.length}</p>
              <p className="text-sm text-gray-500">医生口令</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-yellow-600">{currentCase.duration}</p>
              <p className="text-sm text-gray-500">预计时长(分钟)</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8 max-w-lg mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-medium text-yellow-800 mb-1">训练须知</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• 请集中注意力，医生口令会在任意时刻出现</li>
                  <li>• 口令响应有时间限制，请快速做出正确选择</li>
                  <li>• 关键信息需要准确输入，如药品批号、剂量等</li>
                  <li>• 操作失误会实时提示风险并扣分</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => setView('case-select')} className="btn-secondary">
              返回选择
            </button>
            <button onClick={startTraining} className="btn-primary text-lg px-8 py-3">
              开始训练
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (trainingPhase === 'completed') {
    const record = generateRecord();
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card text-center py-12">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            record.totalScore >= 80 ? 'bg-green-100' : record.totalScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {record.totalScore >= 80 ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : record.totalScore >= 60 ? (
              <AlertTriangle className="w-12 h-12 text-yellow-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">训练完成！</h2>
          <p className="text-gray-500 mb-6">{currentCase.name}</p>

          <div className="text-6xl font-bold mb-8">
            <span className={record.totalScore >= 80 ? 'text-green-600' : record.totalScore >= 60 ? 'text-yellow-600' : 'text-red-600'}>
              {record.totalScore}
            </span>
            <span className="text-2xl text-gray-400">/100</span>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-600">{record.scores.procedureFamiliarity}</p>
              <p className="text-sm text-gray-500">流程熟悉度</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">{record.scores.reactionSpeed}</p>
              <p className="text-sm text-gray-500">反应速度</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-yellow-600">{record.scores.riskAwareness}</p>
              <p className="text-sm text-gray-500">风险意识</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-600">{record.scores.communicationEtiquette}</p>
              <p className="text-sm text-gray-500">沟通礼仪</p>
            </div>
          </div>

          {record.weakPoints.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="font-medium text-red-800 mb-2">需要加强的薄弱环节：</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {record.weakPoints.map((wp, i) => (
                  <span key={i} className="badge bg-red-100 text-red-700">{wp}</span>
                ))}
              </div>
            </div>
          )}

          {record.errors.length > 0 && (
            <div className="mb-8">
              <p className="font-medium text-gray-700 mb-3">本次训练错误 ({record.errors.length}次)</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {record.errors.map((error, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 text-left">
                    <span className={`badge badge-risk-${error.riskLevel} flex-shrink-0`}>
                      {error.riskLevel === 'high' ? '高风险' : error.riskLevel === 'medium' ? '中风险' : '低风险'}
                    </span>
                    <span className="text-sm text-gray-700">{error.description}</span>
                    <span className="text-xs text-red-500 ml-auto">-{error.deduction}分</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button onClick={() => { resetTraining(); setView('case-select'); }} className="btn-secondary">
              选择其他案例
            </button>
            <button onClick={goToResults} className="btn-primary">
              查看完整报告
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentStepIndex + 1) / currentCase.steps.length) * 100;
  const CategoryIcon = categoryIcons[currentStep.category] || ClipboardList;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">{currentCase.name}</h2>
            <span className="badge bg-medical-100 text-medical-700">
              步骤 {currentStepIndex + 1}/{currentCase.steps.length}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-mono text-lg font-bold text-gray-700">{formatTime(elapsedTime)}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 mb-4">训练步骤</h3>
            <div className="space-y-1">
              {currentCase.steps.map((step, index) => {
                const StepIcon = categoryIcons[step.category] || ClipboardList;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step.id}>
                    <button
                      onClick={() => index <= currentStepIndex && setCurrentStepIndex(index)}
                      disabled={index > currentStepIndex}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                        isActive
                          ? 'bg-medical-600 text-white shadow-md'
                          : isCompleted
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-white/20' : isCompleted ? 'bg-medical-100' : 'bg-gray-200'
                      }`}>
                        <StepIcon className={`w-4 h-4 ${
                          isActive ? 'text-white' : isCompleted ? 'text-medical-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className="text-sm font-medium flex-1">{step.name}</span>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-medical-600" />}
                    </button>
                    {index < currentCase.steps.length - 1 && (
                      <div className={`step-connector ${isCompleted ? 'step-connector-active' : ''}`}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">错误记录</h3>
            {trainingErrors.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">暂无错误</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trainingErrors.slice(-5).reverse().map((error, i) => (
                  <div key={i} className="bg-red-50 rounded-lg p-2 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge badge-risk-${error.riskLevel}`}>
                        {error.riskLevel === 'high' ? '高' : error.riskLevel === 'medium' ? '中' : '低'}
                      </span>
                      <span className="text-gray-600">{error.stepName}</span>
                    </div>
                    <p className="text-red-600">{error.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-medical-100 flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-medical-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-800">{currentStep.name}</h3>
                  <span className="badge bg-gray-100 text-gray-600">{categoryLabels[currentStep.category]}</span>
                </div>
                <p className="text-sm text-gray-500">{currentStep.description}</p>
              </div>
            </div>

            {currentStep.requiredItems && currentStep.requiredItems.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  所需物品
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentStep.requiredItems.map((item, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                操作选择
              </h4>
              
              {!showActionChoice && !selectedAction ? (
                <button
                  onClick={() => setShowActionChoice(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 hover:border-medical-400 hover:text-medical-600 transition-colors"
                >
                  <p>点击选择你要执行的操作</p>
                </button>
              ) : showActionChoice ? (
                <div className="space-y-3 animate-slide-up">
                  <p className="text-sm text-gray-600 mb-2">请选择你将执行的操作：</p>
                  {currentStep.correctActions.map((action, i) => (
                    <button
                      key={`correct-${i}`}
                      onClick={() => handleActionSelect(action, false)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{action}</span>
                      </div>
                    </button>
                  ))}
                  {currentStep.wrongActions.map((wrong, i) => (
                    <button
                      key={`wrong-${i}`}
                      onClick={() => handleActionSelect(wrong.action, true, wrong)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-gray-300" />
                        <span>{wrong.action}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`p-4 rounded-xl ${
                  showFeedback?.type === 'correct' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {showFeedback?.type === 'correct' ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        showFeedback?.type === 'correct' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {selectedAction}
                      </p>
                      {showFeedback?.risk && (
                        <p className="text-sm text-red-600 mt-1">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          {showFeedback.risk}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentStep.keyInputs && currentStep.keyInputs.length > 0 && (
              <KeyInputSection
                inputs={currentStep.keyInputs}
                values={keyInputValues}
                onChange={setKeyInputValue}
              />
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                上一步
              </button>
              <button onClick={handleNextStep} className="btn-primary flex items-center gap-2">
                {currentStepIndex === currentCase.steps.length - 1 ? '完成训练' : '下一步'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-medical-600" />
              操作规范提示
            </h3>
            <div className="space-y-3">
              {currentStep.correctActions.map((action, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {currentStep.wrongActions && currentStep.wrongActions.length > 0 && (
            <div className="card p-4 mt-4 bg-red-50/50">
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                常见错误警示
              </h3>
              <div className="space-y-3">
                {currentStep.wrongActions.map((wrong, i) => (
                  <div key={i} className="bg-white rounded-lg p-3">
                    <div className="flex items-start gap-2 text-sm mb-1">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{wrong.action}</span>
                    </div>
                    <p className="text-xs text-red-600 ml-6">风险：{wrong.risk}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">口令倒计时</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-medical-600 mb-1">
                {commandQueue.length > 0 ? commandQueue.length - currentCommandIndex : 0}
              </div>
              <p className="text-xs text-gray-500">剩余口令数</p>
            </div>
          </div>
        </div>
      </div>

      {showCommand && currentCommand && (
        <CommandModal
          command={currentCommand}
          startTime={commandStartTime}
          onResponse={handleCommandResponse}
          onTimeout={handleCommandTimeout}
        />
      )}

      {showFeedback && (
        <RiskAlert
          type={showFeedback.type}
          message={showFeedback.message}
          risk={showFeedback.risk}
        />
      )}
    </div>
  );
}
