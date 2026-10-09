import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Code2, Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { contactDetails } from '../../data/contact.js'
import { links } from '../../data/links.js'

const navigation = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [activeSection, setActiveSection] = useState('#home')
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const sectionHref = (href) => isHome ? href : `/${href}`

  useEffect(() => {
    if (!isHome) return undefined

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
      })
    }, { rootMargin: '-27% 0px -66% 0px', threshold: 0 })
    const sections = ['home', 'about', 'journey', 'experience', 'projects', 'skills', 'contact']
      .map((id) => document.getElementById(id)).filter(Boolean)
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome, pathname])

  const closeMenu = () => setMenuOpen(false)
  const selectSection = (href) => { setActiveSection(href); closeMenu() }
  const resumeLink = contactDetails.resume

  return (
    <header className="site-header">
      <nav className="navbar page-shell" aria-label="Main navigation">
        <a className="brand" href={sectionHref('#home')} onClick={() => selectSection('#home')} aria-label="Prince Gound, home">
          <span className="brand-mark" aria-hidden="true">PG</span><span>Prince Gound</span>
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="nav-content">
          <div className="nav-links" id="primary-navigation">
            {navigation.map(({ label, href }) => {
              const destination = sectionHref(href)
              return <a className={`nav-link${activeSection === href && isHome ? ' is-active' : ''}`} href={destination} key={href} onClick={() => selectSection(href)} aria-current={activeSection === href && isHome ? 'location' : undefined}>{label}</a>
            })}
          </div>
          <a className="nav-github" href={links.github} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={14} aria-hidden="true" /></a>
          {resumeLink && <a className="nav-resume" href={resumeLink} download>Resume <ArrowUpRight size={13} aria-hidden="true" /></a>}
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div className="mobile-menu" id="mobile-navigation" initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
              <a className={`mobile-nav-link${isHome && activeSection === '#home' ? ' is-active' : ''}`} href={sectionHref('#home')} onClick={() => selectSection('#home')}>Home<ArrowUpRight size={15} aria-hidden="true" /></a>
              {navigation.map(({ label, href }) => (
                <a className={`mobile-nav-link${isHome && activeSection === href ? ' is-active' : ''}`} href={sectionHref(href)} key={href} onClick={() => selectSection(href)} aria-current={isHome && activeSection === href ? 'location' : undefined}>{label}<ArrowUpRight size={15} aria-hidden="true" /></a>
              ))}
              <a className="mobile-nav-link mobile-github-link" href={links.github} target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={15} aria-hidden="true" /></a>
              {resumeLink && <a className="mobile-nav-link" href={resumeLink} download>Download resume <ArrowUpRight size={15} aria-hidden="true" /></a>}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
