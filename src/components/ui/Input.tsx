import { InputProps } from '../../types';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  required = false
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark mb-2 select-none">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 border ${
          error ? 'border-error' : 'border-muted'
        } rounded-xl bg-muted/40 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-dark placeholder:text-dark/40 ${
          error ? 'focus:ring-error' : ''
        } ${className}`}
      />
      {error && (
        <p className="mt-1 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
}; 