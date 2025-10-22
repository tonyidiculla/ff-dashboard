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
import { 
  useAppointmentsWithDetails, 
  useCancelAppointment, 
  useCreateAppointment,
  useStartConsultation,
  useEndConsultation,
  useSendOTPToOwner,
  useVerifyEMROTP
} from '@/hooks/useDatabase';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { PetMaster, Profile } from '@/types/database';

export default function AppointmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  // State for new appointment modal
  const [unifiedSearch, setUnifiedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    type: 'pet';
    pet: PetMaster;
    owner: Profile | null;
  }>>([]);
  const [selectedPet, setSelectedPet] = useState<PetMaster | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<Profile | null>(null);
  
  // Entity search state
  const [entitySearch, setEntitySearch] = useState('');
  const [entitySearchResults, setEntitySearchResults] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  
  const [appointmentForm, setAppointmentForm] = useState({
    entity_platform_id: '',
    doctor_user_platform_id: '',
    employee_assignment_id: '',
    employee_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'routine',
    reason: '',
    notes: '',
  });

  // Employee rostering state
  const [availableStaff, setAvailableStaff] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Unified search function - searches pets and owners, then joins them
  const performUnifiedSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('Unified search for:', query);
      
      // Search for pets by name, ID, species, breed
      const { data: petsByPet, error: petsError } = await supabase
        .from('pet_master')
        .select('*')
        .or(`name.ilike.%${query}%,pet_platform_id.ilike.%${query}%,species.ilike.%${query}%,breed.ilike.%${query}%`)
        .limit(10);

      if (petsError) {
        console.error('Pet search error:', petsError);
        throw petsError;
      }

      // Search for owners by name, email, ID
      const { data: ownerMatches, error: ownersError } = await supabase
        .from('profiles')
        .select('*')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,user_platform_id.ilike.%${query}%`)
        .limit(10);

      if (ownersError) {
        console.error('Owner search error:', ownersError);
        throw ownersError;
      }

      // Get pets belonging to the matched owners
      let petsByOwner: any[] = [];
      if (ownerMatches && ownerMatches.length > 0) {
        const ownerPlatformIds = ownerMatches.map(o => o.user_platform_id).filter(Boolean);
        const { data: ownerPets, error: ownerPetsError } = await supabase
          .from('pet_master')
          .select('*')
          .in('user_platform_id', ownerPlatformIds);
        
        if (!ownerPetsError) {
          petsByOwner = ownerPets || [];
        }
      }

      // Combine all pets (remove duplicates by pet_platform_id)
      const allPetsMap = new Map();
      [...(petsByPet || []), ...petsByOwner].forEach(pet => {
        if (pet.pet_platform_id) {
          allPetsMap.set(pet.pet_platform_id, pet);
        }
      });
      const allPets = Array.from(allPetsMap.values());

      if (allPets.length === 0) {
        console.log('No pets found');
        setSearchResults([]);
        return;
      }

      // Get unique owner platform IDs from all pets
      const ownerPlatformIds = [...new Set(allPets.map(pet => pet.user_platform_id).filter(Boolean))];

      // Fetch all owners in one query
      const { data: owners, error: allOwnersError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_platform_id', ownerPlatformIds);

      if (allOwnersError) throw allOwnersError;

      // Create a map of owners by platform_id
      const ownersMap = new Map<string, Profile>();
      owners?.forEach(owner => {
        if (owner.user_platform_id) {
          ownersMap.set(owner.user_platform_id, owner);
        }
      });

      // Combine pets with their owners
      const results = allPets.map(pet => ({
        type: 'pet' as const,
        pet,
        owner: pet.user_platform_id ? ownersMap.get(pet.user_platform_id) || null : null,
      }));

      console.log('Search results:', results.length);
      setSearchResults(results);
    } catch (error) {
      console.error('Error performing unified search:', error);
      setSearchResults([]);
    }
  };

    // Entity search function - searches hospital_master table
  const performEntitySearch = async (query: string) => {
    if (!query || query.length < 2) {
      setEntitySearchResults([]);
      return;
    }

    try {
      console.log('Searching hospital_master for:', query);
      
      // Search by entity_name or entity_platform_id
      const { data: entities, error } = await supabase
        .from('hospital_master')
        .select('*')
        .or(`entity_name.ilike.%${query}%,entity_platform_id.ilike.%${query}%`)
        .limit(10);

      if (error) {
        console.error('Hospital search error:', error);
        throw error;
      }
      
      console.log('Hospital search results:', entities);
      setEntitySearchResults(entities || []);
    } catch (error) {
      console.error('Error searching hospitals:', error);
      setEntitySearchResults([]);
    }
  };

  // Debounced unified search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (unifiedSearch) {
        performUnifiedSearch(unifiedSearch);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [unifiedSearch]);

  // Debounced entity search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (entitySearch) {
        performEntitySearch(entitySearch);
      } else {
        setEntitySearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [entitySearch]);

  // Employee rostering functions
  const fetchAvailableStaff = async (entityPlatformId: string) => {
    if (!entityPlatformId) {
      setAvailableStaff([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_entity_appointment_staff', {
          p_entity_platform_id: entityPlatformId
        });

      if (error) {
        console.error('Error fetching staff:', error);
        setAvailableStaff([]);
        return;
      }

      console.log('Available staff:', data);
      setAvailableStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setAvailableStaff([]);
    }
  };

  const fetchAvailableSlots = async (entityPlatformId: string, employeeAssignmentId: string, date: string) => {
    if (!entityPlatformId || !employeeAssignmentId || !date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .rpc('get_employee_available_slots', {
          p_entity_platform_id: entityPlatformId,
          p_employee_assignment_id: employeeAssignmentId,
          p_date: date
        });

      if (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
        return;
      }

      console.log('Available slots:', data);
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Effect to fetch staff when entity is selected
  React.useEffect(() => {
    if (appointmentForm.entity_platform_id) {
      fetchAvailableStaff(appointmentForm.entity_platform_id);
    }
  }, [appointmentForm.entity_platform_id]);

  // Effect to fetch slots when employee and date are selected
  React.useEffect(() => {
    if (appointmentForm.entity_platform_id && appointmentForm.employee_assignment_id && appointmentForm.appointment_date) {
      fetchAvailableSlots(
        appointmentForm.entity_platform_id,
        appointmentForm.employee_assignment_id,
        appointmentForm.appointment_date
      );
    } else {
      setAvailableSlots([]);
    }
  }, [appointmentForm.entity_platform_id, appointmentForm.employee_assignment_id, appointmentForm.appointment_date]);  // Fetch appointments with pet, owner, and doctor details
  const { data: appointments, isLoading, error } = useAppointmentsWithDetails({
    status: filters.status || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  });

  const cancelAppointment = useCancelAppointment();
  const createAppointment = useCreateAppointment();
  const startConsultation = useStartConsultation();
  const endConsultation = useEndConsultation();
  const sendOTPToOwner = useSendOTPToOwner();
  const verifyEMROTP = useVerifyEMROTP();

  // OTP Verification Modal State
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpAppointmentId, setOTPAppointmentId] = useState<string>('');
  const [otpCode, setOTPCode] = useState('');

  // Handle successful actions with feedback
  const handleStartConsultation = (id: string) => {
    // Find the appointment to validate date
    const appointment = appointments?.find(apt => apt.id === id);
    
    if (appointment) {
      const appointmentDate = new Date(appointment.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);
      
      // Check if appointment is in the future
      if (appointmentDate > today) {
        alert('❌ Cannot start consultation: Appointment is scheduled for a future date.');
        return;
      }
    }
    
    startConsultation.mutate(id, {
      onSuccess: () => {
        alert('✅ Consultation started successfully! EMR access granted.');
      },
      onError: (error) => {
        console.error('Failed to start consultation:', error);
        alert('❌ Failed to start consultation. Please try again.');
      }
    });
  };

  const handleEndConsultation = (id: string) => {
    if (confirm('Are you sure you want to complete this consultation?')) {
      endConsultation.mutate(id, {
        onSuccess: () => {
          alert('✅ Consultation completed successfully!');
        },
        onError: (error) => {
          console.error('Failed to complete consultation:', error);
          alert('❌ Failed to complete consultation. Please try again.');
        }
      });
    }
  };

  const handleSendOTP = (id: string) => {
    sendOTPToOwner.mutate(id, {
      onSuccess: () => {
        alert('✅ OTP sent to owner successfully! Please verify the code.');
      },
      onError: (error) => {
        console.error('Failed to send OTP:', error);
        alert('❌ Failed to send OTP. Please try again.');
      }
    });
  };

  // Debug: Log appointments data
  React.useEffect(() => {
    if (appointments) {
      console.log('Appointments loaded:', appointments.length);
      console.log('Sample appointment:', appointments[0]);
      console.log('Appointment fields:', appointments[0] ? Object.keys(appointments[0]) : 'none');
      
      // Log button visibility conditions
      if (appointments[0]) {
        const apt = appointments[0];
        console.log('Button visibility check:', {
          status: apt.status,
          emr_otp_code: apt.emr_otp_code,
          emr_otp_verified: apt.emr_otp_verified,
          emr_write_access_active: apt.emr_write_access_active,
          shouldShowSendOTP: apt.status === 'scheduled' && !apt.emr_otp_code,
          shouldShowVerifyOTP: apt.emr_otp_code && !apt.emr_otp_verified,
          shouldShowStartConsultation: (apt.status === 'scheduled' || apt.status === 'confirmed') && apt.emr_otp_verified && !apt.emr_write_access_active,
          shouldShowEdit: apt.status === 'scheduled' || apt.status === 'confirmed'
        });
      }
    }
  }, [appointments]);

  // Debug: Check handlers are defined
  React.useEffect(() => {
    console.log('Handlers defined:', {
      handleStartConsultation: typeof handleStartConsultation,
      handleEndConsultation: typeof handleEndConsultation,
      handleSendOTP: typeof handleSendOTP,
      startConsultation: typeof startConsultation,
      endConsultation: typeof endConsultation,
      sendOTPToOwner: typeof sendOTPToOwner,
      verifyEMROTP: typeof verifyEMROTP
    });
  }, []);

  // Debug: Track OTP modal state changes
  React.useEffect(() => {
    console.log('OTP Modal state changed:', {
      isOpen: isOTPModalOpen,
      appointmentId: otpAppointmentId,
      code: otpCode
    });
  }, [isOTPModalOpen, otpAppointmentId, otpCode]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPet || !selectedOwner) {
      alert('Please select a pet and owner');
      return;
    }

    if (!appointmentForm.entity_platform_id) {
      alert('Please enter an entity platform ID');
      return;
    }

    if (!selectedEmployee || !appointmentForm.employee_assignment_id) {
      alert('Please select a staff member');
      return;
    }

    if (!appointmentForm.appointment_time) {
      alert('Please select an appointment time slot');
      return;
    }

    try {
      // For now, use the doctor_user_platform_id field to store employee platform ID
      await createAppointment.mutateAsync({
        pet_platform_id: selectedPet.pet_platform_id,
        owner_user_platform_id: selectedOwner.user_platform_id,
        entity_platform_id: appointmentForm.entity_platform_id,
        doctor_user_platform_id: selectedEmployee.user_platform_id,
        appointment_date: appointmentForm.appointment_date,
        appointment_time: appointmentForm.appointment_time,
        appointment_type: appointmentForm.appointment_type,
        status: 'scheduled',
        reason: appointmentForm.reason || undefined,
        notes: appointmentForm.notes || undefined,
        booking_source: 'hospital-online',
        emr_access_granted: false,
        emr_otp_verified: false,
        emr_otp_sent_to_owner: false,
        emr_write_access_active: false,
        emr_access_revoked: false,
      });

      // Reset form
      setIsModalOpen(false);
      setSelectedPet(null);
      setSelectedOwner(null);
      setSelectedEntity(null);
      setUnifiedSearch('');
      setSearchResults([]);
      setEntitySearch('');
      setEntitySearchResults([]);
      setAppointmentForm({
        entity_platform_id: '',
        doctor_user_platform_id: '',
        employee_assignment_id: '',
        employee_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'routine',
        reason: '',
        notes: '',
      });
      setSelectedEmployee(null);
      setAvailableStaff([]);
      setAvailableSlots([]);

      alert('Appointment created successfully!');
    } catch (err: any) {
      console.error('Failed to create appointment:', err);
      console.error('Error details:', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code
      });
      const errorMessage = err?.message || err?.details || 'Unknown error occurred';
      alert(`Failed to create appointment: ${errorMessage}`);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment.mutateAsync(id);
      } catch (err) {
        console.error('Failed to cancel appointment:', err);
        alert('Failed to cancel appointment');
      }
    }
  };

  // Filter appointments by search text (pet name, owner name, or IDs)
  const filteredAppointments = appointments?.filter((apt) => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    
    // Search in pet details
    const petMatch = 
      apt.pet?.name?.toLowerCase().includes(searchLower) ||
      apt.pet?.species?.toLowerCase().includes(searchLower) ||
      apt.pet?.breed?.toLowerCase().includes(searchLower) ||
      apt.pet_platform_id.toLowerCase().includes(searchLower);
    
    // Search in owner details
    const ownerMatch = 
      apt.owner?.first_name?.toLowerCase().includes(searchLower) ||
      apt.owner?.last_name?.toLowerCase().includes(searchLower) ||
      apt.owner?.email?.toLowerCase().includes(searchLower) ||
      apt.owner_user_platform_id.toLowerCase().includes(searchLower);
    
    // Search in entity and appointment details
    const otherMatch =
      apt.entity_platform_id.toLowerCase().includes(searchLower) ||
      apt.appointment_number?.toLowerCase().includes(searchLower) ||
      apt.reason?.toLowerCase().includes(searchLower);
    
    return petMatch || ownerMatch || otherMatch;
  }) || [];

  const statusColors = {
    scheduled: 'warning',
    confirmed: 'info',
    'in-progress': 'info',
    completed: 'success',
    cancelled: 'danger',
    'no-show': 'danger',
  } as const;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <PageWrapper color="green">
      <div className="space-y-6">
        <div className="flex justify-between items-center pl-6 pb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground mt-2">Manage and schedule pet appointments</p>
          </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Appointment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input 
              placeholder="Search by ID..." 
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All Status' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'no-show', label: 'No Show' },
              ]}
            />
            <Input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              placeholder="Start date"
            />
            <Input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              placeholder="End date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Appointments 
            {appointments && (
              <span className="text-sm text-muted-foreground font-normal ml-2">
                {filters.search && `${filteredAppointments.length} of `}
                {appointments.length} total
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-danger">
              <p>Failed to load appointments</p>
              <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {filters.search || filters.status || filters.startDate || filters.endDate ? (
                <>
                  <p>No appointments match your filters</p>
                  <p className="text-sm mt-2">
                    {appointments && `(${appointments.length} total appointments in database)`}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setFilters({ status: '', startDate: '', endDate: '', search: '' })}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <p>No appointments found</p>
                  <p className="text-sm mt-2">Create your first appointment to get started</p>
                  <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                    Schedule First Appointment
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Appointment #</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>EMR</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium font-mono text-xs">
                      {appointment.appointment_number || appointment.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.pet?.name || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.pet?.species || 'N/A'} • {appointment.pet_platform_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {appointment.owner 
                            ? `${appointment.owner.first_name} ${appointment.owner.last_name}`
                            : 'Unknown'}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {appointment.owner_user_platform_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(appointment.appointment_date)}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(appointment.appointment_time)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {appointment.doctor 
                        ? `${appointment.doctor.first_name} ${appointment.doctor.last_name}`
                        : appointment.doctor_user_platform_id || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[appointment.status as keyof typeof statusColors] || 'default'}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {appointment.emr_otp_verified ? (
                          <div title="EMR Access Verified - Ready">
                            <svg 
                              className="w-6 h-6 text-success" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : appointment.emr_otp_code ? (
                          <div title="OTP Sent - Awaiting Verification">
                            <svg 
                              className="w-6 h-6 text-warning" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        ) : (
                          <div title="OTP Not Sent">
                            <svg 
                              className="w-6 h-6 text-muted-foreground" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {/* View Details */}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            console.log('View button clicked, appointment:', appointment.id);
                            setSelectedAppointment(appointment);
                            setIsEditMode(false);
                            setIsViewEditModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                        
                        {/* Complete Consultation (if in progress) */}
                        {appointment.status === 'in-progress' && appointment.emr_write_access_active && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEndConsultation(appointment.id)}
                            title="Complete Consultation"
                            disabled={endConsultation.isPending}
                            className="text-primary"
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </Button>
                        )}
                        
                        {/* Cancel Appointment */}
                        {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            title="Cancel Appointment"
                            disabled={cancelAppointment.isPending}
                            className="text-danger"
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        )}
                        
                        {/* Send OTP (if no OTP sent yet) */}
                        {appointment.status === 'scheduled' && !appointment.emr_otp_code && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log('Send OTP clicked for appointment:', appointment.id);
                              handleSendOTP(appointment.id);
                            }}
                            title="Send OTP to Owner"
                            disabled={sendOTPToOwner.isPending}
                            className="text-info"
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </Button>
                        )}
                        
                        {/* Verify OTP (if OTP sent but not verified) */}
                        {appointment.emr_otp_code && !appointment.emr_otp_verified && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              console.log('Verify OTP clicked for appointment:', appointment.id);
                              console.log('OTP Modal state before:', isOTPModalOpen);
                              setOTPAppointmentId(appointment.id);
                              setIsOTPModalOpen(true);
                              console.log('OTP Modal should open now');
                            }}
                            title="Verify OTP"
                            className="text-warning"
                          >
                            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Appointment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Appointment" size="lg">
        <form onSubmit={handleCreateAppointment} className="space-y-6">
          {/* Unified Pet & Owner Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Search Pet & Owner <span className="text-danger">*</span>
            </label>
            <Input 
              placeholder="Search by pet name, species, breed, or ID..." 
              value={unifiedSearch}
              onChange={(e) => setUnifiedSearch(e.target.value)}
              disabled={!!selectedPet && !!selectedOwner}
            />
            
            {/* Display selected pet and owner */}
            {selectedPet && selectedOwner ? (
              <div className="space-y-2">
                <div className="p-3 border rounded-lg bg-success/10 border-success">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">🐾 {selectedPet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPet.species} • {selectedPet.breed} • {selectedPet.pet_platform_id}
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="font-medium text-foreground">👤 {selectedOwner.first_name} {selectedOwner.last_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedOwner.email} • {selectedOwner.user_platform_id}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPet(null);
                      setSelectedOwner(null);
                      setUnifiedSearch('');
                      setSearchResults([]);
                    }}
                    className="mt-3 w-full"
                  >
                    Change Selection
                  </Button>
                </div>
              </div>
            ) : searchResults.length > 0 && (
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.pet.id}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedPet(result.pet);
                      setSelectedOwner(result.owner);
                      setSearchResults([]);
                      setUnifiedSearch('');
                    }}
                    className="w-full p-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          🐾 {result.pet.name}
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {result.pet.species}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {result.pet.breed} • {result.pet.pet_platform_id}
                        </div>
                        {result.owner && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-sm font-medium text-foreground">
                              👤 {result.owner.first_name} {result.owner.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {result.owner.email}
                            </div>
                          </div>
                        )}
                        {!result.owner && (
                          <div className="mt-2 pt-2 border-t">
                            <div className="text-xs text-warning">
                              ⚠️ Owner information not found
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {unifiedSearch.length >= 2 && searchResults.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                No pets found matching "{unifiedSearch}"
              </div>
            )}
          </div>

          {/* Entity Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Search Hospital/Entity <span className="text-danger">*</span>
            </label>
            <Input 
              placeholder="Search by hospital name, entity ID, or city..." 
              value={entitySearch}
              onChange={(e) => setEntitySearch(e.target.value)}
              disabled={!!selectedEntity}
            />
            
            {selectedEntity ? (
              <div className="p-3 border rounded-lg bg-success/10 border-success">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      🏥 {selectedEntity.entity_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedEntity.city && `${selectedEntity.city} • `}
                      {selectedEntity.entity_platform_id}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedEntity(null);
                      setEntitySearch('');
                      setAppointmentForm({ ...appointmentForm, entity_platform_id: '' });
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : entitySearchResults.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {entitySearchResults.map((entity) => (
                  <button
                    key={entity.id}
                    type="button"
                    onClick={() => {
                      setSelectedEntity(entity);
                      setEntitySearchResults([]);
                      setEntitySearch('');
                      setAppointmentForm({ ...appointmentForm, entity_platform_id: entity.entity_platform_id });
                    }}
                    className="w-full p-3 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                  >
                    <div className="font-semibold text-foreground">
                      🏥 {entity.entity_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entity.city && `${entity.city} • `}
                      {entity.entity_platform_id}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {entitySearch.length >= 2 && entitySearchResults.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                No hospitals found matching "{entitySearch}"
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee/Staff Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Select Staff Member <span className="text-danger">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={appointmentForm.employee_assignment_id}
                onChange={(e) => {
                  const selectedStaff = availableStaff.find(staff => staff.employee_assignment_id === e.target.value);
                  setSelectedEmployee(selectedStaff);
                  setAppointmentForm({ 
                    ...appointmentForm, 
                    employee_assignment_id: e.target.value,
                    employee_id: selectedStaff?.employee_id || '',
                    doctor_user_platform_id: selectedStaff?.user_platform_id || '',
                    appointment_time: '' // Reset time when staff changes
                  });
                }}
                required
                disabled={!appointmentForm.entity_platform_id}
              >
                <option value="">
                  {!appointmentForm.entity_platform_id 
                    ? "Select hospital first..." 
                    : availableStaff.length === 0 
                    ? "No staff available..." 
                    : "Select staff member..."
                  }
                </option>
                {availableStaff.map((staff) => (
                  <option key={staff.employee_assignment_id} value={staff.employee_assignment_id}>
                    {staff.full_name} ({staff.employee_id}) - {staff.employee_job_title}
                    {staff.role_type && ` • ${staff.role_type}`}
                  </option>
                ))}
              </select>
              {selectedEmployee && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>📋 {selectedEmployee.employee_job_title}</p>
                  <p>⏱️ {selectedEmployee.slot_duration_minutes || 15} min appointments</p>
                  {selectedEmployee.professional_email && (
                    <p>📧 {selectedEmployee.professional_email}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Date Selection with Quick Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Appointment Date <span className="text-danger">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    setAppointmentForm({ 
                      ...appointmentForm, 
                      appointment_date: today.toISOString().split('T')[0],
                      appointment_time: '' // Reset time when date changes
                    });
                  }}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setAppointmentForm({ 
                      ...appointmentForm, 
                      appointment_date: tomorrow.toISOString().split('T')[0],
                      appointment_time: '' // Reset time when date changes
                    });
                  }}
                >
                  Tomorrow
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setAppointmentForm({ 
                      ...appointmentForm, 
                      appointment_date: nextWeek.toISOString().split('T')[0],
                      appointment_time: '' // Reset time when date changes
                    });
                  }}
                >
                  Next Week
                </Button>
              </div>
              <Input 
                type="date" 
                value={appointmentForm.appointment_date}
                onChange={(e) => setAppointmentForm({ 
                  ...appointmentForm, 
                  appointment_date: e.target.value,
                  appointment_time: '' // Reset time when date changes
                })}
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
          </div>

          {/* Available Time Slots Grid */}
          {selectedEmployee && appointmentForm.appointment_date && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Available Time Slots <span className="text-danger">*</span>
              </label>
              
              {loadingSlots ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading available slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg">
                  No available slots for {selectedEmployee.full_name} on {appointmentForm.appointment_date}
                  <br />
                  <span className="text-xs">Try selecting a different date or staff member</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.slot_time}
                        type="button"
                        variant={appointmentForm.appointment_time === slot.slot_time ? "primary" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (slot.is_available) {
                            setAppointmentForm({ 
                              ...appointmentForm, 
                              appointment_time: slot.slot_time 
                            });
                          }
                        }}
                        disabled={!slot.is_available}
                        className={`
                          h-8 text-xs
                          ${!slot.is_available 
                            ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground" 
                            : slot.booking_count > 0 
                            ? "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
                            : ""
                          }
                        `}
                      >
                        {slot.slot_time}
                        {!slot.is_available && (
                          <span className="ml-1">✗</span>
                        )}
                      </Button>
                    ))}
                  </div>
                  
                  {appointmentForm.appointment_time && (
                    <div className="p-3 bg-success/10 border border-success rounded-lg">
                      <p className="text-sm font-medium text-success">
                        ✓ Selected: {appointmentForm.appointment_time} - {appointmentForm.appointment_time.split(':').map((part, i) => {
                          if (i === 0) return part;
                          return String(parseInt(part) + (selectedEmployee?.slot_duration_minutes || 15)).padStart(2, '0');
                        }).join(':')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedEmployee?.slot_duration_minutes || 15} minute appointment with {selectedEmployee?.full_name}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border rounded border-input bg-background"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border rounded bg-muted"></div>
                      <span>Booked</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Appointment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Appointment Type"
              value={appointmentForm.appointment_type}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_type: e.target.value })}
              options={[
                { value: 'routine', label: 'Routine Checkup' },
                { value: 'vaccination', label: 'Vaccination' },
                { value: 'follow-up', label: 'Follow-up' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'surgery', label: 'Surgery' },
                { value: 'dental', label: 'Dental' },
                { value: 'grooming', label: 'Grooming' },
              ]}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Reason for Visit</label>
            <textarea
              className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter reason for visit..."
              value={appointmentForm.reason}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Notes (Optional)</label>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Additional notes..."
              value={appointmentForm.notes}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                // Reset search states when closing
                setUnifiedSearch('');
                setSearchResults([]);
                setEntitySearch('');
                setEntitySearchResults([]);
              }} 
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={
                !selectedPet || 
                !selectedOwner || 
                !selectedEntity || 
                !selectedEmployee || 
                !appointmentForm.appointment_time || 
                createAppointment.isPending
              }
            >
              {createAppointment.isPending ? 'Creating...' : 'Schedule Appointment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal 
        isOpen={isOTPModalOpen} 
        onClose={() => {
          setIsOTPModalOpen(false);
          setOTPAppointmentId('');
          setOTPCode('');
        }} 
        title="Verify OTP Code" 
        size="sm"
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (otpCode.trim()) {
              verifyEMROTP.mutate(
                { appointmentId: otpAppointmentId, otpCode: otpCode.trim() },
                {
                  onSuccess: async () => {
                    // Find the verified appointment to get pet_platform_id
                    const verifiedAppointment = appointments?.find(apt => apt.id === otpAppointmentId);
                    
                    if (verifiedAppointment?.pet_platform_id) {
                      // Call function to sync OTP verification for all appointments of this pet today
                      try {
                        await supabase.rpc('sync_otp_verification_for_pet', {
                          p_pet_platform_id: verifiedAppointment.pet_platform_id
                        });
                        console.log('✅ Synced OTP verification for all appointments of pet:', verifiedAppointment.pet_platform_id);
                      } catch (error) {
                        console.error('Failed to sync OTP verification:', error);
                      }
                    }
                    
                    setIsOTPModalOpen(false);
                    setOTPAppointmentId('');
                    setOTPCode('');
                    alert('✅ OTP verified successfully! EMR access is now ready for all appointments today.');
                  },
                  onError: (error) => {
                    console.error('OTP verification failed:', error);
                  }
                }
              );
            }
          }} 
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Enter OTP Code <span className="text-danger">*</span>
            </label>
            <Input 
              type="text"
              placeholder="Enter 6-digit code" 
              value={otpCode}
              onChange={(e) => setOTPCode(e.target.value)}
              maxLength={6}
              pattern="[0-9]{6}"
              required
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit OTP code sent to the pet owner
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-info hover:text-info/80 text-xs"
              onClick={() => {
                if (otpAppointmentId) {
                  handleSendOTP(otpAppointmentId);
                }
              }}
              disabled={sendOTPToOwner.isPending}
            >
              {sendOTPToOwner.isPending ? 'Sending...' : '📧 Resend OTP'}
            </Button>
          </div>

          {verifyEMROTP.isError && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-sm">
              Failed to verify OTP. Please check the code and try again.
            </div>
          )}

          {sendOTPToOwner.isSuccess && (
            <div className="p-3 rounded-lg bg-success/10 border border-success text-success text-sm">
              ✅ OTP resent successfully! Please check with the owner.
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsOTPModalOpen(false);
                setOTPAppointmentId('');
                setOTPCode('');
              }} 
              type="button"
              disabled={verifyEMROTP.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!otpCode.trim() || otpCode.trim().length !== 6 || verifyEMROTP.isPending}
            >
              {verifyEMROTP.isPending ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View/Edit Appointment Modal */}
      {selectedAppointment && (
        <Modal 
          isOpen={isViewEditModalOpen} 
          onClose={() => {
            setIsViewEditModalOpen(false);
            setIsEditMode(false);
            setSelectedAppointment(null);
          }} 
          title={isEditMode ? "Edit Appointment" : "Appointment Details"} 
          size="lg"
        >
          {isEditMode ? (
            /* EDIT MODE - Form with inputs */
            <form className="space-y-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold">{selectedAppointment.appointment_number}</h3>
                  <p className="text-sm text-muted-foreground">Editing appointment</p>
                </div>
                <Badge variant={statusColors[selectedAppointment.status as keyof typeof statusColors] || 'default'}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              {/* Pet & Owner Info (Read-only in edit mode) */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">🐾 Pet Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedAppointment.pet?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Species / Breed</p>
                      <p className="text-sm">{selectedAppointment.pet?.species} • {selectedAppointment.pet?.breed}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">👤 Owner Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">
                        {selectedAppointment.owner 
                          ? `${selectedAppointment.owner.first_name} ${selectedAppointment.owner.last_name}`
                          : 'Unknown'}
                      </p>
                    </div>
                    {selectedAppointment.owner?.email && (
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedAppointment.owner.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Appointment Details */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">📋 Appointment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Appointment Date <span className="text-danger">*</span>
                    </label>
                    <Input 
                      type="date" 
                      defaultValue={selectedAppointment.appointment_date}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Appointment Time <span className="text-danger">*</span>
                    </label>
                    <Input 
                      type="time" 
                      defaultValue={selectedAppointment.appointment_time}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      defaultValue={selectedAppointment.appointment_type || 'routine'}
                      required
                    >
                      <option value="routine">Routine Checkup</option>
                      <option value="emergency">Emergency</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="vaccination">Vaccination</option>
                      <option value="surgery">Surgery</option>
                      <option value="grooming">Grooming</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Duration (minutes)
                    </label>
                    <Input 
                      type="number" 
                      defaultValue={selectedAppointment.duration_minutes || 30}
                      min="15"
                      step="15"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Doctor Platform ID
                    </label>
                    <Input 
                      type="text" 
                      placeholder="H00xxxxxx"
                      defaultValue={selectedAppointment.doctor_user_platform_id || ''}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Reason for Visit
                    </label>
                    <Input 
                      type="text" 
                      placeholder="e.g., Annual checkup, vaccination..."
                      defaultValue={selectedAppointment.reason || ''}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Additional notes..."
                      defaultValue={selectedAppointment.notes || ''}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditMode(false)}
                  type="button"
                >
                  Cancel Edit
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            /* VIEW MODE - Read-only display */
            <div className="space-y-6">
              {/* Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold">{selectedAppointment.appointment_number}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedAppointment.appointment_date)} at {formatTime(selectedAppointment.appointment_time)}
                  </p>
                </div>
                <Badge variant={statusColors[selectedAppointment.status as keyof typeof statusColors] || 'default'}>
                  {selectedAppointment.status}
                </Badge>
              </div>

              {/* Pet & Owner Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">🐾 Pet Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">{selectedAppointment.pet?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Species / Breed</p>
                      <p className="text-sm">{selectedAppointment.pet?.species} • {selectedAppointment.pet?.breed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pet ID</p>
                      <p className="text-xs font-mono">{selectedAppointment.pet_platform_id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">👤 Owner Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold">
                        {selectedAppointment.owner 
                          ? `${selectedAppointment.owner.first_name} ${selectedAppointment.owner.last_name}`
                          : 'Unknown'}
                      </p>
                    </div>
                    {selectedAppointment.owner?.email && (
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm">{selectedAppointment.owner.email}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Owner ID</p>
                      <p className="text-xs font-mono">{selectedAppointment.owner_user_platform_id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">📋 Appointment Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm capitalize">{selectedAppointment.appointment_type || 'routine'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm">{selectedAppointment.duration_minutes || 30} minutes</p>
                  </div>
                  {selectedAppointment.doctor && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Doctor</p>
                      <p className="text-sm">{selectedAppointment.doctor.first_name} {selectedAppointment.doctor.last_name}</p>
                    </div>
                  )}
                  {selectedAppointment.reason && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Reason</p>
                      <p className="text-sm">{selectedAppointment.reason}</p>
                    </div>
                  )}
                  {selectedAppointment.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* EMR Status */}
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">🔐 EMR Access Status</h4>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">OTP Status</p>
                    {selectedAppointment.emr_otp_verified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : selectedAppointment.emr_otp_code ? (
                      <Badge variant="warning">Pending</Badge>
                    ) : (
                      <Badge variant="default">Not Sent</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Write Access</p>
                    {selectedAppointment.emr_write_access_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">Inactive</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewEditModalOpen(false);
                    setSelectedAppointment(null);
                  }}
                >
                  Close
                </Button>
                {(selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'confirmed') && (
                  <Button onClick={() => setIsEditMode(true)}>
                    Edit Appointment
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
      </div>
    </PageWrapper>
  );
}
