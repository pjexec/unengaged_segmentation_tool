
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/partner/login') // Admin uses same login flow
    }

    // Hardcoded Admin Check for now (or move to DB/Env)
    const ADMIN_EMAIL = 'chuck.mullaney@gmail.com'

    if (session.user.email !== ADMIN_EMAIL) {
        return (
            <div className="flex min-h-screen items-center justify-center p-8 bg-zinc-950 text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-500">403 Forbidden</h1>
                    <p className="mt-4 text-zinc-400">You do not have permission to access the admin area.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-100">
            <nav className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="font-bold tracking-tight">UAI Admin</div>
                <div className="text-xs text-zinc-500">{session.user.email}</div>
            </nav>
            <main className="p-6">
                {children}
            </main>
        </div>
    )
}
