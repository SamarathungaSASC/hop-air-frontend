import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Modal from '../../components/Modal'
import { getAgencies, createAgency, getBranches, createBranch, getUsers, createUser } from '../../api/client'

export default function SuperadminDashboard() {
  const [agencies, setAgencies]     = useState([])
  const [selected, setSelected]     = useState(null) // selected agency
  const [branches, setBranches]     = useState([])
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState('branches')

  // Modals
  const [showAgencyModal,  setShowAgencyModal]  = useState(false)
  const [showBranchModal,  setShowBranchModal]  = useState(false)
  const [showUserModal,    setShowUserModal]    = useState(false)

  // Forms
  const [agencyForm,  setAgencyForm]  = useState({ name: '', educatorEmail: '' })
  const [branchForm,  setBranchForm]  = useState({ name: '', ccn: '' })
  const [userForm,    setUserForm]    = useState({ email: '', fullName: '', role: 'EDUCATOR', branchId: '' })
  const [submitting,  setSubmitting]  = useState(false)
  const [formError,   setFormError]   = useState('')

  useEffect(() => {
    getAgencies().then(setAgencies).finally(() => setLoading(false))
  }, [])

  async function selectAgency(agency) {
    setSelected(agency)
    setActiveTab('branches')
    const [b, u] = await Promise.all([getBranches(agency.id), getUsers(agency.id)])
    setBranches(b)
    setUsers(u)
  }

  async function handleCreateAgency(e) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    try {
      const a = await createAgency(agencyForm)
      setAgencies(prev => [...prev, a])
      setShowAgencyModal(false)
      setAgencyForm({ name: '', educatorEmail: '' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create agency')
    } finally { setSubmitting(false) }
  }

  async function handleCreateBranch(e) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    try {
      const b = await createBranch(selected.id, branchForm)
      setBranches(prev => [...prev, b])
      setShowBranchModal(false)
      setBranchForm({ name: '', ccn: '' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create branch')
    } finally { setSubmitting(false) }
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    try {
      const payload = { ...userForm, branchId: userForm.branchId ? Number(userForm.branchId) : null }
      const u = await createUser(selected.id, payload)
      setUsers(prev => [...prev, u])
      setShowUserModal(false)
      setUserForm({ email: '', fullName: '', role: 'EDUCATOR', branchId: '' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add user')
    } finally { setSubmitting(false) }
  }

  const ROLE_BADGE = {
    SUPERADMIN: 'bg-purple-700 text-purple-100',
    EDUCATOR:   'bg-blue-700 text-blue-100',
    CLINICIAN:  'bg-teal-700 text-teal-100',
    TRAINEE:    'bg-green-700 text-green-100',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Superadmin" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — agencies */}
        <aside className="w-72 bg-hopair-navy border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">Agencies</h2>
            <button onClick={() => { setShowAgencyModal(true); setFormError('') }} className="btn-primary text-xs py-1 px-3">
              + New
            </button>
          </div>
          {loading ? (
            <p className="p-4 text-slate-500 text-sm">Loading...</p>
          ) : agencies.length === 0 ? (
            <p className="p-4 text-slate-500 text-sm">No agencies yet.</p>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {agencies.map(a => (
                <li key={a.id}>
                  <button
                    onClick={() => selectAgency(a)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700 transition-colors border-l-4 ${
                      selected?.id === a.id ? 'border-hopair-blue bg-slate-700/50 text-white' : 'border-transparent text-slate-300'
                    }`}
                  >
                    {a.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p>Select an agency to manage it</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{selected.name}</h1>
                <div className="flex gap-2">
                  <button onClick={() => { setShowBranchModal(true); setFormError('') }} className="btn-secondary text-sm">
                    + Branch
                  </button>
                  <button onClick={() => { setShowUserModal(true); setFormError('') }} className="btn-primary text-sm">
                    + User
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-hopair-dark p-1 rounded-lg w-fit">
                {['branches', 'users'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                      activeTab === tab ? 'bg-hopair-blue text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab} ({tab === 'branches' ? branches.length : users.length})
                  </button>
                ))}
              </div>

              {activeTab === 'branches' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {branches.length === 0 && <p className="text-slate-500 text-sm col-span-3">No branches yet.</p>}
                  {branches.map(b => (
                    <div key={b.id} className="card">
                      <h3 className="font-bold mb-1">{b.name}</h3>
                      <p className="text-xs text-hopair-cyan font-mono">{b.ccn}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-sm">
                    <thead className="bg-hopair-dark text-slate-400 uppercase text-xs">
                      <tr>
                        {['Name', 'Email', 'Role', 'Branch'].map(h => (
                          <th key={h} className="px-4 py-3 text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {users.length === 0 && (
                        <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No users yet.</td></tr>
                      )}
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{u.fullName || '—'}</td>
                          <td className="px-4 py-3 text-slate-300">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{u.branchName || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Create Agency Modal */}
      {showAgencyModal && (
        <Modal title="Create Agency" onClose={() => setShowAgencyModal(false)}>
          <form onSubmit={handleCreateAgency} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{formError}</p>}
            <div>
              <label className="label">Agency Name</label>
              <input className="input" value={agencyForm.name}
                onChange={e => setAgencyForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Primary Educator Email</label>
              <input className="input" type="email" value={agencyForm.educatorEmail}
                onChange={e => setAgencyForm(p => ({ ...p, educatorEmail: e.target.value }))} required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Creating...' : 'Create Agency'}
              </button>
              <button type="button" onClick={() => setShowAgencyModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Branch Modal */}
      {showBranchModal && (
        <Modal title="Create Branch" onClose={() => setShowBranchModal(false)}>
          <form onSubmit={handleCreateBranch} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{formError}</p>}
            <div>
              <label className="label">Branch Name</label>
              <input className="input" value={branchForm.name}
                onChange={e => setBranchForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">CCN (unique identifier)</label>
              <input className="input font-mono" value={branchForm.ccn}
                onChange={e => setBranchForm(p => ({ ...p, ccn: e.target.value }))} required />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Creating...' : 'Create Branch'}
              </button>
              <button type="button" onClick={() => setShowBranchModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <Modal title="Add User" onClose={() => setShowUserModal(false)}>
          <form onSubmit={handleCreateUser} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{formError}</p>}
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={userForm.fullName}
                onChange={e => setUserForm(p => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={userForm.email}
                onChange={e => setUserForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={userForm.role}
                onChange={e => setUserForm(p => ({ ...p, role: e.target.value }))}>
                <option value="EDUCATOR">EDUCATOR</option>
                <option value="CLINICIAN">CLINICIAN</option>
                <option value="TRAINEE">TRAINEE</option>
              </select>
            </div>
            {(userForm.role === 'CLINICIAN' || userForm.role === 'TRAINEE') && (
              <div>
                <label className="label">Branch <span className="text-red-400">*</span></label>
                <select className="input" value={userForm.branchId}
                  onChange={e => setUserForm(p => ({ ...p, branchId: e.target.value }))} required>
                  <option value="">Select a branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.ccn})</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Adding...' : 'Add User'}
              </button>
              <button type="button" onClick={() => setShowUserModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
