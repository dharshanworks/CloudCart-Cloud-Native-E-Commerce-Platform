/**
 * CustomButton Component
 * Reusable button with DaisyUI styling
 * Supports loading states, variants, and disabled state
 */
export const CustomButton = ({
  children,
  type = 'button',
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'btn-primary',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`btn ${variant} ${className} ${
        isLoading ? 'loading' : ''
      }`}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
