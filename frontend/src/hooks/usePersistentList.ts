import { useEffect, useState } from 'react';

const readStoredList = <T,>(storageKey: string): T[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? (parsedValue as T[]) : [];
  } catch {
    return [];
  }
};

export const usePersistentList = <T,>(storageKey: string) => {
  const [items, setItems] = useState<T[]>(() => readStoredList<T>(storageKey));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  return [items, setItems] as const;
};
