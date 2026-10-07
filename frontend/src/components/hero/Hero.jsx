import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, ExternalLink, Github, Linkedin } from 'lucide-react'

const focusItems = [
  { number: '01', title: 'Building', detail: 'Practical full-stack applications' },
  { number: '02', title: 'Strengthening', detail: 'Java, DSA, and problem solving' },
  { number: '03', title: 'Exploring', detail: 'Backend systems and developer workflows' },
]

const technologies = ['React', 'Node.js', 'Express', 'MongoDB', 'Java', 'Git']

function Hero() {
  const reduceMotion = useReducedMotion()
  const reveal = (delay = 0) => reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, delay, ease: 'easeOut' },
      }

  return (
    <section className="hero page-shell" id="home" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <motion.p className="eyebrow" {...reveal(0.02)}>
          <span className="status-dot" aria-hidden="true" />
          Third-year IT engineering student
        </motion.p>

        <motion.h1 id="hero-title" {...reveal(0.08)}>
          Hello, I’m <span className="hero-name">Prince Gound.</span>
          <span className="hero-role">Full-Stack Developer &amp; IT Engineering Student</span>
        </motion.h1>

        <motion.p className="hero-description" id="about" {...reveal(0.14)}>
          I build practical web applications and grow the engineering fundamentals behind them—
          from full-stack development to Java, data structures, and backend systems.
        </motion.p>

        <motion.div className="hero-actions" id="projects" {...reveal(0.2)}>
          <a
            className="button button-primary"
            href="https://github.com/GoundPrincek?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            Explore projects
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <a className="button button-secondary" href="https://www.linkedin.com/in/goundprincek/" target="_blank" rel="noreferrer">
            Let’s connect
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div className="hero-socials" id="contact" {...reveal(0.26)} aria-label="Social profiles">
          <span className="social-label">Find me on</span>
          <a href="https://github.com/GoundPrincek" target="_blank" rel="noreferrer" aria-label="GitHub profile">
            <Github size={17} aria-hidden="true" />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/goundprincek/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
            <Linkedin size={17} aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
        </motion.div>
      </div>

      <motion.aside className="focus-card" id="skills" {...reveal(0.16)} aria-label="Current development focus">
        <div className="focus-card-topline">
          <span className="terminal-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="card-label">CURRENT FOCUS</span>
          <span className="card-index">01 / 03</span>
        </div>

        <div className="focus-card-intro" id="journey">
          <span className="focus-kicker">Learning by building</span>
          <h2>Progress, in practice.</h2>
          <p>A steady loop of shipping projects, strengthening fundamentals, and learning what comes next.</p>
        </div>

        <div className="focus-list">
          {focusItems.map(({ number, title, detail }) => (
            <div className="focus-item" key={number}>
              <span className="focus-number">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
              <ArrowDownRight size={16} aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="tech-stack" aria-label="Technologies in current toolkit">
          <span className="card-label">IN THE TOOLKIT</span>
          <div className="tech-list">
            {technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
        </div>

        <a className="focus-link" href="https://github.com/GoundPrincek" target="_blank" rel="noreferrer">
          See what I’m working on <ExternalLink size={14} aria-hidden="true" />
        </a>
      </motion.aside>

      <div className="hero-bottom-note">
        <span>01 — A little about how I build</span>
        <a href="#about" aria-label="Jump to introduction">
          Scroll to explore <ArrowDownRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

export default Hero
