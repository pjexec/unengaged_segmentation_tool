
'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase'
import { Partner } from '@/types/partner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Loader2, ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PartnerStats {
    visits: number
    conversions: number
    totalEarned: number
}

export default function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)

    const [partner, setPartner] = useState<Partner | null>(null)
    const [stats, setStats] = useState<PartnerStats>({ visits: 0, conversions: 0, totalEarned: 0 })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<Partner>>({})

    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Fetch partner
            const { data: partnerData, error: partnerError } = await supabase
                .from('partners')
                .select('*')
                .eq('id', id)
                .single()

            if (partnerError || !partnerData) {
                alert('Error fetching partner')
                router.push('/admin/dashboard')
                return
            }

            setPartner(partnerData)
            setFormData(partnerData)

            // Fetch stats
            const referralKey = partnerData.referral_key

            // Visits count
            const { count: visitsCount } = await supabase
                .from('visitors')
                .select('*', { count: 'exact', head: true })
                .eq('referral_key', referralKey)

            // Conversions count
            const { data: conversionsData } = await supabase
                .from('conversions')
                .select('commission_amount, status')
                .eq('partner_id', id)

            const conversions = conversionsData || []
            const conversionsCount = conversions.length
            const totalEarned = conversions
                .filter(c => c.status === 'approved' || c.status === 'paid')
                .reduce((acc, c) => acc + Number(c.commission_amount), 0)

            setStats({
                visits: visitsCount || 0,
                conversions: conversionsCount,
                totalEarned
            })

            setLoading(false)
        }

        fetchData()
    }, [id, router])

    const handleSave = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('partners')
            .update({
                name: formData.name,
                email: formData.email,
                referral_key: formData.referral_key,
                status: formData.status,
                commission_dfy_percent: formData.commission_dfy_percent,
                commission_saas_percent: formData.commission_saas_percent
            })
            .eq('id', id)

        if (error) {
            alert(`Error saving: ${error.message}`)
        }
        setSaving(false)
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-zinc-400" /></div>
    if (!partner) return <div>Partner not found</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">{partner.name}</h1>
                    <p className="text-zinc-500 text-sm">Partner Profile & Settings</p>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">

                {/* LEFT COLUMN: EDIT FORM */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                            <CardDescription>Basic information and login details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    value={formData.email || ''}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="ref">Referral Key</Label>
                                    <Input
                                        id="ref"
                                        value={formData.referral_key || ''}
                                        onChange={e => setFormData({ ...formData, referral_key: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        className="flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.status || 'active'}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'paused' })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Commission Rates</CardTitle>
                            <CardDescription>Override default commission percentages for this partner.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="dfy_comm">DFY Commission (%)</Label>
                                    <div className="relative">
                                        <Input
                                            id="dfy_comm"
                                            type="number"
                                            placeholder="Default"
                                            value={formData.commission_dfy_percent || ''}
                                            onChange={e => setFormData({ ...formData, commission_dfy_percent: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        />
                                        <span className="absolute right-3 top-2.5 text-zinc-400 text-sm">%</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">Leave empty to use global default.</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="saas_comm">SaaS Commission (%)</Label>
                                    <div className="relative">
                                        <Input
                                            id="saas_comm"
                                            type="number"
                                            placeholder="Default"
                                            value={formData.commission_saas_percent || ''}
                                            onChange={e => setFormData({ ...formData, commission_saas_percent: e.target.value ? parseFloat(e.target.value) : undefined })}
                                        />
                                        <span className="absolute right-3 top-2.5 text-zinc-400 text-sm">%</span>
                                    </div>
                                    <p className="text-xs text-zinc-500">Leave empty to use global default.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* RIGHT COLUMN: STATS */}
                <div className="space-y-6">
                    <Card className="bg-zinc-50 border-zinc-200">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-zinc-500 uppercase">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-2xl font-bold text-zinc-900">${stats.totalEarned.toFixed(2)}</div>
                                <div className="text-xs text-zinc-500">Total Commissions Earned</div>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-lg font-semibold text-zinc-900">{stats.visits}</div>
                                    <div className="text-xs text-zinc-500">Visits</div>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-zinc-900">{stats.conversions}</div>
                                    <div className="text-xs text-zinc-500">Conversions</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
