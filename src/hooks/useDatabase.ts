/**
 * React Query Hooks for Supabase Data
 * Uses @tanstack/react-query for caching and state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  Profile,
  ProfileWithRoles,
  PlatformRole,
  UserToRoleAssignment,
  PetMaster,
  PetWithOwner,
  PetSpecies,
  PetBreed,
  Organization,
  BillingRecord,
  BillingInvoice,
  BillingPayment,
  EMRRecordsMaster,
  EMRCatalogOfAssets,
  HospitalAppointment,
  AppointmentWithDetails,
  HospitalPetEMRAccess,
} from '@/types/database'

// ============================================
// PROFILES & USERS
// ============================================

/**
 * Get current user profile
 */
export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data as Profile
    },
    enabled: !!userId,
  })
}

/**
 * Get profile by platform ID
 */
export function useProfileByPlatformId(platformId?: string) {
  return useQuery({
    queryKey: ['profile', 'platform', platformId],
    queryFn: async () => {
      if (!platformId) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_platform_id', platformId)
        .single()
      
      if (error) throw error
      return data as Profile
    },
    enabled: !!platformId,
  })
}

/**
 * Get profile with roles
 */
export function useProfileWithRoles(userId?: string) {
  return useQuery({
    queryKey: ['profile', 'roles', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (profileError) throw profileError
      
      const { data: roleAssignments, error: rolesError } = await supabase
        .from('user_to_role_assignment')
        .select(`
          *,
          role:platform_roles(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
      
      if (rolesError) throw rolesError
      
      return {
        ...profile,
        roles: roleAssignments,
      } as ProfileWithRoles
    },
    enabled: !!userId,
  })
}

/**
 * Update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Profile> }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Profile
    },
    onSuccess: (data: Profile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['profile', 'platform', data.user_platform_id] })
    },
  })
}

// ============================================
// ROLES & PERMISSIONS
// ============================================

/**
 * Get all platform roles
 */
export function usePlatformRoles() {
  return useQuery({
    queryKey: ['platform-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_roles')
        .select('*')
        .eq('is_active', true)
        .order('privilege_level', { ascending: true })
      
      if (error) throw error
      return data as PlatformRole[]
    },
  })
}

/**
 * Get user role assignments
 */
export function useUserRoles(userId?: string) {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('user_to_role_assignment')
        .select(`
          *,
          role:platform_roles(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
      
      if (error) throw error
      return data as (UserToRoleAssignment & { role: PlatformRole })[]
    },
    enabled: !!userId,
  })
}

// ============================================
// PETS
// ============================================

/**
 * Get all pets for a user
 */
export function usePets(userPlatformId?: string) {
  return useQuery({
    queryKey: ['pets', userPlatformId],
    queryFn: async () => {
      if (!userPlatformId) return []
      
      const { data, error } = await supabase
        .from('pet_master')
        .select('*')
        .eq('user_platform_id', userPlatformId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as PetMaster[]
    },
    enabled: !!userPlatformId,
  })
}

/**
 * Get single pet by ID
 */
export function usePet(petId?: string) {
  return useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => {
      if (!petId) return null
      
      const { data, error } = await supabase
        .from('pet_master')
        .select('*')
        .eq('id', petId)
        .single()
      
      if (error) throw error
      return data as PetMaster
    },
    enabled: !!petId,
  })
}

/**
 * Get pet by platform ID
 */
export function usePetByPlatformId(petPlatformId?: string) {
  return useQuery({
    queryKey: ['pet', 'platform', petPlatformId],
    queryFn: async () => {
      if (!petPlatformId) return null
      
      const { data, error } = await supabase
        .from('pet_master')
        .select('*')
        .eq('pet_platform_id', petPlatformId)
        .single()
      
      if (error) throw error
      return data as PetMaster
    },
    enabled: !!petPlatformId,
  })
}

/**
 * Create new pet
 */
export function useCreatePet() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newPet: Omit<PetMaster, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('pet_master')
        .insert(newPet)
        .select()
        .single()
      
      if (error) throw error
      return data as PetMaster
    },
    onSuccess: (data: PetMaster) => {
      queryClient.invalidateQueries({ queryKey: ['pets', data.user_platform_id] })
    },
  })
}

/**
 * Update pet
 */
export function useUpdatePet() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PetMaster> }) => {
      const { data, error } = await supabase
        .from('pet_master')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as PetMaster
    },
    onSuccess: (data: PetMaster) => {
      queryClient.invalidateQueries({ queryKey: ['pet', data.id] })
      queryClient.invalidateQueries({ queryKey: ['pets', data.user_platform_id] })
    },
  })
}

/**
 * Delete pet (soft delete)
 */
export function useDeletePet() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (petId: string) => {
      const { data, error } = await supabase
        .from('pet_master')
        .update({ is_active: false })
        .eq('id', petId)
        .select()
        .single()
      
      if (error) throw error
      return data as PetMaster
    },
    onSuccess: (data: PetMaster) => {
      queryClient.invalidateQueries({ queryKey: ['pets', data.user_platform_id] })
    },
  })
}

// ============================================
// PET SPECIES & BREEDS
// ============================================

/**
 * Get all pet species
 */
export function usePetSpecies() {
  return useQuery({
    queryKey: ['pet-species'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pet_species')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data as PetSpecies[]
    },
  })
}

/**
 * Get breeds for a species
 */
export function usePetBreeds(speciesId?: string) {
  return useQuery({
    queryKey: ['pet-breeds', speciesId],
    queryFn: async () => {
      if (!speciesId) return []
      
      const { data, error } = await supabase
        .from('pet_breeds')
        .select('*')
        .eq('species_id', speciesId)
        .eq('is_active', true)
        .order('name', { ascending: true })
      
      if (error) throw error
      return data as PetBreed[]
    },
    enabled: !!speciesId,
  })
}

// ============================================
// ORGANIZATIONS
// ============================================

/**
 * Get organization by ID
 */
export function useOrganization(orgId?: string) {
  return useQuery({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      if (!orgId) return null
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single()
      
      if (error) throw error
      return data as Organization
    },
    enabled: !!orgId,
  })
}

/**
 * Get organizations for a user (via ownership/management)
 */
export function useUserOrganizations(userPlatformId?: string) {
  return useQuery({
    queryKey: ['organizations', 'user', userPlatformId],
    queryFn: async () => {
      if (!userPlatformId) return []
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .or(`owner_platform_id.eq.${userPlatformId},manager_platform_id.eq.${userPlatformId}`)
        .eq('is_active', 'true')
        .order('organization_name', { ascending: true })
      
      if (error) throw error
      return data as Organization[]
    },
    enabled: !!userPlatformId,
  })
}

// ============================================
// BILLING
// ============================================

/**
 * Get billing records for a hospital
 */
export function useBillingRecords(hospitalId?: string, filters?: { status?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ['billing-records', hospitalId, filters],
    queryFn: async () => {
      if (!hospitalId) return []
      
      let query = supabase
        .from('billing_records')
        .select('*')
        .eq('hospital_id', hospitalId)
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      
      if (filters?.dateFrom) {
        query = query.gte('billing_date', filters.dateFrom)
      }
      
      if (filters?.dateTo) {
        query = query.lte('billing_date', filters.dateTo)
      }
      
      query = query.order('billing_date', { ascending: false })
      
      const { data, error } = await query
      
      if (error) throw error
      return data as BillingRecord[]
    },
    enabled: !!hospitalId,
  })
}

/**
 * Get invoices for a hospital
 */
export function useInvoices(hospitalId?: string, status?: string) {
  return useQuery({
    queryKey: ['invoices', hospitalId, status],
    queryFn: async () => {
      if (!hospitalId) return []
      
      let query = supabase
        .from('billing_invoices')
        .select('*')
        .eq('hospital_id', hospitalId)
      
      if (status) {
        query = query.eq('status', status)
      }
      
      query = query.order('issue_date', { ascending: false })
      
      const { data, error } = await query
      
      if (error) throw error
      return data as BillingInvoice[]
    },
    enabled: !!hospitalId,
  })
}

/**
 * Create billing record
 */
export function useCreateBillingRecord() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (record: Omit<BillingRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('billing_records')
        .insert(record)
        .select()
        .single()
      
      if (error) throw error
      return data as BillingRecord
    },
    onSuccess: (data: BillingRecord) => {
      queryClient.invalidateQueries({ queryKey: ['billing-records', data.hospital_id] })
    },
  })
}

// ============================================
// EMR (ELECTRONIC MEDICAL RECORDS)
// ============================================

/**
 * Get EMR records for a pet
 */
export function useEMRRecords(petPlatformId?: string, assetCode?: string) {
  return useQuery({
    queryKey: ['emr-records', petPlatformId, assetCode],
    queryFn: async () => {
      if (!petPlatformId) return []
      
      let query = supabase
        .from('emr_records_master')
        .select('*')
        .eq('pet_platform_id', petPlatformId)
        .eq('is_active', true)
      
      if (assetCode) {
        query = query.eq('emr_asset_code', assetCode)
      }
      
      query = query.order('created_at', { ascending: false })
      
      const { data, error } = await query
      
      if (error) throw error
      return data as EMRRecordsMaster[]
    },
    enabled: !!petPlatformId,
  })
}

/**
 * Get EMR catalog of assets
 */
export function useEMRCatalog(category?: string) {
  return useQuery({
    queryKey: ['emr-catalog', category],
    queryFn: async () => {
      let query = supabase
        .from('emr_catalog_of_assets')
        .select('*')
      
      if (category) {
        query = query.eq('emr_asset_category', category)
      }
      
      query = query.order('emr_asset_category', { ascending: true })
      
      const { data, error } = await query
      
      if (error) throw error
      return data as EMRCatalogOfAssets[]
    },
  })
}

/**
 * Create EMR record
 */
export function useCreateEMRRecord() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (record: Omit<EMRRecordsMaster, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('emr_records_master')
        .insert(record)
        .select()
        .single()
      
      if (error) throw error
      return data as EMRRecordsMaster
    },
    onSuccess: (data: EMRRecordsMaster) => {
      queryClient.invalidateQueries({ queryKey: ['emr-records', data.pet_platform_id] })
    },
  })
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to pet changes
 */
export function useRealtimePets(userPlatformId?: string) {
  const queryClient = useQueryClient()
  
  useQuery({
    queryKey: ['realtime-pets', userPlatformId],
    queryFn: async () => {
      if (!userPlatformId) return null
      
      const channel = supabase
        .channel('pet-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pet_master',
            filter: `user_platform_id=eq.${userPlatformId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['pets', userPlatformId] })
          }
        )
        .subscribe()
      
      return () => {
        supabase.removeChannel(channel)
      }
    },
    enabled: !!userPlatformId,
  })
}

// ============================================
// APPOINTMENTS & EMR ACCESS CONTROL
// ============================================

/**
 * Fetch all appointments with optional filters
 */
export function useAppointments(filters?: {
  entityPlatformId?: string
  ownerUserPlatformId?: string
  petPlatformId?: string
  status?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      let query = supabase
        .from('hospitals_appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (filters?.entityPlatformId) {
        query = query.eq('entity_platform_id', filters.entityPlatformId)
      }
      if (filters?.ownerUserPlatformId) {
        query = query.eq('owner_user_platform_id', filters.ownerUserPlatformId)
      }
      if (filters?.petPlatformId) {
        query = query.eq('pet_platform_id', filters.petPlatformId)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.startDate) {
        query = query.gte('appointment_date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('appointment_date', filters.endDate)
      }

      const { data, error } = await query

      if (error) throw error
      return data as HospitalAppointment[]
    },
  })
}

/**
 * Fetch appointments with related details (pet, owner, doctor)
 * Useful for list views where you need to display names instead of IDs
 */
export function useAppointmentsWithDetails(filters?: {
  entityPlatformId?: string
  ownerUserPlatformId?: string
  petPlatformId?: string
  status?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['appointments-with-details', filters],
    queryFn: async () => {
      // First fetch appointments
      let query = supabase
        .from('hospitals_appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true })

      if (filters?.entityPlatformId) {
        query = query.eq('entity_platform_id', filters.entityPlatformId)
      }
      if (filters?.ownerUserPlatformId) {
        query = query.eq('owner_user_platform_id', filters.ownerUserPlatformId)
      }
      if (filters?.petPlatformId) {
        query = query.eq('pet_platform_id', filters.petPlatformId)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.startDate) {
        query = query.gte('appointment_date', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('appointment_date', filters.endDate)
      }

      const { data: appointments, error } = await query
      if (error) throw error
      if (!appointments || appointments.length === 0) return []

      // Get unique platform IDs
      const petPlatformIds = [...new Set(appointments.map(a => a.pet_platform_id))]
      const ownerPlatformIds = [...new Set(appointments.map(a => a.owner_user_platform_id))]
      const doctorPlatformIds = [...new Set(appointments.map(a => a.doctor_user_platform_id).filter(Boolean))]

      // Fetch related data in parallel
      const [petsResult, ownersResult, doctorsResult] = await Promise.all([
        supabase.from('pet_master').select('*').in('pet_platform_id', petPlatformIds),
        supabase.from('profiles').select('*').in('user_platform_id', ownerPlatformIds),
        doctorPlatformIds.length > 0 
          ? supabase.from('profiles').select('*').in('user_platform_id', doctorPlatformIds)
          : Promise.resolve({ data: [], error: null }),
      ])

      // Create lookup maps
      const petsMap = new Map((petsResult.data || []).map(p => [p.pet_platform_id, p]))
      const ownersMap = new Map((ownersResult.data || []).map(o => [o.user_platform_id, o]))
      const doctorsMap = new Map((doctorsResult.data || []).map(d => [d.user_platform_id, d]))

      // Combine data
      return appointments.map(appointment => ({
        ...appointment,
        pet: petsMap.get(appointment.pet_platform_id),
        owner: ownersMap.get(appointment.owner_user_platform_id),
        doctor: appointment.doctor_user_platform_id 
          ? doctorsMap.get(appointment.doctor_user_platform_id)
          : undefined,
      })) as AppointmentWithDetails[]
    },
  })
}

/**
 * Fetch single appointment by ID
```

/**
 * Fetch single appointment by ID
 */
export function useAppointment(id: string | undefined) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) throw new Error('Appointment ID is required')

      const { data, error } = await supabase
        .from('hospitals_appointments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    enabled: !!id,
  })
}

/**
 * Fetch appointment with related details (pet, owner, doctor)
 */
export function useAppointmentWithDetails(id: string | undefined) {
  return useQuery({
    queryKey: ['appointment-details', id],
    queryFn: async () => {
      if (!id) throw new Error('Appointment ID is required')

      // Fetch appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('hospitals_appointments')
        .select('*')
        .eq('id', id)
        .single()

      if (appointmentError) throw appointmentError

      // Fetch related data in parallel using platform_id
      const [petResult, ownerResult, doctorResult] = await Promise.all([
        supabase.from('pet_master').select('*').eq('pet_platform_id', appointment.pet_platform_id).single(),
        supabase.from('profiles').select('*').eq('user_platform_id', appointment.owner_user_platform_id).single(),
        appointment.doctor_user_platform_id
          ? supabase.from('profiles').select('*').eq('user_platform_id', appointment.doctor_user_platform_id).single()
          : Promise.resolve({ data: null, error: null }),
      ])

      return {
        ...appointment,
        pet: petResult.data || undefined,
        owner: ownerResult.data || undefined,
        doctor: doctorResult.data || undefined,
      } as AppointmentWithDetails
    },
    enabled: !!id,
  })
}

/**
 * Create new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointment: Omit<HospitalAppointment, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .insert(appointment)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

/**
 * Update appointment
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<HospitalAppointment> }) => {
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
    },
  })
}

/**
 * Cancel appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
    },
  })
}

/**
 * Fetch EMR access summary for a pet (from view)
 * Shows which entities have access to this pet's records
 */
export function usePetEMRAccess(petPlatformId: string | undefined) {
  return useQuery({
    queryKey: ['pet-emr-access', petPlatformId],
    queryFn: async () => {
      if (!petPlatformId) throw new Error('Pet platform ID is required')

      const { data, error } = await supabase
        .from('hospital_pet_emr_access')
        .select('*')
        .eq('pet_platform_id', petPlatformId)
        .eq('is_revoked', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as HospitalPetEMRAccess[]
    },
    enabled: !!petPlatformId,
  })
}

/**
 * Generate OTP for EMR access (Owner self-service)
 * Owner generates OTP when booking their own appointment
 */
export function useGenerateEMROTP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({
          emr_otp_code: otp,
          emr_otp_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          emr_access_granted: true,
          emr_otp_sent_to_owner: false, // Owner generated it themselves
        })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
    },
  })
}

/**
 * Send OTP to pet owner (Hospital staff use case)
 * Used when hospital books appointment on behalf of owner (phone/walkin)
 * System generates OTP and sends it to owner via SMS/email
 */
export function useSendOTPToOwner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({
          emr_otp_code: otp,
          emr_otp_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          emr_access_granted: true,
          emr_otp_sent_to_owner: true, // System sent OTP to owner
          emr_otp_sent_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      
      // TODO: Integrate with SMS/Email service to send OTP to owner
      // This would call your notification service with owner's contact info
      // await sendSMS(data.owner_id, `Your EMR access OTP is: ${otp}`)
      // await sendEmail(data.owner_id, 'EMR Access OTP', `Your code is: ${otp}`)
      
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
    },
  })
}

/**
 * Verify OTP and activate EMR access
 */
export function useVerifyEMROTP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ appointmentId, otpCode }: { appointmentId: string; otpCode: string }) => {
      // First fetch appointment to verify OTP
      const { data: appointment, error: fetchError } = await supabase
        .from('hospitals_appointments')
        .select('*')
        .eq('id', appointmentId)
        .single()

      if (fetchError) throw fetchError
      if (appointment.emr_otp_code !== otpCode) {
        throw new Error('Invalid OTP code')
      }
      
      // Check if OTP expired
      if (appointment.emr_otp_expires_at && new Date(appointment.emr_otp_expires_at) < new Date()) {
        throw new Error('OTP has expired')
      }

      // Update to verified and grant read access
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({
          emr_otp_verified: true,
          emr_otp_verified_at: new Date().toISOString(),
          emr_read_access_granted_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
      queryClient.invalidateQueries({ queryKey: ['pet-emr-access', data.pet_platform_id] })
    },
  })
}

/**
 * Start write access for consultation
 */
export function useStartConsultation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({
          status: 'in-progress',
          emr_write_access_active: true,
          emr_write_access_started_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
    },
  })
}

/**
 * End consultation and revoke write access
 */
export function useEndConsultation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({
          status: 'completed',
          emr_write_access_active: false,
          emr_write_access_ended_at: new Date().toISOString(),
        })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
    },
  })
}

/**
 * Revoke all EMR access for an appointment
 */
export function useRevokeEMRAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      appointmentId, 
      revokedBy, 
      reason 
    }: { 
      appointmentId: string
      revokedBy: string
      reason?: string 
    }) => {
      const { data, error } = await supabase
        .from('hospitals_appointments')
        .update({
          emr_access_revoked: true,
          emr_access_revoked_at: new Date().toISOString(),
          emr_access_revoked_by: revokedBy,
          emr_revocation_reason: reason,
          emr_write_access_active: false,
        })
        .eq('id', appointmentId)
        .select()
        .single()

      if (error) throw error
      return data as HospitalAppointment
    },
    onSuccess: (data: HospitalAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointment', data.id] })
      queryClient.invalidateQueries({ queryKey: ['pet-emr-access', data.pet_platform_id] })
    },
  })
}

/**
 * Subscribe to real-time changes for appointments
 */
export function useRealtimeAppointments(entityPlatformId?: string) {
  const queryClient = useQueryClient()
  
  useQuery({
    queryKey: ['realtime-appointments', entityPlatformId],
    queryFn: async () => {
      if (!entityPlatformId) return null
      
      const channel = supabase
        .channel('appointments-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'hospitals_appointments',
            filter: `entity_platform_id=eq.${entityPlatformId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
          }
        )
        .subscribe()
      
      return () => {
        supabase.removeChannel(channel)
      }
    },
    enabled: !!entityPlatformId,
  })
}
