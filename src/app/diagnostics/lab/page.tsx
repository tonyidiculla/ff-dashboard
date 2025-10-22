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

export default function DiagnosticsLabPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const tests = [
    {
      id: 'LAB-001',
      patient: 'Max',
      species: 'Dog',
      owner: 'John Doe',
      testType: 'Complete Blood Count',
      category: 'Hematology',
      requestDate: '2025-10-19',
      sampleType: 'Blood',
      status: 'Completed',
      result: 'Normal',
      technician: 'Sarah Lee'
    },
    {
      id: 'LAB-002',
      patient: 'Luna',
      species: 'Cat',
      owner: 'Jane Smith',
      testType: 'Urinalysis',
      category: 'Clinical Pathology',
      requestDate: '2025-10-20',
      sampleType: 'Urine',
      status: 'In Progress',
      result: 'Pending',
      technician: 'Mike Chen'
    },
    {
      id: 'LAB-003',
      patient: 'Charlie',
      species: 'Dog',
      owner: 'Bob Wilson',
      testType: 'X-Ray - Hindleg',
      category: 'Radiology',
      requestDate: '2025-10-20',
      sampleType: 'Imaging',
      status: 'Pending',
      result: 'Pending',
      technician: 'Dr. Johnson'
    },
    {
      id: 'LAB-004',
      patient: 'Whiskers',
      species: 'Cat',
      owner: 'Alice Brown',
      testType: 'FeLV/FIV Test',
      category: 'Serology',
      requestDate: '2025-10-19',
      sampleType: 'Blood',
      status: 'Completed',
      result: 'Negative',
      technician: 'Sarah Lee'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Normal':
      case 'Negative': return 'bg-green-100 text-green-800';
      case 'Abnormal':
      case 'Positive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageWrapper color="cyan">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Diagnostics Lab</h1>
            <p className="text-muted-foreground mt-1">Laboratory tests and diagnostic imaging</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ Request Test</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">42</div>
              <p className="text-xs text-muted-foreground mt-1">Tests This Week</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-xs text-muted-foreground mt-1">Pending Results</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">29</div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'hematology', label: 'Hematology' },
                  { value: 'pathology', label: 'Clinical Pathology' },
                  { value: 'radiology', label: 'Radiology' },
                  { value: 'serology', label: 'Serology' },
                  { value: 'microbiology', label: 'Microbiology' },
                ]}
                className="w-56"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]}
                className="w-48"
              />
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Lab Tests Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Laboratory Tests</h2>
            <p className="text-sm text-muted-foreground">Recent diagnostic tests and results</p>
          </div>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sample</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{test.patient}</div>
                      <div className="text-xs text-muted-foreground">{test.species} • {test.owner}</div>
                    </TableCell>
                    <TableCell>{test.testType}</TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>{test.sampleType}</TableCell>
                    <TableCell suppressHydrationWarning>{new Date(test.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{test.technician}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getResultColor(test.result)}>
                        {test.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="text-primary hover:underline text-sm">View</button>
                        {test.status === 'Completed' && (
                          <button className="text-primary hover:underline text-sm">Report</button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>

        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hematology</CardTitle>
              <CardDescription>Blood analysis tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Complete Blood Count', count: 12 },
                  { name: 'Blood Chemistry', count: 8 },
                  { name: 'Coagulation Profile', count: 3 },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <Badge className="bg-blue-100 text-blue-800">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Radiology</CardTitle>
              <CardDescription>Diagnostic imaging</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'X-Ray', count: 15 },
                  { name: 'Ultrasound', count: 7 },
                  { name: 'CT Scan', count: 2 },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <Badge className="bg-purple-100 text-purple-800">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Microbiology</CardTitle>
              <CardDescription>Culture and sensitivity tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Bacterial Culture', count: 6 },
                  { name: 'Fungal Culture', count: 4 },
                  { name: 'Sensitivity Testing', count: 5 },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <Badge className="bg-green-100 text-green-800">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Completed Tests</CardTitle>
            <CardDescription>Latest test results available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: 'LAB-001', 
                  patient: 'Max', 
                  test: 'Complete Blood Count', 
                  result: 'Normal',
                  time: '2 hours ago',
                  highlights: 'WBC: 8.2 k/µL, RBC: 6.8 M/µL, Platelets: 245 k/µL'
                },
                { 
                  id: 'LAB-004', 
                  patient: 'Whiskers', 
                  test: 'FeLV/FIV Test', 
                  result: 'Negative',
                  time: '4 hours ago',
                  highlights: 'Both FeLV and FIV tests negative'
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{item.patient}</span>
                      <Badge className={getResultColor(item.result)}>{item.result}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.test}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.highlights}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-2">{item.time}</div>
                    <Button variant="outline" size="sm">View Report</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Test Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Request Diagnostic Test">
          <form className="space-y-4">
            <Input label="Pet Name" placeholder="Search pet..." required />
            <Select
              label="Test Category"
              options={[
                { value: '', label: 'Select category' },
                { value: 'hematology', label: 'Hematology' },
                { value: 'pathology', label: 'Clinical Pathology' },
                { value: 'radiology', label: 'Radiology' },
                { value: 'serology', label: 'Serology' },
                { value: 'microbiology', label: 'Microbiology' },
              ]}
              required
            />
            <Select
              label="Test Type"
              options={[
                { value: '', label: 'Select test type' },
                { value: 'cbc', label: 'Complete Blood Count' },
                { value: 'chemistry', label: 'Blood Chemistry' },
                { value: 'urinalysis', label: 'Urinalysis' },
                { value: 'xray', label: 'X-Ray' },
                { value: 'ultrasound', label: 'Ultrasound' },
                { value: 'culture', label: 'Bacterial Culture' },
              ]}
              required
            />
            <Select
              label="Sample Type"
              options={[
                { value: '', label: 'Select sample type' },
                { value: 'blood', label: 'Blood' },
                { value: 'urine', label: 'Urine' },
                { value: 'feces', label: 'Feces' },
                { value: 'tissue', label: 'Tissue' },
                { value: 'imaging', label: 'Imaging' },
              ]}
              required
            />
            <Input label="Collection Date" type="date" required />
            <Select
              label="Priority"
              options={[
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'stat', label: 'STAT' },
              ]}
              required
            />
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
