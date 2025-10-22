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

export default function OTSchedulePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('2025-10-20');

  const surgeries = [
    {
      id: 'OT-001',
      time: '09:00 AM',
      patient: 'Max',
      species: 'Dog',
      owner: 'John Doe',
      procedure: 'Spay Surgery',
      surgeon: 'Dr. Smith',
      theater: 'OT-1',
      duration: '2 hours',
      status: 'Scheduled',
      priority: 'Routine'
    },
    {
      id: 'OT-002',
      time: '11:30 AM',
      patient: 'Luna',
      species: 'Cat',
      owner: 'Jane Smith',
      procedure: 'Dental Surgery',
      surgeon: 'Dr. Johnson',
      theater: 'OT-2',
      duration: '1.5 hours',
      status: 'In Progress',
      priority: 'Routine'
    },
    {
      id: 'OT-003',
      time: '02:00 PM',
      patient: 'Charlie',
      species: 'Dog',
      owner: 'Bob Wilson',
      procedure: 'Emergency - Fracture Repair',
      surgeon: 'Dr. Smith',
      theater: 'OT-1',
      duration: '3 hours',
      status: 'Scheduled',
      priority: 'Emergency'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'Routine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageWrapper color="orange">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Operation Theater</h1>
            <p className="text-muted-foreground mt-1">Surgery scheduling and theater management</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ Schedule Surgery</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">4</div>
              <p className="text-xs text-muted-foreground mt-1">Surgeries Today</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">2</div>
              <p className="text-xs text-muted-foreground mt-1">Available Theaters</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-xs text-muted-foreground mt-1">Emergency Cases</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Theaters' },
                  { value: 'ot1', label: 'OT-1' },
                  { value: 'ot2', label: 'OT-2' },
                ]}
                className="w-48"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Surgeons' },
                  { value: 'smith', label: 'Dr. Smith' },
                  { value: 'johnson', label: 'Dr. Johnson' },
                ]}
                className="w-48"
              />
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Surgery Schedule Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Today's Surgery Schedule</h2>
            <p className="text-sm text-muted-foreground">Scheduled surgeries for {selectedDate}</p>
          </div>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Surgeon</TableHead>
                  <TableHead>Theater</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surgeries.map((surgery) => (
                  <TableRow key={surgery.id}>
                    <TableCell className="font-medium">{surgery.time}</TableCell>
                    <TableCell>{surgery.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{surgery.patient}</div>
                      <div className="text-xs text-muted-foreground">{surgery.species} • {surgery.owner}</div>
                    </TableCell>
                    <TableCell>{surgery.procedure}</TableCell>
                    <TableCell>{surgery.surgeon}</TableCell>
                    <TableCell>{surgery.theater}</TableCell>
                    <TableCell>{surgery.duration}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(surgery.priority)}>
                        {surgery.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(surgery.status)}>
                        {surgery.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="text-primary hover:underline text-sm">View</button>
                        <button className="text-primary hover:underline text-sm">Edit</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>

        {/* Theater Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Theater 1 (OT-1)</CardTitle>
              <CardDescription>Main Operating Theater</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Status:</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Available</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Next Surgery:</span>
                  <span className="text-sm font-medium">09:00 AM - Spay Surgery</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Equipment Status:</span>
                  <Badge className="bg-green-100 text-green-800">All Ready</Badge>
                </div>
                <Button variant="outline" className="w-full">View Schedule</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theater 2 (OT-2)</CardTitle>
              <CardDescription>Secondary Operating Theater</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Status:</span>
                  <Badge className="bg-blue-100 text-blue-800">In Use</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Surgery:</span>
                  <span className="text-sm font-medium">Dental Surgery (Luna)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estimated End:</span>
                  <span className="text-sm font-medium">01:00 PM</span>
                </div>
                <Button variant="outline" className="w-full">View Details</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule Surgery Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Surgery">
          <form className="space-y-4">
            <Input label="Pet Name" placeholder="Search pet..." required />
            <Select
              label="Procedure Type"
              options={[
                { value: '', label: 'Select procedure' },
                { value: 'spay', label: 'Spay/Neuter' },
                { value: 'dental', label: 'Dental Surgery' },
                { value: 'orthopedic', label: 'Orthopedic Surgery' },
                { value: 'soft-tissue', label: 'Soft Tissue Surgery' },
                { value: 'emergency', label: 'Emergency Surgery' },
              ]}
              required
            />
            <Input label="Surgery Date" type="date" required />
            <Input label="Start Time" type="time" required />
            <Input label="Estimated Duration" placeholder="e.g., 2 hours" required />
            <Select
              label="Surgeon"
              options={[
                { value: '', label: 'Select surgeon' },
                { value: 'smith', label: 'Dr. Smith' },
                { value: 'johnson', label: 'Dr. Johnson' },
              ]}
              required
            />
            <Select
              label="Operating Theater"
              options={[
                { value: '', label: 'Select theater' },
                { value: 'ot1', label: 'Theater 1 (OT-1)' },
                { value: 'ot2', label: 'Theater 2 (OT-2)' },
              ]}
              required
            />
            <Select
              label="Priority"
              options={[
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'emergency', label: 'Emergency' },
              ]}
              required
            />
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Surgery</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
