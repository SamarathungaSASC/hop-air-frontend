import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useCurrentUser } from '../context/AuthContext'

const ROLE_COLORS = {
  SUPERADMIN: 'bg-purple-600',
  EDUCATOR:   'bg-blue-600',
  CLINICIAN:  'bg-teal-600',
  TRAINEE:    'bg-green-600',
}

export default function Navbar({ title }) {
  const { logout } = useAuth0()
  const { currentUser } = useCurrentUser()

  return (
    <nav className="bg-hopair-navy border-b border-slate-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black tracking-tight">
          HOP <span className="text-hopair-cyan italic">Air</span>
        </span>
        {title && (
          <span className="text-slate-400 text-sm hidden sm:inline">/ {title}</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {currentUser && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{currentUser.fullName || currentUser.email}</p>
              <p className="text-xs text-slate-400">{currentUser.agencyName}</p>
            </div>
            <span className={`badge text-white ${ROLE_COLORS[currentUser.role] || 'bg-slate-600'}`}>
              {currentUser.role}
            </span>
          </>
        )}
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
