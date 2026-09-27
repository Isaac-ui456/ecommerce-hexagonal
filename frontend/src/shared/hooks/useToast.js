import { useState, useCallback } from 'react';

/**
 * Hook simple para mostrar notificaciones tipo toast desde cualquier página.
 * Uso: const { toast, showToast, hideToast } = useToast();
 */
export function useToast() {
  const [toast, setToast] = useState({ message: null, type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: null }));
  }, []);

  return { toast, showToast, hideToast };
}
