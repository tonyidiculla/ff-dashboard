'use client';

import { ServiceFrame } from '@/components/ServiceFrame';
import { usePathname } from 'next/navigation';

export default function RosteringPage() {
  // Rostering only has root page, so always load root
  return <ServiceFrame url={`http://localhost:6840/`} serviceName="Rostering Service" />;
}
