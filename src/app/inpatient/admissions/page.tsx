'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function AdmissionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const admissions = [
    {
      id: 'ADM-001',
      petName: 'Max',
      species: 'Dog',
      owner: 'John Doe',
      admissionDate: '2025-10-18',
      ward: 'Ward A',
      bed: 'Bed 3',
      doctor: 'Dr. Smith',
      condition: 'Post-Surgery',
      status: 'active',
    },
    {
      id: 'ADM-002',
      petName: 'Luna',
      species: 'Cat',
      owner: 'Jane Smith',
      admissionDate: '2025-10-19',
      ward: 'ICU',
      bed: 'Bed 1',
      doctor: 'Dr. Johnson',
      condition: 'Critical Care',
      status: 'critical',
    },
    {
      id: 'ADM-003',
      petName: 'Charlie',
      species: 'Dog',
      owner: 'Bob Wilson',
      admissionDate: '2025-10-17',
      ward: 'Ward B',
      bed: 'Bed 5',
      doctor: 'Dr. Smith',
      condition: 'Observation',
      status: 'stable',
    },
  ];

  const statusConfig = {
    active: { variant: 'info' as const, label: 'Active' },
    critical: { variant: 'danger' as const, label: 'Critical' },
    stable: { variant: 'success' as const, label: 'Stable' },
    discharged: { variant: 'default' as const, label: 'Discharged' },
  };

  return (
    <PageWrapper color="purple">
      <div className="space-y-6">
        <div className="flex justify-between items-center pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inpatient Admissions</h1>
            <p className="text-muted-foreground mt-2">Manage pet admissions and ward assignments</p>
          </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Admission
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Admitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Active pets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Beds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Out of 30 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Care</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Stay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.5 days</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search pet..." />
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'critical', label: 'Critical' },
                { value: 'stable', label: 'Stable' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'All Wards' },
                { value: 'ward-a', label: 'Ward A' },
                { value: 'ward-b', label: 'Ward B' },
                { value: 'icu', label: 'ICU' },
              ]}
            />
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Admissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Admissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admission ID</TableHead>
                <TableHead>Pet Details</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Ward/Bed</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admissions.map((admission) => (
                <TableRow key={admission.id}>
                  <TableCell className="font-medium">{admission.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{admission.petName}</p>
                      <p className="text-xs text-muted-foreground">{admission.species}</p>
                    </div>
                  </TableCell>
                  <TableCell>{admission.owner}</TableCell>
                  <TableCell>{admission.admissionDate}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{admission.ward}</p>
                      <p className="text-xs text-muted-foreground">{admission.bed}</p>
                    </div>
                  </TableCell>
                  <TableCell>{admission.doctor}</TableCell>
                  <TableCell>{admission.condition}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[admission.status as keyof typeof statusConfig].variant}>
                      {statusConfig[admission.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" title="View Details">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" title="Update Status">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" size="sm" title="Discharge">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Admission Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Admission" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Pet Name" placeholder="Enter pet name" required />
            <Select
              label="Species"
              options={[
                { value: 'dog', label: 'Dog' },
                { value: 'cat', label: 'Cat' },
                { value: 'bird', label: 'Bird' },
                { value: 'rabbit', label: 'Rabbit' },
              ]}
              required
            />
            <Input label="Owner Name" placeholder="Owner name" required />
            <Input label="Owner Phone" type="tel" placeholder="Phone number" required />
            <Input label="Admission Date" type="date" required />
            <Input label="Admission Time" type="time" required />
            <Select
              label="Ward"
              options={[
                { value: 'ward-a', label: 'Ward A' },
                { value: 'ward-b', label: 'Ward B' },
                { value: 'icu', label: 'ICU' },
              ]}
              required
            />
            <Select
              label="Bed Number"
              options={[
                { value: 'bed-1', label: 'Bed 1' },
                { value: 'bed-2', label: 'Bed 2' },
                { value: 'bed-3', label: 'Bed 3' },
              ]}
              required
            />
            <Select
              label="Attending Doctor"
              options={[
                { value: 'dr-smith', label: 'Dr. Smith' },
                { value: 'dr-johnson', label: 'Dr. Johnson' },
              ]}
              required
            />
            <Select
              label="Admission Type"
              options={[
                { value: 'post-surgery', label: 'Post-Surgery' },
                { value: 'observation', label: 'Observation' },
                { value: 'critical', label: 'Critical Care' },
                { value: 'treatment', label: 'Treatment' },
              ]}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Reason for Admission <span className="text-destructive">*</span>
            </label>
            <textarea
              className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter reason and clinical notes..."
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Admit Pet</Button>
          </div>
        </form>
      </Modal>
      </div>
    </PageWrapper>
  );
}
