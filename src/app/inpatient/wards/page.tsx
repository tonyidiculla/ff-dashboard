'use client';

import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';

export default function WardManagementPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const patients = [
    {
      id: 'IP-001',
      patient: 'Max',
      species: 'Dog',
      breed: 'Labrador',
      owner: 'John Doe',
      ward: 'ICU',
      bed: 'ICU-01',
      admitDate: '2025-10-18',
      condition: 'Post-Surgery',
      status: 'Critical',
      doctor: 'Dr. Smith',
      temperature: '39.2°C',
      heartRate: '110 bpm'
    },
    {
      id: 'IP-002',
      patient: 'Bella',
      species: 'Cat',
      breed: 'Persian',
      owner: 'Sarah Johnson',
      ward: 'General',
      bed: 'GEN-05',
      admitDate: '2025-10-19',
      condition: 'Observation',
      status: 'Stable',
      doctor: 'Dr. Lee',
      temperature: '38.5°C',
      heartRate: '140 bpm'
    },
    {
      id: 'IP-003',
      patient: 'Rocky',
      species: 'Dog',
      breed: 'German Shepherd',
      owner: 'Mike Wilson',
      ward: 'Isolation',
      bed: 'ISO-02',
      admitDate: '2025-10-17',
      condition: 'Infectious Disease',
      status: 'Improving',
      doctor: 'Dr. Chen',
      temperature: '38.8°C',
      heartRate: '95 bpm'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Stable': return 'bg-green-100 text-green-800';
      case 'Improving': return 'bg-blue-100 text-blue-800';
      case 'Deteriorating': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageWrapper color="purple">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ward Management</h1>
            <p className="text-muted-foreground mt-1">Inpatient care and ward monitoring</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ Add Ward Note</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">18</div>
              <p className="text-xs text-muted-foreground mt-1">Current Inpatients</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground mt-1">Critical Cases</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-xs text-muted-foreground mt-1">Bed Occupancy</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-muted-foreground mt-1">Discharges Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
                            <Input
                type="text"
                placeholder="Search pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Wards' },
                  { value: 'icu', label: 'ICU' },
                  { value: 'general', label: 'General Ward' },
                  { value: 'isolation', label: 'Isolation' },
                  { value: 'recovery', label: 'Recovery' },
                ]}
                className="w-48"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'stable', label: 'Stable' },
                  { value: 'improving', label: 'Improving' },
                ]}
                className="w-48"
              />
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inpatients Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Inpatient List</h2>
            <p className="text-sm text-muted-foreground">Current ward patients and their status</p>
          </div>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Admit Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Vitals</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{patient.patient}</div>
                      <div className="text-xs text-muted-foreground">{patient.species} • {patient.breed}</div>
                      <div className="text-xs text-muted-foreground">{patient.owner}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{patient.ward}</div>
                      <div className="text-xs text-muted-foreground">{patient.bed}</div>
                    </TableCell>
                    <TableCell suppressHydrationWarning>{new Date(patient.admitDate).toLocaleDateString()}</TableCell>
                    <TableCell>{patient.condition}</TableCell>
                    <TableCell>
                      <div className="text-xs">Temp: {patient.temperature}</div>
                      <div className="text-xs">HR: {patient.heartRate}</div>
                    </TableCell>
                    <TableCell>{patient.doctor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="text-primary hover:underline text-sm">View</button>
                        <button className="text-primary hover:underline text-sm">Update</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>

        {/* Ward Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ICU</CardTitle>
              <CardDescription>Intensive Care Unit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Beds:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Occupied:</span>
                  <span className="font-medium text-red-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available:</span>
                  <span className="font-medium text-green-600">1</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Occupancy</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Ward</CardTitle>
              <CardDescription>Standard pet care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Beds:</span>
                  <span className="font-medium">10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Occupied:</span>
                  <span className="font-medium text-yellow-600">9</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available:</span>
                  <span className="font-medium text-green-600">1</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Occupancy</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Isolation</CardTitle>
              <CardDescription>Infectious disease ward</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Beds:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Occupied:</span>
                  <span className="font-medium text-blue-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available:</span>
                  <span className="font-medium text-green-600">1</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Occupancy</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery</CardTitle>
              <CardDescription>Post-operative care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Beds:</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Occupied:</span>
                  <span className="font-medium text-green-600">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available:</span>
                  <span className="font-medium text-green-600">1</span>
                </div>
                <div className="pt-2">
                  <div className="text-xs text-muted-foreground mb-1">Occupancy</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Ward Rounds</CardTitle>
              <CardDescription>Latest patient checks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: 'Max', ward: 'ICU', doctor: 'Dr. Smith', note: 'Vitals stable, continue monitoring', time: '30 mins ago' },
                  { patient: 'Bella', ward: 'General', doctor: 'Dr. Lee', note: 'Eating well, ready for discharge tomorrow', time: '1 hour ago' },
                  { patient: 'Rocky', ward: 'Isolation', doctor: 'Dr. Chen', note: 'Temperature decreasing, good progress', time: '2 hours ago' },
                ].map((item, idx) => (
                  <div key={idx} className="pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium">{item.patient}</div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">{item.ward} • {item.doctor}</div>
                    <div className="text-sm">{item.note}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Schedule</CardTitle>
              <CardDescription>Upcoming medications and procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { patient: 'Max', time: '02:00 PM', treatment: 'IV Fluids + Pain Medication', ward: 'ICU' },
                  { patient: 'Bella', time: '03:30 PM', treatment: 'Oral Medication', ward: 'General' },
                  { patient: 'Rocky', time: '04:00 PM', treatment: 'Antibiotic Injection', ward: 'Isolation' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="font-medium">{item.patient}</div>
                      <div className="text-sm">{item.treatment}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.ward}</div>
                    </div>
                    <div className="text-sm font-medium text-primary">{item.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Ward Note Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Ward Note">
          <form className="space-y-4">
            <Select
              label="Patient"
              options={[
                { value: '', label: 'Select patient' },
                { value: 'max', label: 'Max (IP-001) - ICU' },
                { value: 'bella', label: 'Bella (IP-002) - General' },
                { value: 'rocky', label: 'Rocky (IP-003) - Isolation' },
              ]}
              required
            />
            <Input label="Date & Time" type="datetime-local" required />
            <Select
              label="Note Type"
              options={[
                { value: '', label: 'Select type' },
                { value: 'rounds', label: 'Ward Rounds' },
                { value: 'medication', label: 'Medication' },
                { value: 'vitals', label: 'Vital Signs' },
                { value: 'procedure', label: 'Procedure' },
                { value: 'general', label: 'General Note' },
              ]}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Temperature (°C)" type="number" step="0.1" placeholder="38.5" />
              <Input label="Heart Rate (bpm)" type="number" placeholder="120" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Clinical Notes</label>
              <textarea
                className="w-full rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                rows={4}
                placeholder="Enter detailed observations and notes..."
                required
              />
            </div>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Note</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
