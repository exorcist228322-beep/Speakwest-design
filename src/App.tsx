import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { UiPrefsProvider, useUiPrefs } from './context/UiPrefs'
import { Achievements } from './pages/Achievements'
import { Classes } from './pages/Classes'
import { CourseDetail } from './pages/CourseDetail'
import { Courses } from './pages/Courses'
import { Home } from './pages/Home'
import { Homework } from './pages/Homework'
import { Lesson } from './pages/Lesson'
import { Review } from './pages/Review'
import { Schedule } from './pages/Schedule'
import { Settings } from './pages/Settings'
import { Students } from './pages/Students'
import { App51 } from './v51/App51'

export default function App() {
  return (
    <UiPrefsProvider>
      <BrowserRouter>
        <VersionRoutes />
      </BrowserRouter>
    </UiPrefsProvider>
  )
}

function VersionRoutes() {
  const { version } = useUiPrefs()

  if (version === 'v51') return <App51 />

  return (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId" element={<CourseDetail />} />
            <Route path="courses/:courseId/lessons/:lessonId" element={<Lesson />} />
            <Route path="students" element={<Students />} />
            <Route path="review" element={<Review />} />
            <Route path="settings" element={<Settings />} />
            <Route path="classes" element={<Classes />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="homework" element={<Homework />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
  )
}
