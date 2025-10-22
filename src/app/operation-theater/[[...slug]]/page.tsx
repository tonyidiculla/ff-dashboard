'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function OperationTheaterPage() {
  const pathname = usePathname();
  // Keep the full path including /operation-theater since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6833${pathname}`} serviceName="Operation Theater Service" />;
}
