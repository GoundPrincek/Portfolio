import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Code2, Menu, X } from 'lucide-react'
import { links } from '../../data/links.js'

const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [activeSection, setActiveSection] = useState('#home')
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
      })
    }, { rootMargin: '-27% 0px -66% 0px', threshold: 0 })
    const sections = ['home', 'about', 'journey', 'experience', 'projects', 'skills', 'contact']
      .map((id) => document.getElementById(id)).filter(Boolean)
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const selectSection = (href) => { setActiveSection(href); closeMenu() }

  return (
    <header className="site-header">
      <nav className="navbar page-shell" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={() => selectSection('#home')} aria-label="Prince Gound, home">
          <span className="brand-mark" aria-hidden="true">PG</span><span>Prince Gound</span>
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="nav-content">
          <div className="nav-links" id="primary-navigation">
            {navigation.map(({ label, href }) => (
              <a className={`nav-link${activeSection === href ? ' is-active' : ''}`} href={href} key={href} onClick={() => selectSection(href)} aria-current={activeSection === href ? 'location' : undefined}>{label}</a>
            ))}
          </div>
          <a className="nav-github" href={links.github} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" id="mobile-navigation" initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
              {navigation.map(({ label, href }) => (
                <a className={`mobile-nav-link${activeSection === href ? ' is-active' : ''}`} href={href} key={href} onClick={() => selectSection(href)} aria-current={activeSection === href ? 'location' : undefined}>{label}<ArrowUpRight size={15} aria-hidden="true" /></a>
              ))}
              <a className="mobile-nav-link mobile-github-link" href={links.github} target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={15} aria-hidden="true" /></a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
