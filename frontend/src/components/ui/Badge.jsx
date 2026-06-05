export const Badge = ({ text, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };
  const sizes = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  return (
    <div className={`badge ${variants[variant]} ${sizes[size]}`}>
      {text}
    </div>
  );
};
