'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function OutpatientPage() {
  const pathname = usePathname();
  // Keep the full path including /outpatient since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6830${pathname}`} serviceName="Outpatient Service" />;
}
