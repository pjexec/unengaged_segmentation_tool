
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // We don't strictly require session for tracking (public endpoint), 
    // but we might want to rate limit or check CORS.
    // For now, open endpoint.

    try {
        const body = await request.json()
        const { eventType, ref, visitorId, asset, partnerId } = body

        if (!eventType) {
            return NextResponse.json({ error: 'Missing eventType' }, { status: 400 })
        }

        // 1. Identify Partner
        let targetPartnerId = partnerId
        let targetRef = ref

        if (!targetPartnerId && targetRef) {
            const { data: partner } = await supabase
                .from('partners')
                .select('id')
                .eq('referral_key', targetRef)
                .single()

            if (partner) {
                targetPartnerId = partner.id
            }
        }

        // If no partner found for ref, we might still track event if just for analytics, 
        // but requirements say "Attribution + Conversion stats". 
        // If we can't link to a partner, it's just general traffic.
        // We'll proceed but partner_id might be null.

        // 2. Handle Visitor
        // If it's a 'tool_viewed' (first touch) and we have a ref, ensure visitor exists or create
        // In V1 prompt: "Visitors table: id (anonymous visitor id), referral_key..."
        // We assume the client sends a generated visitorId (e.g. from localstorage)

        // Insert Event
        const { error: eventError } = await supabase
            .from('events')
            .insert({
                event_type: eventType,
                visitor_id: visitorId, // assumed UUID sent by client
                partner_id: targetPartnerId,
                asset: asset,
            })

        if (eventError) {
            console.error('Event tracking error:', eventError)
            return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
        }

        // 3. Handle specific logic (e.g. creating Visitor record if not exists)
        // For efficiency, we might just insert into 'visitors' on 'tool_viewed' with ON CONFLICT DO NOTHING
        // using the visitorId.
        // However, Supabase/Postgres simple insert:
        if (eventType === 'tool_viewed' && visitorId && targetRef) {
            await supabase.from('visitors').upsert({
                id: visitorId,
                referral_key: targetRef,
                last_seen: new Date().toISOString()
            }, { onConflict: 'id' })
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        console.error('Tracking API error:', e)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
