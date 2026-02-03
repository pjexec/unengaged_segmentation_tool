
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
                .select('id')
                .eq('referral_key', targetRef)
                .single()

            if (partnerError) {
                console.log('[Track API] Partner lookup failed:', partnerError.message)
            }

            if (partner) {
                targetPartnerId = partner.id
                console.log('[Track API] Found partner:', targetPartnerId)
            }
        }

        // 2. Create/Update Visitor FIRST (before event, due to foreign key)
        if (visitorId && targetRef) {
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
                console.error('[Track API] Visitor upsert error:', visitorError)
                // Don't fail - visitor might exist with different ref, just log it
            } else {
                console.log('[Track API] Visitor upserted:', visitorId)
            }
        }

        // 3. Insert Event (with or without visitor_id depending on whether visitor exists)
        const eventData: Record<string, any> = {
            event_type: eventType,
            partner_id: targetPartnerId || null,
            asset: asset || null,
        }

        // Only add visitor_id if we have a ref (visitor was created)
        if (visitorId && targetRef) {
            eventData.visitor_id = visitorId
        }

        const { error: eventError } = await supabase
            .from('events')
            .insert(eventData)

        if (eventError) {
            console.error('[Track API] Event insert error:', eventError)
            // Don't return error - event logging is best-effort
        } else {
            console.log('[Track API] Event logged:', eventType)
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('[Track API] Error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
