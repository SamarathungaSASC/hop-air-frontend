import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0()

  return (
    <div className="min-h-screen bg-hopair-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tight mb-2">
            HOP <span className="text-hopair-cyan italic">Air</span>
          </h1>
          <p className="text-slate-400 text-sm">Educational & Clinical Training Platform</p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-hopair-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-hopair-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3zm6 8a6 6 0 10-12 0" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">
            Sign in with your organisational email to access your dashboard.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            disabled={isLoading}
            className="btn-primary w-full text-base py-3"
          >
            {isLoading ? 'Redirecting...' : 'Sign In with Auth0'}
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Access is provisioned by your agency administrator.
        </p>
      </div>
    </div>
  )
}
