'use client';

import React from 'react';
import { FurfieldHeader } from './FurfieldHeader';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Don't show guest user during initial load
  if (loading) {
    return (
      <FurfieldHeader
        userName=""
        userRole=""
        loading={true}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <FurfieldHeader
      userName={user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
      userRole={user?.role || 'Guest'}
      onLogout={handleLogout}
    />
  );
};
