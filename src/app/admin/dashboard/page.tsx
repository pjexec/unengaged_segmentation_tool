
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Partner, AppConfig } from '@/types/partner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Loader2, Save, Users, Type, RefreshCw } from 'lucide-react'

export default function AdminDashboard() {
    const [partners, setPartners] = useState<Partner[]>([])
    const [config, setConfig] = useState<AppConfig[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null) // ID of item being saved

    const supabase = createClient()

    const fetchData = async () => {
        setLoading(true)
        // Fetch Partners
        const { data: partnersData } = await supabase
            .from('partners')
            .select('*')
            .order('created_at', { ascending: false })

        // Fetch Config
        const { data: configData } = await supabase
            .from('app_config')
            .select('*')
            .order('key')

        if (partnersData) setPartners(partnersData)
        if (configData) setConfig(configData)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    // --- Handlers ---

    const handleUpdatePartner = async (partnerId: string, updates: Partial<Partner>) => {
        setSaving(partnerId)
        const { error } = await supabase
            .from('partners')
            .update(updates)
            .eq('id', partnerId)

        if (!error) {
            setPartners(partners.map(p => p.id === partnerId ? { ...p, ...updates } : p))
        } else {
            alert(`Error updating partner: ${error.message}`)
        }
        setSaving(null)
    }

    const handleUpdateConfig = async (key: string, value: string) => {
        setSaving(key)
        const { error } = await supabase
            .from('app_config')
            .update({ value })
            .eq('key', key)

        if (!error) {
            setConfig(config.map(c => c.key === key ? { ...c, value } : c))
        } else {
            alert(`Error updating config: ${error.message}`)
        }
        setSaving(null)
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10">

            {/* 1. CMS / CONFIG SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-zinc-500" />
                    <h2 className="text-xl font-semibold text-zinc-900">Dashboard Content (CMS)</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {config.map((item) => (
                        <Card key={item.key}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                                    {item.key.replace('_', ' ')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-xs text-zinc-500">{item.description}</p>
                                <div className="flex gap-2">
                                    <Input
                                        defaultValue={item.value}
                                        onChange={(e) => {
                                            // Optimistic update for UI input only? No, local state handles array. 
                                            // We'll trust the user to hit save. 
                                            // But for React controlled inputs logic, usually we prefer controlled state.
                                            // For Admin MVP, uncurated defaultValue is fine but let's wire it up properly if we want 'Save' button to work with current ref value.
                                            // Actually, let's just use onBlur or a specific Save button pattern.
                                        }}
                                        id={`input-${item.key}`}
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            const val = (document.getElementById(`input-${item.key}`) as HTMLInputElement).value
                                            handleUpdateConfig(item.key, val)
                                        }}
                                        disabled={saving === item.key}
                                    >
                                        {saving === item.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 2. PARTNER MANAGEMENT SECTION */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-zinc-500" />
                    <h2 className="text-xl font-semibold text-zinc-900">Partner Management</h2>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-medium">
                                <tr>
                                    <th className="px-5 py-3">Partner</th>
                                    <th className="px-5 py-3">Referral Key</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 w-32">DFY %</th>
                                    <th className="px-5 py-3 w-32">SaaS %</th>
                                    <th className="px-5 py-3 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {partners.map(partner => (
                                    <tr key={partner.id} className="hover:bg-zinc-50/50 group cursor-pointer" onClick={() => window.location.href = `/admin/partners/${partner.id}`}>
                                        <td className="px-5 py-3">
                                            <div className="font-medium text-blue-600 hover:underline">{partner.name}</div>
                                            <div className="text-xs text-zinc-500">{partner.email}</div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 border border-zinc-200">
                                                {partner.referral_key}
                                            </code>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${partner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {partner.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-zinc-600">
                                            {partner.commission_dfy_percent ? `${partner.commission_dfy_percent}%` : <span className="text-zinc-300">Default</span>}
                                        </td>
                                        <td className="px-5 py-3 text-zinc-600">
                                            {partner.commission_saas_percent ? `${partner.commission_saas_percent}%` : <span className="text-zinc-300">Default</span>}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {/* Action button? Maybe 'View' */}
                                            <Button size="sm" variant="ghost" className="text-zinc-400">View</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </div>
    )
}
