import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/navbar/Navbar.jsx'
import Footer from './components/sections/Footer.jsx'
import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import NotFound from './pages/NotFound.jsx'
import { AdminDashboard, AdminLogin, AdminPage } from './pages/Admin.jsx'
import './App.css'
import './theme.css'

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
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:section/new" element={<AdminPage />} />
        <Route path="/admin/:section/:recordId/edit" element={<AdminPage />} />
        <Route path="/admin/:section" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}

function App() { return <BrowserRouter><AppRoutes /></BrowserRouter> }

export default App
