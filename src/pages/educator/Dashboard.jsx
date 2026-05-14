import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Modal from '../../components/Modal'
import VideoPlayer from '../../components/VideoPlayer'
import { useCurrentUser } from '../../context/AuthContext'
import {
  getCourses, createCourse,
  getLessons, createLesson,
  getBranches,
} from '../../api/client'

export default function EducatorDashboard() {
  const { currentUser } = useCurrentUser()
  const [courses, setCourses]         = useState([])
  const [branches, setBranches]       = useState([])
  const [selectedCourse, setSelected] = useState(null)
  const [lessons, setLessons]         = useState([])
  const [selectedLesson, setSelLesson]= useState(null)
  const [loading, setLoading]         = useState(true)

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [formError, setFormError]             = useState('')
  const [submitting, setSubmitting]           = useState(false)

  const [courseForm, setCourseForm] = useState({
    name: '', description: '', targetRole: 'CLINICIAN', branchId: ''
  })
  const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', position: '' })

  useEffect(() => {
    Promise.all([
      getCourses(),
      getBranches(currentUser.agencyId),
    ]).then(([c, b]) => {
      setCourses(c)
      setBranches(b)
    }).finally(() => setLoading(false))
  }, [currentUser.agencyId])

  async function selectCourse(course) {
    setSelected(course)
    setSelLesson(null)
    const l = await getLessons(course.id)
    setLessons(l)
  }

  async function handleCreateCourse(e) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    try {
      const payload = { ...courseForm, branchId: Number(courseForm.branchId) }
      const c = await createCourse(payload)
      setCourses(prev => [...prev, c])
      setShowCourseModal(false)
      setCourseForm({ name: '', description: '', targetRole: 'CLINICIAN', branchId: '' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create course')
    } finally { setSubmitting(false) }
  }

  async function handleCreateLesson(e) {
    e.preventDefault()
    setSubmitting(true); setFormError('')
    try {
      const payload = {
        ...lessonForm,
        position: lessonForm.position ? Number(lessonForm.position) : lessons.length + 1
      }
      const l = await createLesson(selectedCourse.id, payload)
      setLessons(prev => [...prev, l])
      setShowLessonModal(false)
      setLessonForm({ title: '', videoUrl: '', position: '' })
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add lesson')
    } finally { setSubmitting(false) }
  }

  const TARGET_COLORS = { CLINICIAN: 'text-teal-400', TRAINEE: 'text-green-400' }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Educator" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — courses */}
        <aside className="w-72 bg-hopair-navy border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">Courses</h2>
            <button onClick={() => { setShowCourseModal(true); setFormError('') }} className="btn-primary text-xs py-1 px-3">
              + New
            </button>
          </div>
          {loading ? (
            <p className="p-4 text-slate-500 text-sm">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="p-4 text-slate-500 text-sm">No courses yet.</p>
          ) : (
            <ul className="flex-1 overflow-y-auto">
              {courses.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => selectCourse(c)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors border-l-4 ${
                      selectedCourse?.id === c.id
                        ? 'border-hopair-blue bg-slate-700/50 text-white'
                        : 'border-transparent text-slate-300'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className={`text-xs mt-0.5 ${TARGET_COLORS[c.targetRole]}`}>
                      {c.targetRole} · {c.branchName}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedCourse ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>Select a course to manage lessons</p>
            </div>
          ) : !selectedLesson ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{selectedCourse.name}</h1>
                  <p className="text-slate-400 text-sm mt-1">{selectedCourse.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`badge bg-slate-700 ${TARGET_COLORS[selectedCourse.targetRole]}`}>
                      {selectedCourse.targetRole}
                    </span>
                    <span className="badge bg-slate-700 text-slate-300">{selectedCourse.branchName}</span>
                  </div>
                </div>
                <button onClick={() => { setShowLessonModal(true); setFormError('') }} className="btn-primary text-sm">
                  + Add Lesson
                </button>
              </div>

              {lessons.length === 0 ? (
                <div className="card text-center py-12 text-slate-500">
                  No lessons yet. Add the first one.
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.sort((a, b) => a.position - b.position).map((l, idx) => (
                    <div
                      key={l.id}
                      onClick={() => setSelLesson(l)}
                      className="card cursor-pointer hover:border-hopair-blue transition-colors flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-hopair-blue/20 text-hopair-blue flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{l.title}</p>
                        <p className="text-xs text-slate-400 truncate">{l.videoUrl || 'No video'}</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Video player view */
            <div>
              <button onClick={() => setSelLesson(null)} className="btn-secondary text-sm mb-6 flex items-center gap-2">
                ← Back to {selectedCourse.name}
              </button>
              <h2 className="text-xl font-bold mb-4">{selectedLesson.title}</h2>
              <VideoPlayer url={selectedLesson.videoUrl} title={selectedLesson.title} />
            </div>
          )}
        </main>
      </div>

      {/* Create Course Modal */}
      {showCourseModal && (
        <Modal title="Create Course" onClose={() => setShowCourseModal(false)}>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{formError}</p>}
            <div>
              <label className="label">Course Name</label>
              <input className="input" value={courseForm.name}
                onChange={e => setCourseForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input" rows={3} value={courseForm.description}
                onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Target Role</label>
              <select className="input" value={courseForm.targetRole}
                onChange={e => setCourseForm(p => ({ ...p, targetRole: e.target.value }))}>
                <option value="CLINICIAN">CLINICIAN</option>
                <option value="TRAINEE">TRAINEE</option>
              </select>
            </div>
            <div>
              <label className="label">Branch</label>
              <select className="input" value={courseForm.branchId}
                onChange={e => setCourseForm(p => ({ ...p, branchId: e.target.value }))} required>
                <option value="">Select a branch</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.ccn})</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Creating...' : 'Create Course'}
              </button>
              <button type="button" onClick={() => setShowCourseModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <Modal title="Add Lesson" onClose={() => setShowLessonModal(false)}>
          <form onSubmit={handleCreateLesson} className="space-y-4">
            {formError && <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">{formError}</p>}
            <div>
              <label className="label">Lesson Title</label>
              <input className="input" value={lessonForm.title}
                onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Video URL (YouTube or direct file URL)</label>
              <input className="input" placeholder="https://www.youtube.com/watch?v=..." value={lessonForm.videoUrl}
                onChange={e => setLessonForm(p => ({ ...p, videoUrl: e.target.value }))} />
            </div>
            <div>
              <label className="label">Position (order)</label>
              <input className="input" type="number" min={1} value={lessonForm.position}
                onChange={e => setLessonForm(p => ({ ...p, position: e.target.value }))}
                placeholder={`${lessons.length + 1}`} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Adding...' : 'Add Lesson'}
              </button>
              <button type="button" onClick={() => setShowLessonModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
