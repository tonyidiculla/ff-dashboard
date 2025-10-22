'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function DiagnosticsPage() {
  const pathname = usePathname();
  // Keep the full path including /diagnostics since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6832${pathname}`} serviceName="Diagnostics Service" />;
}
