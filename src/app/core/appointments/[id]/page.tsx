'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { 
  useAppointmentWithDetails,
  useCancelAppointment,
  useStartConsultation,
  useEndConsultation,
  useSendOTPToOwner,
  useVerifyEMROTP,
  useRevokeEMRAccess
} from '@/hooks/useDatabase';
import { format } from 'date-fns';

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const { data: appointment, isLoading, error } = useAppointmentWithDetails(appointmentId);
  const cancelAppointment = useCancelAppointment();
  const startConsultation = useStartConsultation();
  const endConsultation = useEndConsultation();
  const sendOTPToOwner = useSendOTPToOwner();
  const verifyEMROTP = useVerifyEMROTP();
  const revokeEMRAccess = useRevokeEMRAccess();

  const [otpCode, setOTPCode] = React.useState('');
  const [showOTPInput, setShowOTPInput] = React.useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'N/A';
    return format(new Date(dateTimeString), 'MMM dd, yyyy h:mm a');
  };

  const handleSendOTP = () => {
    sendOTPToOwner.mutate(appointmentId, {
      onSuccess: () => {
        alert('✅ OTP sent to owner successfully!');
      },
      onError: (error) => {
        console.error('Failed to send OTP:', error);
        alert('❌ Failed to send OTP. Please try again.');
      }
    });
  };

  const handleVerifyOTP = () => {
    if (otpCode.trim().length !== 6) {
      alert('Please enter a 6-digit OTP code');
      return;
    }

    verifyEMROTP.mutate(
      { appointmentId, otpCode: otpCode.trim() },
      {
        onSuccess: () => {
          setShowOTPInput(false);
          setOTPCode('');
          alert('✅ OTP verified successfully! EMR access is now ready.');
        },
        onError: (error) => {
          console.error('OTP verification failed:', error);
          alert('❌ Invalid OTP code. Please try again.');
        }
      }
    );
  };

  const handleStartConsultation = () => {
    startConsultation.mutate(appointmentId, {
      onSuccess: () => {
        alert('✅ Consultation started successfully! EMR access granted.');
      },
      onError: (error) => {
        console.error('Failed to start consultation:', error);
        alert('❌ Failed to start consultation. Please try again.');
      }
    });
  };

  const handleEndConsultation = () => {
    if (confirm('Are you sure you want to complete this consultation?')) {
      endConsultation.mutate(appointmentId, {
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

  const handleCancelAppointment = () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment.mutate(appointmentId, {
        onSuccess: () => {
          alert('✅ Appointment cancelled successfully!');
          router.push('/core/appointments');
        },
        onError: (error) => {
          console.error('Failed to cancel appointment:', error);
          alert('❌ Failed to cancel appointment. Please try again.');
        }
      });
    }
  };

  const handleRevokeAccess = () => {
    if (confirm('Are you sure you want to revoke EMR access? This action cannot be undone.')) {
      const reason = prompt('Enter reason for revoking access:');
      if (reason) {
        revokeEMRAccess.mutate(
          { appointmentId, revokedBy: 'current_user', reason },
          {
            onSuccess: () => {
              alert('✅ EMR access revoked successfully.');
            },
            onError: (error) => {
              console.error('Failed to revoke access:', error);
              alert('❌ Failed to revoke access. Please try again.');
            }
          }
        );
      }
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading appointment details...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-danger">
              <p className="text-lg font-semibold">Failed to load appointment</p>
              <p className="text-sm mt-2">{error.message}</p>
              <Button onClick={() => router.push('/core/appointments')} className="mt-4">
                Back to Appointments
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  if (!appointment) {
    return (
      <PageWrapper>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold">Appointment not found</p>
              <Button onClick={() => router.push('/core/appointments')} className="mt-4">
                Back to Appointments
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    );
  }

  const statusColors = {
    scheduled: 'default',
    confirmed: 'info',
    'in-progress': 'warning',
    completed: 'success',
    cancelled: 'danger',
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={() => router.push('/core/appointments')} className="mb-2">
              ← Back to Appointments
            </Button>
            <h1 className="text-3xl font-bold">Appointment Details</h1>
            <p className="text-muted-foreground font-mono">{appointment.appointment_number}</p>
          </div>
          <Badge variant={(statusColors[appointment.status as keyof typeof statusColors] || 'default') as any} className="text-lg px-4 py-2">
            {appointment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pet & Owner Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pet Information */}
            <Card>
              <CardHeader>
                <CardTitle>🐾 Pet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">{appointment.pet?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pet ID</p>
                    <p className="font-mono text-sm">{appointment.pet_platform_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Species</p>
                    <p>{appointment.pet?.species || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Breed</p>
                    <p>{appointment.pet?.breed || 'N/A'}</p>
                  </div>
                  {appointment.pet?.age && (
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p>{appointment.pet.age}</p>
                    </div>
                  )}
                  {appointment.pet?.gender && (
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="capitalize">{appointment.pet.gender}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle>👤 Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-semibold">
                      {appointment.owner 
                        ? `${appointment.owner.first_name} ${appointment.owner.last_name}`
                        : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner ID</p>
                    <p className="font-mono text-sm">{appointment.owner_user_platform_id}</p>
                  </div>
                  {appointment.owner?.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{appointment.owner.email}</p>
                    </div>
                  )}
                  {appointment.owner?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{appointment.owner.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appointment Details */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-lg">{formatDate(appointment.appointment_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-lg">{formatTime(appointment.appointment_time)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="capitalize">{appointment.appointment_type || 'routine'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p>{appointment.duration_minutes || 30} minutes</p>
                  </div>
                  {appointment.doctor && (
                    <div>
                      <p className="text-sm text-muted-foreground">Doctor</p>
                      <p>{appointment.doctor.first_name} {appointment.doctor.last_name}</p>
                    </div>
                  )}
                  {appointment.reason && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Reason</p>
                      <p>{appointment.reason}</p>
                    </div>
                  )}
                  {appointment.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & EMR Status */}
          <div className="space-y-6">
            {/* EMR Access Status */}
            <Card>
              <CardHeader>
                <CardTitle>🔐 EMR Access Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">OTP Status</span>
                    {appointment.emr_otp_verified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : appointment.emr_otp_code ? (
                      <Badge variant="warning">Pending</Badge>
                    ) : (
                      <Badge variant="default">Not Sent</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Write Access</span>
                    {appointment.emr_write_access_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">Inactive</Badge>
                    )}
                  </div>

                  {appointment.emr_access_revoked && (
                    <div className="p-3 bg-danger/10 border border-danger rounded-lg">
                      <p className="text-sm font-semibold text-danger">Access Revoked</p>
                      {appointment.emr_revocation_reason && (
                        <p className="text-xs mt-1">{appointment.emr_revocation_reason}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* EMR Timeline */}
                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm font-semibold">Timeline</p>
                  {appointment.emr_otp_sent_at && (
                    <div className="text-xs">
                      <p className="text-muted-foreground">OTP Sent</p>
                      <p>{formatDateTime(appointment.emr_otp_sent_at)}</p>
                    </div>
                  )}
                  {appointment.emr_otp_verified_at && (
                    <div className="text-xs mt-2">
                      <p className="text-muted-foreground">OTP Verified</p>
                      <p>{formatDateTime(appointment.emr_otp_verified_at)}</p>
                    </div>
                  )}
                  {appointment.emr_write_access_started_at && (
                    <div className="text-xs mt-2">
                      <p className="text-muted-foreground">Consultation Started</p>
                      <p>{formatDateTime(appointment.emr_write_access_started_at)}</p>
                    </div>
                  )}
                  {appointment.emr_write_access_ended_at && (
                    <div className="text-xs mt-2">
                      <p className="text-muted-foreground">Consultation Ended</p>
                      <p>{formatDateTime(appointment.emr_write_access_ended_at)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>⚡ Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Send OTP */}
                {appointment.status === 'scheduled' && !appointment.emr_otp_code && (
                  <Button 
                    onClick={handleSendOTP}
                    disabled={sendOTPToOwner.isPending}
                    className="w-full"
                  >
                    📧 {sendOTPToOwner.isPending ? 'Sending...' : 'Send OTP to Owner'}
                  </Button>
                )}

                {/* Verify OTP */}
                {appointment.emr_otp_code && !appointment.emr_otp_verified && (
                  <div className="space-y-2">
                    {!showOTPInput ? (
                      <Button 
                        onClick={() => setShowOTPInput(true)}
                        className="w-full"
                      >
                        🔑 Verify OTP
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otpCode}
                          onChange={(e) => setOTPCode(e.target.value)}
                          maxLength={6}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleVerifyOTP}
                            disabled={verifyEMROTP.isPending || otpCode.length !== 6}
                            className="flex-1"
                          >
                            {verifyEMROTP.isPending ? 'Verifying...' : 'Verify'}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setShowOTPInput(false);
                              setOTPCode('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Start Consultation */}
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && 
                 appointment.emr_otp_verified && !appointment.emr_write_access_active && (
                  <Button 
                    onClick={handleStartConsultation}
                    disabled={startConsultation.isPending}
                    className="w-full"
                  >
                    ▶️ {startConsultation.isPending ? 'Starting...' : 'Start Consultation'}
                  </Button>
                )}

                {/* Complete Consultation */}
                {appointment.status === 'in-progress' && appointment.emr_write_access_active && (
                  <Button 
                    onClick={handleEndConsultation}
                    disabled={endConsultation.isPending}
                    className="w-full"
                  >
                    ✅ {endConsultation.isPending ? 'Completing...' : 'Complete Consultation'}
                  </Button>
                )}

                {/* Cancel Appointment */}
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                  <Button 
                    onClick={handleCancelAppointment}
                    disabled={cancelAppointment.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    ❌ {cancelAppointment.isPending ? 'Cancelling...' : 'Cancel Appointment'}
                  </Button>
                )}

                {/* Revoke Access */}
                {appointment.emr_write_access_active && !appointment.emr_access_revoked && (
                  <Button 
                    onClick={handleRevokeAccess}
                    disabled={revokeEMRAccess.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    🚫 {revokeEMRAccess.isPending ? 'Revoking...' : 'Revoke EMR Access'}
                  </Button>
                )}

                {/* Edit Appointment */}
                {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                  <Button 
                    onClick={() => alert('Edit functionality coming soon!')}
                    className="w-full"
                    variant="outline"
                  >
                    ✏️ Edit Appointment
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>ℹ️ Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{formatDateTime(appointment.created_at)}</p>
                </div>
                {appointment.updated_at && (
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p>{formatDateTime(appointment.updated_at)}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Entity ID</p>
                  <p className="font-mono">{appointment.entity_platform_id}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
