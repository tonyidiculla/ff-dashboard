'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: 'Outpatient',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    children: [
      { name: 'Appointments', href: '/core/appointments' },
      { name: 'Consultations', href: '/core/consultations' },
      { name: 'Billing', href: '/core/billing' },
    ],
  },
  {
    name: 'Inpatient',
    href: '/inpatient',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    children: [
      { name: 'Admissions', href: '/inpatient/admissions' },
      { name: 'Ward Management', href: '/inpatient/wards' },
    ],
  },
  {
    name: 'Operation Theater',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    children: [
      { name: 'Surgery Schedule', href: '/operation-theater/schedule' },
    ],
  },
  {
    name: 'Pharmacy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    children: [
      { name: 'Inventory', href: '/pharmacy/inventory' },
    ],
  },
  {
    name: 'Diagnostics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    children: [
      { name: 'Lab Tests', href: '/diagnostics/lab' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['Outpatient']);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-64 bg-white shadow-2xl border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image 
            src="/Furfield-icon.png" 
            alt="Furfield Logo" 
            width={48} 
            height={48}
            className="rounded-lg"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">FURFIELD</h1>
            <p className="text-xs text-gray-600 mt-0.5">HMS</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const isExpanded = expandedItems.includes(item.name);
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.name}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    'hover:bg-blue-50 hover:text-blue-700'
                  )}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.name}
                  </span>
                  <svg
                    className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-90')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'hover:bg-blue-50 hover:text-blue-700 text-gray-700'
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
              
              {hasChildren && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children!.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2.5 rounded-lg text-sm transition-all',
                          isChildActive
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        )}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
