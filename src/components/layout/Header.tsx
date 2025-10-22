'use client';

import React from 'react';
import { FurfieldHeader } from './FurfieldHeader';

export const Header: React.FC = () => {
  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'furfield_token=; Max-Age=0; path=/;';
    // Redirect to login
    window.location.href = 'http://localhost:6800/login';
  };

  return (
    <FurfieldHeader
      currentModule="hms"
      userName="Dr. Smith"
      userRole="Veterinarian"
      onLogout={handleLogout}
    />
  );
};
