import React from 'react'

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-hopair-dark flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-hopair-blue border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  )
}
