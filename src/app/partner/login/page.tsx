
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PartnerLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            console.log('[Login] Starting auth request...')
            const supabase = createClient()

            // Add timeout to prevent infinite spinner
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Login request timed out. Please check your connection.')), 10000)
            })

            const authPromise = supabase.auth.signInWithPassword({
                email,
                password,
            })

            const { error } = await Promise.race([authPromise, timeoutPromise]) as Awaited<typeof authPromise>

            console.log('[Login] Auth response received:', error ? error.message : 'success')

            if (error) {
                setError(error.message)
                setLoading(false)
            } else {
                router.push('/partner/dashboard')
                router.refresh()
                // Loading will remain true during redirect
            }
        } catch (err) {
            console.error('[Login] Error:', err)
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-200 bg-white p-10 shadow-sm">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Partner Dashboard</h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Login with your email and password.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-700">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="bg-white text-zinc-900 border-zinc-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-zinc-700">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="bg-white text-zinc-900 border-zinc-300"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-100">
                            <AlertCircle className="h-4 w-4" />
                            <p>{error}</p>
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
