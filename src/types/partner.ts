
export interface Partner {
    id: string
    name: string
    email: string
    referral_key: string
    status: 'active' | 'paused'
    commission_dfy_percent?: number
    commission_saas_percent?: number
    created_at: string
}

export interface Visitor {
    id: string
    referral_key: string
    first_seen: string
    last_seen: string
}

export interface Event {
    id: string
    visitor_id: string
    partner_id: string
    event_type: string
    asset?: string
    created_at: string
}

export interface Conversion {
    id: string
    visitor_id: string
    partner_id: string
    offer_type: 'dfy' | 'saas'
    status: 'pending' | 'approved' | 'paid'
    commission_amount: number
    created_at: string
}

export interface Payout {
    id: string
    partner_id: string
    amount: number
    status: 'pending' | 'sent'
    sent_at?: string
}

export interface AppConfig {
    key: string
    value: string
    description: string
}
