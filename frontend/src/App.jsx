import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/sections/Footer.jsx'
import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'
import './theme.css'

const loadAdminModule = () => import('./pages/Admin.jsx')
const AdminDashboard = lazy(() => loadAdminModule().then((module) => ({ default: module.AdminDashboard })))
const AdminLogin = lazy(() => loadAdminModule().then((module) => ({ default: module.AdminLogin })))
const AdminPage = lazy(() => loadAdminModule().then((module) => ({ default: module.AdminPage })))

function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      </>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:projectId" element={<ProjectDetail key={location.pathname} />} />
        <Route path="/admin/login" element={<Suspense fallback={<main className="admin-page page-shell"><p role="status">Loading owner sign-in…</p></main>}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<main className="admin-page page-shell"><p role="status">Loading CMS…</p></main>}><AdminDashboard /></Suspense>} />
        <Route path="/admin/:section/new" element={<Suspense fallback={<main className="admin-page page-shell"><p role="status">Loading CMS…</p></main>}><AdminPage /></Suspense>} />
        <Route path="/admin/:section/:recordId/edit" element={<Suspense fallback={<main className="admin-page page-shell"><p role="status">Loading CMS…</p></main>}><AdminPage /></Suspense>} />
        <Route path="/admin/:section" element={<Suspense fallback={<main className="admin-page page-shell"><p role="status">Loading CMS…</p></main>}><AdminPage /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}

function App() { return <BrowserRouter><AppRoutes /></BrowserRouter> }

export default App
