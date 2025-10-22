'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageWrapper } from '@/components/layout/PageWrapper';

export default function ConsultationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const consultations = [
    {
      id: 1,
      date: '2025-10-19',
      petName: 'Max',
      species: 'Dog',
      owner: 'John Doe',
      doctor: 'Dr. Smith',
      chiefComplaint: 'Lethargy and loss of appetite',
      diagnosis: 'Gastroenteritis',
    },
    {
      id: 2,
      date: '2025-10-18',
      petName: 'Luna',
      species: 'Cat',
      owner: 'Jane Smith',
      doctor: 'Dr. Johnson',
      chiefComplaint: 'Routine vaccination',
      diagnosis: 'Healthy - Vaccination completed',
    },
  ];

  return (
    <PageWrapper color="green">
      <div className="space-y-6">
        <div className="flex justify-between items-center pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
            <p className="text-muted-foreground mt-2">Pet consultation records and SOAP notes</p>
          </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Consultation
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input placeholder="Search by pet name or owner..." className="flex-1" />
            <Input type="date" />
            <Button variant="outline">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Cards */}
      <div className="grid gap-4">
        {consultations.map((consultation) => (
          <Card key={consultation.id} hover>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {consultation.petName.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{consultation.petName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {consultation.species} • Owner: {consultation.owner}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-medium">{consultation.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Doctor</p>
                      <p className="text-sm font-medium">{consultation.doctor}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Chief Complaint</p>
                      <p className="text-sm font-medium">{consultation.chiefComplaint}</p>
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Diagnosis</p>
                    <p className="text-sm font-medium">{consultation.diagnosis}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Consultation Modal (SOAP Format) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Consultation - SOAP Notes" size="xl">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pet Name" placeholder="Select or enter pet name" required />
            <Input label="Owner Name" placeholder="Owner name" disabled />
          </div>

          {/* Subjective */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">S - Subjective</h3>
            <div className="space-y-3 pl-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Chief Complaint</label>
                <Input placeholder="Main reason for visit" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">History</label>
                                <textarea 
                  className="w-full min-h-[80px] rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 transition-all duration-300"
                  placeholder="Pet history and symptoms..."
                />
              </div>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">O - Objective</h3>
            <div className="space-y-3 pl-4">
              <div className="grid grid-cols-4 gap-3">
                <Input label="Temperature (°F)" type="number" step="0.1" placeholder="98.6" />
                <Input label="Heart Rate (bpm)" type="number" placeholder="80" />
                <Input label="Resp. Rate (rpm)" type="number" placeholder="20" />
                <Input label="Weight (lbs)" type="number" step="0.1" placeholder="50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Physical Examination</label>
                <textarea
                  className="w-full min-h-[80px] rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Examination findings..."
                />
              </div>
            </div>
          </div>

          {/* Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">A - Assessment</h3>
            <div className="space-y-3 pl-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Diagnosis</label>
                <textarea
                  className="w-full min-h-[80px] rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Diagnosis and assessment..."
                />
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">P - Plan</h3>
            <div className="space-y-3 pl-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Treatment Plan</label>
                <textarea
                  className="w-full min-h-[80px] rounded-xl border-0 ring-1 ring-white/5 bg-white/25 backdrop-blur-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  placeholder="Treatment plan, medications, follow-up instructions..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="secondary" type="button">Save as Draft</Button>
            <Button type="submit">Complete Consultation</Button>
          </div>
        </form>
      </Modal>
      </div>
    </PageWrapper>
  );
}
