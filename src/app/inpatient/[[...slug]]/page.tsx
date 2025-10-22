'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function InpatientPage() {
  const pathname = usePathname();
  // Keep the full path including /inpatient since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6831${pathname}`} serviceName="Inpatient Service" />;
}
