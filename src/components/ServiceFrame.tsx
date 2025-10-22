'use client';

import { useEffect, useState } from 'react';

interface ServiceFrameProps {
  url: string;
  serviceName: string;
}

export const ServiceFrame: React.FC<ServiceFrameProps> = ({ url, serviceName }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative flex-1 w-full min-h-screen">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {serviceName}...</p>
          </div>
        </div>
      )}
      <iframe
        src={url}
        className="w-full h-full min-h-screen border-0"
        title={serviceName}
        onLoad={handleLoad}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
};
