'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function HRPage() {
  // HRMS only has root page, so always load root
  return <ServiceFrame url={`http://localhost:6860/`} serviceName="HR Service" />;
}
