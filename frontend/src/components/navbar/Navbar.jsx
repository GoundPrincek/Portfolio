import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Code2, Menu, X } from 'lucide-react'

const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

const githubUrl = 'https://github.com/GoundPrincek'

function Navbar() {
  const [activeSection, setActiveSection] = useState('#home')
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const updateActiveSection = () => {
      setActiveSection(window.location.hash || '#home')
    }

    window.addEventListener('hashchange', updateActiveSection)
    return () => window.removeEventListener('hashchange', updateActiveSection)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar page-shell" aria-label="Main navigation">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Prince Gound, home">
          <span className="brand-mark" aria-hidden="true">PG</span>
          <span>Prince Gound</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="nav-content">
          <div className="nav-links" id="primary-navigation">
            {navigation.map(({ label, href }) => (
              <a
                className={`nav-link${activeSection === href ? ' is-active' : ''}`}
                href={href}
                key={href}
                onClick={closeMenu}
                aria-current={activeSection === href ? 'location' : undefined}
              >
                {label}
              </a>
            ))}
          </div>
          <a className="nav-github" href={githubUrl} target="_blank" rel="noreferrer">
            <Code2 size={16} aria-hidden="true" />
            <span>GitHub</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              id="mobile-navigation"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {navigation.map(({ label, href }) => (
                <a
                  className={`mobile-nav-link${activeSection === href ? ' is-active' : ''}`}
                  href={href}
                  key={href}
                  onClick={closeMenu}
                  aria-current={activeSection === href ? 'location' : undefined}
                >
                  {label}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
              <a className="mobile-nav-link mobile-github-link" href={githubUrl} target="_blank" rel="noreferrer">
                GitHub profile
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Navbar
