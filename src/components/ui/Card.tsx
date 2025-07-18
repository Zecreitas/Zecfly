import { CardProps } from '../../types';

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-2xl shadow-soft border border-muted overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}; 