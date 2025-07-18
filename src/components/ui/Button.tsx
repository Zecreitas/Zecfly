import { ButtonProps } from '../../types';

const buttonStyles = {
  primary: 'bg-primary text-white shadow-soft hover:bg-primary/90 active:scale-95',
  secondary: 'bg-secondary text-white shadow-soft hover:bg-secondary/90 active:scale-95',
  outline: 'border border-muted text-dark bg-surface hover:bg-muted/60 active:scale-95',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 active:scale-95',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const baseStyles = 'rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed select-none';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${buttonStyles[variant]} ${sizeStyles[size]} ${className} flex items-center justify-center gap-2`}
    >
      {children}
    </button>
  );
}; 