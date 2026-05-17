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
        // Silent error handling
      }
    }
  }, [key, reset]);

  useEffect(() => {
    const handleBlur = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA')
      ) {
        const values = getValues();
        localStorage.setItem(key, JSON.stringify(values));
      }
    };

    window.addEventListener('focusout', handleBlur);
    return () => {
      window.removeEventListener('focusout', handleBlur);
    };
  }, [key, getValues]);

  const clearStorage = () => {
    localStorage.removeItem(key);
  };

  return { clearStorage };
}
