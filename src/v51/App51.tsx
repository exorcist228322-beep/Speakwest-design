import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './v51.css'
import { me, studentById, teacher } from './data'
import { Choose, Login } from './Auth'
import { LessonPage } from './Lesson'
import { Shell } from './ui'
import { TeacherHome } from './teacher/Home'
import { StudentRoom, TeacherStudents } from './teacher/Students'
import { TeacherCourse, TeacherCourses } from './teacher/Courses'
import { TeacherHomework, TeacherReview } from './teacher/Homework'
import { TeacherLive } from './teacher/Live'
import { TeacherSettings } from './teacher/Settings'
import { StudentCourse, StudentCourses, StudentHome, StudentHomework, StudentRewards } from './student/Pages'

/** Layout 5.1: the live edu.speakwest.tech look. Teacher at /teacher, student at /student, sign-in at /login. */
export function App51() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="choose" element={<Choose />} />
      <Route
        path="teacher"
        element={
          <Shell role="teacher" name={teacher.name}>
            <Outlet />
          </Shell>
        }
      >
        <Route index element={<TeacherHome />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="students/:studentId" element={<StudentRoom />} />
        <Route path="courses" element={<TeacherCourses />} />
        <Route path="courses/:courseId" element={<TeacherCourse />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage role="teacher" />} />
        <Route path="homework" element={<TeacherHomework />} />
        <Route path="review/:homeworkId" element={<TeacherReview />} />
        <Route path="live/:lessonId" element={<TeacherLive />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>
      <Route
        path="student"
        element={
          <Shell role="student" name={studentById(me.studentId).name}>
            <Outlet />
          </Shell>
        }
      >
        <Route index element={<StudentHome />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="courses/:courseId" element={<StudentCourse />} />
        <Route path="courses/:courseId/lessons/:lessonId" element={<LessonPage role="student" />} />
        <Route path="homework" element={<StudentHomework />} />
        <Route path="rewards" element={<StudentRewards />} />
      </Route>
      <Route path="*" element={<Navigate to="/teacher" replace />} />
    </Routes>
  )
}
