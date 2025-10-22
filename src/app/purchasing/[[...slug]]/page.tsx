'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function PurchasingPage() {
  // Purchasing only has root page, so always load root
  return <ServiceFrame url={`http://localhost:6870/`} serviceName="Purchasing Service" />;
}
