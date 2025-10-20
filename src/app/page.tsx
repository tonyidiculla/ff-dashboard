'use client';

import { useState, useEffect } from 'react';
import { FURFIELD_SERVICES } from '@/lib/services';
import { Service, ServiceStatus, ServiceCategory, DashboardStats } from '@/types';
import ServiceCard from '@/components/ServiceCard';
import ServiceHealth from '@/components/ServiceHealth';
import QuickActions from '@/components/QuickActions';
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardPage() {
  const [services, setServices] = useState<Service[]>(FURFIELD_SERVICES);
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    onlineServices: 0,
    offlineServices: 0,
    errorServices: 0,
    avgResponseTime: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check service health
  const checkServiceHealth = async (service: Service): Promise<Service> => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${service.url}${service.healthEndpoint || '/api/health'}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        return {
          ...service,
          status: ServiceStatus.ONLINE,
          responseTime,
          lastChecked: new Date(),
        };
      } else {
        return {
          ...service,
          status: ServiceStatus.ERROR,
          responseTime,
          lastChecked: new Date(),
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        ...service,
        status: ServiceStatus.OFFLINE,
        responseTime,
        lastChecked: new Date(),
      };
    }
  };

  // Check all services health
  const checkAllServicesHealth = async () => {
    setIsRefreshing(true);
    
    const healthCheckPromises = services.map(service => checkServiceHealth(service));
    const updatedServices = await Promise.all(healthCheckPromises);
    
    setServices(updatedServices);
    
    // Update stats
    const newStats: DashboardStats = {
      totalServices: updatedServices.length,
      onlineServices: updatedServices.filter(s => s.status === ServiceStatus.ONLINE).length,
      offlineServices: updatedServices.filter(s => s.status === ServiceStatus.OFFLINE).length,
      errorServices: updatedServices.filter(s => s.status === ServiceStatus.ERROR).length,
      avgResponseTime: updatedServices.reduce((sum, s) => sum + (s.responseTime || 0), 0) / updatedServices.length,
    };
    
    setStats(newStats);
    setIsRefreshing(false);
  };

  // Filter services by category
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  // Initial health check
  useEffect(() => {
    checkAllServicesHealth();
    
    // Set up periodic health checks every 30 seconds
    const interval = setInterval(checkAllServicesHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const categories = Object.values(ServiceCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        stats={stats}
        onRefresh={checkAllServicesHealth}
        isRefreshing={isRefreshing}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <QuickActions />

        {/* Service Health Overview */}
        <ServiceHealth stats={stats} />

        {/* Category Filter */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedCategory === 'all'
                    ? 'border-furfield-500 text-furfield-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Services ({services.length})
              </button>
              {categories.map((category) => {
                const count = services.filter(s => s.category === category).length;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedCategory === category
                        ? 'border-furfield-500 text-furfield-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service}
              onRefresh={() => checkServiceHealth(service).then(updated => {
                setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
              })}
            />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No services found in the {selectedCategory} category.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}