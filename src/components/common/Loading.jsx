import React from 'react';

const Loading = () => (
  <div className="flex items-center justify-center min-h-[120px] w-full">
    <span className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
    <span className="ml-4 text-primary font-medium text-lg">Carregando...</span>
  </div>
);

export default Loading;
