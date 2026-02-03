
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button' // You might need to verify this exists or use standard HTML
import { Copy, DollarSign, Users, MousePointerClick, FileCheck, ExternalLink } from 'lucide-react'
import { Partner, Conversion, Payout } from '@/types/partner'

// Force dynamic to ensure we check auth every time
export const dynamic = 'force-dynamic'

export default async function PartnerDashboard() {
    const supabase = await createClient()

    // 1. Auth Check
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/partner/login')
    }

    // 2. Fetch Partner Data
    // Note: This query relies on RLS policies allowing the user to read their own row,
    // OR the user being able to read partners table. 
    // Ideally: .eq('email', session.user.email)
    const { data: partner, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('email', session.user.email)
        .single()

    // Fetch App Config
    const { data: configData } = await supabase
        .from('app_config')
        .select('*')

    const getConfig = (key: string, defaultVal: string) => {
        return configData?.find(c => c.key === key)?.value || defaultVal
    }

    if (partnerError || !partner) {
        // If RLS blocks or not found
        return (
            <div className="flex h-screen flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2 text-zinc-600">
                    We couldn't find a partner account linked to <strong>{session.user.email}</strong>.
                </p>
                <p className="mt-4 text-sm text-zinc-500 max-w-md mx-auto">
                    If you received a magic link, please ensure you are using the email address registered with our partner program.
                    If this persists, contact support.
                </p>
            </div>
        )
    }

    const typedPartner = partner as Partner

    // 3. Fetch Stats (Aggregated)
    // Calls to sync/async helpers or multiple queries
    // For V1 MVP, we query counts directly.

    /* Visits */
    const { count: visitsCount } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true })
        .eq('referral_key', typedPartner.referral_key)

    /* Events (approx activity) */
    // e.g. tool_generated
    const { count: toolGens } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', typedPartner.id)
        .eq('event_type', 'tool_generated')

    /* Conversions */
    const { data: conversionsRaw } = await supabase
        .from('conversions')
        .select('*')
        .eq('partner_id', typedPartner.id)
        .order('created_at', { ascending: false })

    const conversions = (conversionsRaw || []) as Conversion[]

    const totalCommission = conversions
        .filter(c => c.status !== 'pending') // or maybe include pending? prompt says "Earned" usually implies approved.
        // Prompt: "Total commission earned"
        // Let's sum approved+paid
        .reduce((acc, curr) => {
            return (curr.status === 'approved' || curr.status === 'paid')
                ? acc + Number(curr.commission_amount)
                : acc
        }, 0)

    const unpaidBalance = conversions
        .filter(c => c.status === 'approved')
        .reduce((acc, curr) => acc + Number(curr.commission_amount), 0)

    /* Payouts */
    const { data: payoutsRaw } = await supabase
        .from('payouts')
        .select('*')
        .eq('partner_id', typedPartner.id)
        .order('sent_at', { ascending: false })

    const payouts = (payoutsRaw || []) as Payout[]

    // Helper for Referral Link
    // Should probably come from ENV or headers, using placeholder for now
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'
    const referralLink = `${baseUrl}?ref=${typedPartner.referral_key}`

    // Attribution Rules
    const attributionRulesString = getConfig('attribution_rules', '[]');
    let attributionRules: string[] = [];
    try {
        const parsedRules = JSON.parse(attributionRulesString);
        if (Array.isArray(parsedRules)) {
            attributionRules = parsedRules;
        } else {
            console.warn("Attribution rules from config are not an array:", parsedRules);
            // Fallback to default if not an array
            attributionRules = [
                "<strong>First-touch attribution:</strong> You get credit if you are the first partner to refer a visitor.",
                "<strong>Window:</strong> 365 days. We track them for a full year.",
                "<strong>Cross-offer:</strong> Attribution applies to both DFY services and SaaS subscriptions.",
                "<strong>Disputes:</strong> Manual resolution during beta period. Contact support with questions."
            ];
        }
    } catch (e) {
        console.error("Failed to parse attribution rules from config:", e);
        // Fallback to default on parse error
        attributionRules = [
            "<strong>First-touch attribution:</strong> You get credit if you are the first partner to refer a visitor.",
            "<strong>Window:</strong> 365 days. We track them for a full year.",
            "<strong>Cross-offer:</strong> Attribution applies to both DFY services and SaaS subscriptions.",
            "<strong>Disputes:</strong> Manual resolution during beta period. Contact support with questions."
        ];
    }


    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-zinc-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                        P
                    </div>
                    <span className="font-semibold text-zinc-800">{getConfig('dashboard_title', 'Partner Dashboard')}</span>
                </div>
                <div className="text-sm text-zinc-500">
                    Logged in as <span className="text-zinc-900 font-medium">{typedPartner.name}</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

                {/* SECTION 1: Overview */}
                <section className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-medium text-zinc-900">{getConfig('dashboard_subtitle', 'Your Referral Link')}</h2>
                        <p className="text-sm text-zinc-500">Share this link to track attribution (365-day cookie).</p>
                    </div>
                    <div className="flex w-full md:w-auto items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg p-2 px-3">
                        <code className="text-sm text-blue-600 font-mono break-all line-clamp-1">
                            {referralLink}
                        </code>
                        {/* We'll implement a client component for Copy if needed or just use simple button */}
                        {/* For SSR simplicity, we might need a small client wrapper for 'copy to clipboard' 
                or just let user select it. Let's assume standard copy interaction for V1. */}
                    </div>
                </section>

                {/* SECTION 2: Performance Summary */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Visits"
                        value={visitsCount || 0}
                        icon={<Users className="h-4 w-4 text-zinc-500" />}
                    />
                    <StatsCard
                        title="Tool Usage"
                        value={toolGens || 0}
                        icon={<MousePointerClick className="h-4 w-4 text-zinc-500" />}
                        sub="Generations"
                    />
                    <StatsCard
                        title="Comm. Earned"
                        value={`$${totalCommission.toFixed(2)}`}
                        icon={<DollarSign className="h-4 w-4 text-green-600" />}
                        highlight
                    />
                    <StatsCard
                        title="Unpaid Balance"
                        value={`$${unpaidBalance.toFixed(2)}`}
                        icon={<FileCheck className="h-4 w-4 text-blue-600" />}
                    />
                </section>

                {/* SECTION 3: Conversion Log */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Conversion Log</h3>
                    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                                    <tr>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Event / Offer</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {conversions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-5 py-8 text-center text-zinc-500 italic">
                                                No conversions recorded yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        conversions.map((conv) => (
                                            <tr key={conv.id} className="hover:bg-zinc-50/50">
                                                <td className="px-5 py-3 text-zinc-600">
                                                    {new Date(conv.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-3 font-medium text-zinc-900">
                                                    {conv.offer_type === 'dfy' ? 'DFY Service' : 'SaaS Subscription'}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <StatusBadge status={conv.status} />
                                                </td>
                                                <td className="px-5 py-3 text-right font-mono text-zinc-700">
                                                    ${Number(conv.commission_amount).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: Payout History */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Payout History</h3>
                    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                                    <tr>
                                        <th className="px-5 py-3">Date Sent</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {payouts.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-5 py-8 text-center text-zinc-500 italic">
                                                No payouts yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        payouts.map((payout) => (
                                            <tr key={payout.id}>
                                                <td className="px-5 py-3 text-zinc-600">
                                                    {payout.sent_at ? new Date(payout.sent_at).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        {payout.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-right font-mono text-zinc-900">
                                                    ${Number(payout.amount).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* SECTION 5: Attribution Rules */}
                <section className="bg-zinc-100/50 rounded-xl p-6 border border-zinc-200 text-sm text-zinc-600 space-y-2">
                    <h4 className="font-semibold text-zinc-800 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" /> Attribution Rules
                    </h4>
                    <p className="whitespace-pre-line">{getConfig('attribution_rules', 'First-touch attribution. 365-day window.')}</p>
                </section>

            </main>
        </div>
    )
}

// Sub-components for cleaner file (could be separate files)

function StatsCard({ title, value, icon, sub, highlight }: { title: string, value: string | number, icon: React.ReactNode, sub?: string, highlight?: boolean }) {
    return (
        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between ${highlight ? 'bg-white border-green-200 ring-1 ring-green-100' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-500 text-sm font-medium">{title}</span>
                {icon}
            </div>
            <div>
                <div className={`text-2xl font-bold ${highlight ? 'text-green-700' : 'text-zinc-900'}`}>{value}</div>
                {sub && <div className="text-xs text-zinc-400 mt-1">{sub}</div>}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        approved: 'bg-blue-50 text-blue-700 border-blue-100',
        paid: 'bg-green-50 text-green-700 border-green-100',
    }[status] || 'bg-gray-100 text-gray-700'

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} capitalize`}>
            {status}
        </span>
    )
}
