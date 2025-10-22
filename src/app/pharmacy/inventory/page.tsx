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

export default function PharmacyInventoryPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const medications = [
    {
      id: 'MED-001',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotics',
      stock: 450,
      unit: 'Tablets',
      reorderLevel: 100,
      expiryDate: '2026-03-15',
      supplier: 'VetPharm Co.',
      price: 0.85,
      status: 'In Stock'
    },
    {
      id: 'MED-002',
      name: 'Carprofen 100mg',
      category: 'Pain Relief',
      stock: 75,
      unit: 'Tablets',
      reorderLevel: 100,
      expiryDate: '2025-12-20',
      supplier: 'MediVet Ltd.',
      price: 1.20,
      status: 'Low Stock'
    },
    {
      id: 'MED-003',
      name: 'Prednisolone 5mg',
      category: 'Steroids',
      stock: 25,
      unit: 'Tablets',
      reorderLevel: 50,
      expiryDate: '2025-11-10',
      supplier: 'VetPharm Co.',
      price: 0.65,
      status: 'Critical'
    },
    {
      id: 'MED-004',
      name: 'Frontline Plus',
      category: 'Parasiticides',
      stock: 200,
      unit: 'Doses',
      reorderLevel: 50,
      expiryDate: '2027-06-30',
      supplier: 'Merial Ltd.',
      price: 12.50,
      status: 'In Stock'
    },
    {
      id: 'MED-005',
      name: 'Insulin (Caninsulin)',
      category: 'Hormones',
      stock: 15,
      unit: 'Vials',
      reorderLevel: 20,
      expiryDate: '2025-10-25',
      supplier: 'MediVet Ltd.',
      price: 45.00,
      status: 'Expiring Soon'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Expiring Soon': return 'bg-orange-100 text-orange-800';
      case 'Out of Stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageWrapper color="pink">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pharmacy Inventory</h1>
            <p className="text-muted-foreground mt-1">Medication stock and inventory management</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>+ Add Medication</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">285</div>
              <p className="text-xs text-muted-foreground mt-1">Total Medications</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <p className="text-xs text-muted-foreground mt-1">Low Stock Items</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <p className="text-xs text-muted-foreground mt-1">Expiring Soon</p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground mt-1">Critical Stock</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px]"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'antibiotics', label: 'Antibiotics' },
                  { value: 'pain', label: 'Pain Relief' },
                  { value: 'steroids', label: 'Steroids' },
                  { value: 'parasiticides', label: 'Parasiticides' },
                  { value: 'hormones', label: 'Hormones' },
                ]}
                className="w-48"
              />
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'instock', label: 'In Stock' },
                  { value: 'low', label: 'Low Stock' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'expiring', label: 'Expiring Soon' },
                ]}
                className="w-48"
              />
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Medication Inventory</h2>
            <p className="text-sm text-muted-foreground">Current stock levels and expiry dates</p>
          </div>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Reorder Level</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-xs text-muted-foreground">{med.supplier}</div>
                    </TableCell>
                    <TableCell>{med.category}</TableCell>
                    <TableCell>
                      <div className="font-medium">{med.stock} {med.unit}</div>
                      {med.stock < med.reorderLevel && (
                        <div className="text-xs text-red-600">Below reorder level</div>
                      )}
                    </TableCell>
                    <TableCell>{med.reorderLevel}</TableCell>
                    <TableCell>
                      <div suppressHydrationWarning>{new Date(med.expiryDate).toLocaleDateString()}</div>
                      {new Date(med.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                        <div className="text-xs text-orange-600">Expiring soon</div>
                      )}
                    </TableCell>
                    <TableCell>${med.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(med.status)}>
                        {med.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button className="text-primary hover:underline text-sm">Edit</button>
                        <button className="text-primary hover:underline text-sm">Reorder</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Dispensing</CardTitle>
              <CardDescription>Latest medication dispensed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { med: 'Amoxicillin 250mg', qty: '14 tablets', patient: 'Max', time: '10 mins ago' },
                  { med: 'Carprofen 100mg', qty: '20 tablets', patient: 'Luna', time: '25 mins ago' },
                  { med: 'Frontline Plus', qty: '1 dose', patient: 'Charlie', time: '1 hour ago' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{item.med}</div>
                      <div className="text-sm text-muted-foreground">{item.qty} • {item.patient}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Reorders</CardTitle>
              <CardDescription>Medications below reorder level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { med: 'Prednisolone 5mg', current: 25, needed: 50, supplier: 'VetPharm Co.' },
                  { med: 'Insulin (Caninsulin)', current: 15, needed: 20, supplier: 'MediVet Ltd.' },
                  { med: 'Carprofen 100mg', current: 75, needed: 100, supplier: 'MediVet Ltd.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{item.med}</div>
                      <div className="text-sm text-muted-foreground">{item.supplier}</div>
                      <div className="text-xs text-red-600 mt-1">Stock: {item.current} (Need: {item.needed})</div>
                    </div>
                    <Button variant="outline" size="sm">Order</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Medication Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Medication">
          <form className="space-y-4">
            <Input label="Medication Name" placeholder="e.g., Amoxicillin 250mg" required />
            <Select
              label="Category"
              options={[
                { value: '', label: 'Select category' },
                { value: 'antibiotics', label: 'Antibiotics' },
                { value: 'pain', label: 'Pain Relief' },
                { value: 'steroids', label: 'Steroids' },
                { value: 'parasiticides', label: 'Parasiticides' },
                { value: 'hormones', label: 'Hormones' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock Quantity" type="number" placeholder="0" required />
              <Input label="Unit" placeholder="e.g., Tablets" required />
            </div>
            <Input label="Reorder Level" type="number" placeholder="0" required />
            <Input label="Expiry Date" type="date" required />
            <Input label="Supplier" placeholder="Supplier name" required />
            <Input label="Price per Unit" type="number" step="0.01" placeholder="0.00" required />
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Medication</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageWrapper>
  );
}
