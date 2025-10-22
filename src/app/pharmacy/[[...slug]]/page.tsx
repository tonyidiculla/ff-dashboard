'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function PharmacyPage() {
  const pathname = usePathname();
  // Keep the full path including /pharmacy since that's where the pages are in the service
  
  return <ServiceFrame url={`http://localhost:6834${pathname}`} serviceName="Pharmacy Service" />;
}
