import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/core/consultations - List consultation/SOAP notes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get('hospital_id')
    const petId = searchParams.get('pet_id')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseAdmin
      .from('hospitals_soap_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId)
    }

    if (petId) {
      query = query.eq('pet_id', petId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/core/consultations - Create SOAP note
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
      .from('hospitals_soap_notes')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
