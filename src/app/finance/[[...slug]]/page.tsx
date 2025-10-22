'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function FinancePage() {
  const pathname = usePathname();
  // Finance service doesn't have /finance base path
  // Remove /finance prefix when passing to service
  const servicePath = pathname.replace('/finance', '') || '/';
  
  return <ServiceFrame url={`http://localhost:6850${servicePath}`} serviceName="Finance Service" />;
}
