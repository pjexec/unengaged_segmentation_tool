
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-service'

export async function POST(request: Request) {
    try {
        const supabase = createServiceClient()

        const body = await request.json()
        const { eventType, ref, visitorId, asset, partnerId } = body

        console.log('[Track API] Received:', { eventType, ref, visitorId, asset, partnerId })

        if (!eventType) {
            return NextResponse.json({ error: 'Missing eventType' }, { status: 400 })
        }

        if (!visitorId) {
            return NextResponse.json({ error: 'Missing visitorId' }, { status: 400 })
        }

        // 1. Identify Partner from referral key
        let targetPartnerId = partnerId
        const targetRef = ref

        if (!targetPartnerId && targetRef) {
            const { data: partner, error: partnerError } = await supabase
                .from('partners')
                .select('id, referral_key')
                .eq('referral_key', targetRef)
                .single()

            if (partnerError) {
                console.log('[Track API] Partner lookup failed:', partnerError.message, '- ref:', targetRef)
            }

            if (partner) {
                targetPartnerId = partner.id
                console.log('[Track API] Found partner:', targetPartnerId)
            } else {
                console.log('[Track API] No partner found for ref:', targetRef)
            }
        }

        // 2. Create/Update Visitor FIRST (only if we found a valid partner with this ref)
        let visitorCreated = false
        if (visitorId && targetRef && targetPartnerId) {
            const { error: visitorError } = await supabase
                .from('visitors')
                .upsert({
                    id: visitorId,
                    referral_key: targetRef,
                    first_seen: new Date().toISOString(),
                    last_seen: new Date().toISOString()
                }, {
                    onConflict: 'id',
                    ignoreDuplicates: false
                })

            if (visitorError) {
                console.error('[Track API] Visitor upsert error:', visitorError.message)
            } else {
                console.log('[Track API] Visitor upserted:', visitorId)
                visitorCreated = true
            }
        }

        // 3. Insert Event (without visitor_id FK to avoid constraint issues)
        // We store visitor_id as a simple string, not FK
        const { error: eventError } = await supabase
            .from('events')
            .insert({
                event_type: eventType,
                partner_id: targetPartnerId || null,
                asset: asset || null,
                // Only link visitor if it was successfully created
                visitor_id: visitorCreated ? visitorId : null,
            })

        if (eventError) {
            console.error('[Track API] Event insert error:', eventError.message)
            return NextResponse.json({ error: 'Failed to track event', details: eventError.message }, { status: 500 })
        }

        console.log('[Track API] Event logged:', eventType, 'partner:', targetPartnerId)

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[Track API] Error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
