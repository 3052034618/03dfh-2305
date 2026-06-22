import { KeyInput } from '../types';
import { Keyboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface KeyInputSectionProps {
  inputs: KeyInput[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function KeyInputSection({ inputs, values, onChange }: KeyInputSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (input: KeyInput, value: string) => {
    onChange(input.id, value);

    if (input.validator?.pattern && value) {
      const regex = new RegExp(input.validator.pattern);
      if (!regex.test(value)) {
        setErrors(prev => ({ ...prev, [input.id]: input.validator!.message }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[input.id];
          return newErrors;
        });
      }
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[input.id];
        return newErrors;
      });
    }
  };

  const isFilled = (input: KeyInput) => {
    return values[input.id]?.trim()?.length > 0;
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Keyboard className="w-4 h-4" />
        关键信息录入
        <span className="text-xs text-red-500 font-normal">* 为必填项</span>
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {inputs.map(input => {
          const filled = isFilled(input);
          const hasError = errors[input.id];
          
          return (
            <div key={input.id} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                {input.type === 'select' ? (
                  <select
                    value={values[input.id] || ''}
                    onChange={e => handleChange(input, e.target.value)}
                    className={`select-field pr-10 ${
                      hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''
                    } ${filled && !hasError ? 'border-green-400' : ''}`}
                  >
                    <option value="">请选择</option>
                    {input.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    value={values[input.id] || ''}
                    onChange={e => handleChange(input, e.target.value)}
                    className={`input-field pr-10 ${
                      hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : ''
                    } ${filled && !hasError ? 'border-green-400' : ''}`}
                  />
                )}
                {filled && !hasError && (
                  <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {hasError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors[input.id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
