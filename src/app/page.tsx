'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function HomePage() {
  const stats = [
    { label: 'Total Appointments', value: '24', change: '+12%', trend: 'up' },
    { label: 'Active Pets', value: '156', change: '+8%', trend: 'up' },
    { label: 'Pending Bills', value: '8', change: '-3%', trend: 'down' },
    { label: 'Available Beds', value: '12', change: '0%', trend: 'neutral' },
  ];

  const recentActivities = [
    { id: 1, type: 'Appointment', patient: 'Max (Dog)', time: '10 mins ago', status: 'completed' },
    { id: 2, type: 'Admission', patient: 'Luna (Cat)', time: '25 mins ago', status: 'active' },
    { id: 3, type: 'Surgery', patient: 'Charlie (Dog)', time: '1 hour ago', status: 'scheduled' },
    { id: 4, type: 'Lab Test', patient: 'Bella (Cat)', time: '2 hours ago', status: 'pending' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Rocky', species: 'Dog', time: '2:00 PM', doctor: 'Dr. Smith' },
    { id: 2, patient: 'Whiskers', species: 'Cat', time: '2:30 PM', doctor: 'Dr. Johnson' },
    { id: 3, patient: 'Buddy', species: 'Dog', time: '3:00 PM', doctor: 'Dr. Smith' },
  ];

  return (
    <PageWrapper color="blue">
      <div className="space-y-6">
        <div className="pl-6 pb-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your hospital today.
          </p>
        </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <svg
                className={`h-4 w-4 ${
                  stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {stat.trend === 'up' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : stat.trend === 'down' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                )}
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : ''}>
                  {stat.change}
                </span>{' '}
                from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your hospital</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">{activity.patient}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        activity.status === 'completed'
                          ? 'success'
                          : activity.status === 'active'
                          ? 'info'
                          : activity.status === 'scheduled'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Today's schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {appointment.patient.substring(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{appointment.patient}</p>
                    <p className="text-xs text-muted-foreground">{appointment.species} • {appointment.doctor}</p>
                  </div>
                  <div className="text-sm font-medium text-primary">{appointment.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Commonly used features for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'New Appointment', icon: '📅', href: '/core/appointments' },
              { label: 'New Pet', icon: '🐾', href: '/core/patients' },
              { label: 'Admissions', icon: '🏥', href: '/inpatient/admissions' },
              { label: 'Pharmacy', icon: '💊', href: '/pharmacy' },
              { label: 'Lab Tests', icon: '🔬', href: '/diagnostics' },
              { label: 'Billing', icon: '💰', href: '/core/billing' },
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/30 backdrop-blur-xl ring-1 ring-white/10 hover:bg-white/40 hover:ring-primary/30 hover:scale-105 transition-all duration-300 group"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
                <span className="text-sm font-medium text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  );
}
