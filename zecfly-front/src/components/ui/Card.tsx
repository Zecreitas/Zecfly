import { CardProps } from '../../types';

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}; 