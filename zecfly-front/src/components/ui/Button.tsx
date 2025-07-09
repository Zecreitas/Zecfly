import { ButtonProps } from '../../types';

const buttonStyles = {
  primary: 'bg-primary text-white hover:bg-blue-700',
  secondary: 'bg-secondary text-white hover:bg-teal-700',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
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
  const baseStyles = 'rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${buttonStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}; 