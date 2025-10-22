import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    service: 'Furfield HMS API',
    version: '1.0.0',
    modules: {
      core: {
        name: 'Core Module',
        endpoints: ['/api/core/appointments', '/api/core/consultations', '/api/core/billing'],
        description: 'Outpatient, Billing, Appointments, Records, Consultation'
      },
      inpatient: {
        name: 'Inpatient Module',
        endpoints: ['/api/inpatient/admissions', '/api/inpatient/wards', '/api/inpatient/beds'],
        description: 'Admissions, Wards, Bed Management'
      },
      'operation-theater': {
        name: 'Operation Theater Module',
        endpoints: ['/api/operation-theater/procedures', '/api/operation-theater/theaters', '/api/operation-theater/anesthesia'],
        description: 'Surgery, Procedures, Anesthesia'
      },
      pharmacy: {
        name: 'Pharmacy Module',
        endpoints: ['/api/pharmacy/prescriptions', '/api/pharmacy/inventory', '/api/pharmacy/suppliers'],
        description: 'Medicines, Inventory, Prescriptions'
      },
      diagnostics: {
        name: 'Diagnostics Module',
        endpoints: ['/api/diagnostics/orders', '/api/diagnostics/tests', '/api/diagnostics/results'],
        description: 'Lab Tests, Imaging, Results'
      }
    },
    database: {
      provider: 'Supabase PostgreSQL',
      tables: '140+',
      schema: 'public'
    },
    authentication: 'Managed by ff_auth service (not implemented here)'
  })
}
