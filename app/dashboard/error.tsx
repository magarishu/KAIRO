'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard Boundary Caught Error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">Database Connection Failed</h2>
      <p className="text-[#888888] max-w-lg mx-auto mb-8 font-mono text-xs uppercase tracking-widest leading-relaxed">
        The Kairo dashboard could not retrieve your data. This is typically caused by the underlying database instance being paused or unreachable. Please verify your Supabase instance status and try again.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-8 py-4 rounded-md transition-all font-bold uppercase tracking-widest text-xs border border-red-500/20"
      >
        <RefreshCcw className="w-4 h-4" />
        Reinitialize Systems
      </button>
    </div>
  )
}
