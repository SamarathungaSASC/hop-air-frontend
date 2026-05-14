import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import VideoPlayer from '../components/VideoPlayer'
import { useCurrentUser } from '../context/AuthContext'
import { getCourses, getLessons } from '../api/client'

export default function StaffDashboard() {
  const { currentUser } = useCurrentUser()
  const [courses, setCourses]           = useState([])
  const [selectedCourse, setSelected]   = useState(null)
  const [lessons, setLessons]           = useState([])
  const [selectedLesson, setSelLesson]  = useState(null)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    getCourses().then(setCourses).finally(() => setLoading(false))
  }, [])

  async function selectCourse(course) {
    setSelected(course)
    setSelLesson(null)
    const l = await getLessons(course.id)
    setLessons(l)
  }

  const isClinician = currentUser.role === 'CLINICIAN'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title={isClinician ? 'Clinician' : 'Trainee'} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-hopair-navy border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-bold text-sm uppercase tracking-widest text-slate-400">My Courses</h2>
            <p className="text-xs text-slate-500 mt-1">{currentUser.branchName}</p>
          </div>
          {loading ? (
            <p className="p-4 text-slate-500 text-sm">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="p-4 text-slate-500 text-sm">No courses assigned to you yet.</p>
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
                    <p className="text-xs text-slate-400 mt-0.5">{c.branchName}</p>
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
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Select a course to start learning</p>
            </div>
          ) : !selectedLesson ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{selectedCourse.name}</h1>
                {selectedCourse.description && (
                  <p className="text-slate-400 mt-2">{selectedCourse.description}</p>
                )}
              </div>

              {lessons.length === 0 ? (
                <div className="card text-center py-12 text-slate-500">No lessons available yet.</div>
              ) : (
                <div className="space-y-3">
                  {lessons.sort((a, b) => a.position - b.position).map((l, idx) => (
                    <div
                      key={l.id}
                      onClick={() => setSelLesson(l)}
                      className="card cursor-pointer hover:border-hopair-blue transition-colors flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-hopair-blue/20 text-hopair-blue flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{l.title}</p>
                      </div>
                      <div className="flex items-center gap-1 text-hopair-cyan text-sm">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>
              <button onClick={() => setSelLesson(null)} className="btn-secondary text-sm mb-6 flex items-center gap-2">
                ← Back to lessons
              </button>
              <h2 className="text-xl font-bold mb-4">{selectedLesson.title}</h2>
              <VideoPlayer url={selectedLesson.videoUrl} title={selectedLesson.title} />

              {/* Lesson navigation */}
              {lessons.length > 1 && (
                <div className="flex justify-between mt-6">
                  {(() => {
                    const sorted = [...lessons].sort((a, b) => a.position - b.position)
                    const idx = sorted.findIndex(l => l.id === selectedLesson.id)
                    return (
                      <>
                        <button
                          disabled={idx === 0}
                          onClick={() => setSelLesson(sorted[idx - 1])}
                          className="btn-secondary disabled:opacity-30"
                        >
                          ← Previous
                        </button>
                        <button
                          disabled={idx === sorted.length - 1}
                          onClick={() => setSelLesson(sorted[idx + 1])}
                          className="btn-primary disabled:opacity-30"
                        >
                          Next →
                        </button>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
