import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import CoverLetter from '../pages/CoverLetter'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'
import InterviewPrep from '../pages/InterviewPrep'
import JobMatcher from '../pages/JobMatcher'
import LinkedInBio from '../pages/LinkedInBio'
import ResumeRewriter from '../pages/ResumeRewriter'
import SkillGap from '../pages/SkillGap'
import ATSScore from '../pages/ATSScore'
import ResumeRoast from '../pages/ResumeRoast'



export default function AppRoutes() {
  const { state } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cover-letter"
          element={
            <ProtectedRoute>
              <CoverLetter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview-prep"
          element={
            <ProtectedRoute>
              <InterviewPrep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-matcher"
          element={
            <ProtectedRoute>
              <JobMatcher />
            </ProtectedRoute>
         }
        />
        <Route
          path="/linkedin-bio"
          element={
            <ProtectedRoute>
              <LinkedInBio />
          </ProtectedRoute>
       }
        />
        <Route
          path="/resume-rewriter"
          element={
            <ProtectedRoute>
              <ResumeRewriter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-gap"
          element={
            <ProtectedRoute>
              <SkillGap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ats-score"
          element={
            <ProtectedRoute>
            <ATSScore />
            </ProtectedRoute>
        }
        />
        <Route
          path="/resume-roast"
          element={
            <ProtectedRoute>
              <ResumeRoast />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}