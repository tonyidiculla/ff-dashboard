import { Service, ServiceCategory, ServiceStatus } from '@/types';

export const FURFIELD_SERVICES: Service[] = [
  {
    id: 'ff-auth-6800',
    name: 'Authentication Service',
    url: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:6800',
    port: 6800,
    status: ServiceStatus.CHECKING,
    description: 'Centralized authentication and user management',
    icon: '🔐',
    category: ServiceCategory.AUTHENTICATION,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-hosp-6830',
    name: 'Hospital Management',
    url: process.env.NEXT_PUBLIC_HOSP_SERVICE_URL || 'http://localhost:6830',
    port: 6830,
    status: ServiceStatus.CHECKING,
    description: 'Veterinary hospital and patient management system',
    icon: '🏥',
    category: ServiceCategory.HEALTHCARE,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-finm-6850',
    name: 'Financial Management',
    url: process.env.NEXT_PUBLIC_FINM_SERVICE_URL || 'http://localhost:6850',
    port: 6850,
    status: ServiceStatus.CHECKING,
    description: 'Financial operations and billing management',
    icon: '💰',
    category: ServiceCategory.FINANCIAL,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-hrms-6860',
    name: 'HR Management System',
    url: process.env.NEXT_PUBLIC_HRMS_SERVICE_URL || 'http://localhost:6860',
    port: 6860,
    status: ServiceStatus.CHECKING,
    description: 'Human resources and employee management',
    icon: '👥',
    category: ServiceCategory.HR,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-padm-6810',
    name: 'Patient Administration',
    url: process.env.NEXT_PUBLIC_PADM_SERVICE_URL || 'http://localhost:6811',
    port: 6811,
    status: ServiceStatus.CHECKING,
    description: 'Patient administration and records management',
    icon: '📋',
    category: ServiceCategory.HEALTHCARE,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-orgn-6820',
    name: 'Organization Service',
    url: process.env.NEXT_PUBLIC_ORGN_SERVICE_URL || 'http://localhost:6820',
    port: 6820,
    status: ServiceStatus.CHECKING,
    description: 'Organization structure and department management',
    icon: '🏢',
    category: ServiceCategory.MANAGEMENT,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-rost-6840',
    name: 'Roster Service',
    url: process.env.NEXT_PUBLIC_ROST_SERVICE_URL || 'http://localhost:6840',
    port: 6840,
    status: ServiceStatus.CHECKING,
    description: 'Staff scheduling and roster management',
    icon: '📅',
    category: ServiceCategory.MANAGEMENT,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-purc-6870',
    name: 'Purchasing Service',
    url: process.env.NEXT_PUBLIC_PURC_SERVICE_URL || 'http://localhost:6870',
    port: 6870,
    status: ServiceStatus.CHECKING,
    description: 'Procurement and inventory management',
    icon: '🛒',
    category: ServiceCategory.FINANCIAL,
    healthEndpoint: '/api/health',
  },
  {
    id: 'ff-docs-6899',
    name: 'Documentation Service',
    url: process.env.NEXT_PUBLIC_DOCS_SERVICE_URL || 'http://localhost:6899',
    port: 6899,
    status: ServiceStatus.CHECKING,
    description: 'Documentation and knowledge management',
    icon: '📚',
    category: ServiceCategory.DOCUMENTATION,
    healthEndpoint: '/api/health',
  },
];

export const getServicesByCategory = (category: ServiceCategory): Service[] => {
  return FURFIELD_SERVICES.filter(service => service.category === category);
};

export const getServiceById = (id: string): Service | undefined => {
  return FURFIELD_SERVICES.find(service => service.id === id);
};

export const getServiceByPort = (port: number): Service | undefined => {
  return FURFIELD_SERVICES.find(service => service.port === port);
};