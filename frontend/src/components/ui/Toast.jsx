import { useEffect, useState } from 'react';

export const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!show) return null;

  const alertClass = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info',
  }[type];

  return (
    <div className={`alert border border-base-300 ${alertClass} shadow-lg fixed bottom-4 right-4 z-50 max-w-md`}>
      <span>{message}</span>
    </div>
  );
};
