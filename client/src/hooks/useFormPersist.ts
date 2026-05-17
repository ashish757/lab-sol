import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

export interface UseFormPersistOptions {
  key: string;
}

export function useFormPersist<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: UseFormPersistOptions
) {
  const { getValues, reset } = form;
  const { key } = options;

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed as any);
      } catch (err) {
        console.error("Failed to parse saved draft", err);
      }
    }
  }, [key, reset]);

  const saveDraft = () => {
    const values = getValues();
    localStorage.setItem(key, JSON.stringify(values));
  };

  const clearStorage = () => {
    localStorage.removeItem(key);
  };

  return { saveDraft, clearStorage };
}
