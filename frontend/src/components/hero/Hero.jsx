import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Code2, Terminal } from 'lucide-react'
import { links } from '../../data/links.js'
import { contactDetails } from '../../data/contact.js'

function Hero() {
  const reduceMotion = useReducedMotion()
  const reveal = (delay = 0) => reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay, ease: 'easeOut' },
      }

  return (
    <section className="hero page-shell" id="home" aria-labelledby="hero-title">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-copy">
        <motion.p className="eyebrow" {...reveal(0.02)}>
          <span className="status-dot" aria-hidden="true" />
          IT engineering student · Third year
        </motion.p>
        <motion.p className="hero-greeting" {...reveal(0.06)}>Hello, I’m</motion.p>
        <motion.h1 id="hero-title" {...reveal(0.1)}>
          Prince <span className="hero-name">Gound.</span>
        </motion.h1>
        <motion.p className="hero-role" {...reveal(0.15)}>
          Full-Stack Developer <span>&amp;</span> IT Engineering Student
        </motion.p>
        <motion.p className="hero-description" {...reveal(0.2)}>
          I build practical software, explore backend systems, and strengthen my problem-solving skills through Java, DSA, and real projects.
        </motion.p>
        <motion.div className="hero-actions" {...reveal(0.25)}>
          <a className="button button-primary" href="#projects">
            Explore my work <ArrowDown size={16} aria-hidden="true" />
          </a>
          {contactDetails.resume
            ? <a className="button button-secondary" href={contactDetails.resume} download>Download resume <ArrowUpRight size={16} aria-hidden="true" /></a>
            : <a className="button button-secondary" href={links.linkedin} target="_blank" rel="noreferrer">Let’s connect <ArrowUpRight size={16} aria-hidden="true" /></a>}
        </motion.div>
        <motion.div className="hero-socials" {...reveal(0.3)} aria-label="Social profiles">
          <span className="social-label">Find me on</span>
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <Code2 size={17} aria-hidden="true" /><span>GitHub</span><ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
            <span className="linkedin-mark" aria-hidden="true">in</span><span>LinkedIn</span><ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <motion.aside className="hero-console" {...reveal(0.18)} aria-label="Current development focus">
        <div className="console-topline">
          <span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>BUILD LOG</span>
          <span className="console-live"><span /> CURRENTLY BUILDING</span>
        </div>
        <div className="console-body">
          <p><span className="console-prompt">$</span> whoami</p>
          <h2>Prince Gound</h2>
          <p className="console-muted">IT engineering student · Full-stack developer</p>
          <div className="console-divider" />
          <p><span className="console-prompt">$</span> focus</p>
          <p className="console-value">MERN <span>+</span> Java <span>+</span> DSA</p>
          <p><span className="console-prompt">$</span> building</p>
          <p className="console-value">Practical software &amp; backend systems<span className="console-cursor" aria-hidden="true">_</span></p>
        </div>
        <div className="console-footer">
          <Terminal size={14} aria-hidden="true" />
          <span>Learning by building</span>
          <span className="console-index">01 / 09</span>
        </div>
      </motion.aside>

      <div className="hero-bottom-note">
        <span>Building my way forward.</span>
        <a href="#focus">Scroll to explore <ArrowDown size={14} aria-hidden="true" /></a>
      </div>
    </section>
  )
}

export default Hero
