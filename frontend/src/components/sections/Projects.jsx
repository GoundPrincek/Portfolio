import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Code2, ExternalLink } from 'lucide-react'
import { projects } from '../../data/projects.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function ProjectCard({ project, index }) {
  const [expanded, setExpanded] = useState(index === 0)
  const reduceMotion = useReducedMotion()
  const detailsId = `project-story-${project.id}`

  return (
    <Reveal delay={index * 0.06}>
      <motion.article className={`project-card project-card-${project.id}`} whileHover={{ y: -3 }} transition={{ duration: 0.18 }}>
        <div className="project-card-header">
          <span className="project-index">{project.index} <span>/ 03</span></span>
          <span className={`project-status${project.status === 'Built project' ? ' status-built' : ''}`}><i />{project.status}</span>
        </div>
        <p className="project-kind">{project.kind}</p>
        <h3>{project.name}</h3>
        <p className="project-summary">{project.summary}</p>
        <div className="project-feature-list" aria-label="Selected features or approaches">
          {project.features.map((feature) => <span key={feature}>{feature}</span>)}
        </div>
        <div className="project-tech-list" aria-label="Technologies and approaches">
          {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
        </div>
        <button className="project-expand" type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Close project story' : 'Read project story'}
          {expanded ? <ArrowUpRight size={15} aria-hidden="true" /> : <ArrowDownRight size={15} aria-hidden="true" />}
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              className="project-story"
              id={detailsId}
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <div><span>THE PROBLEM</span><p>{project.problem}</p></div>
              <div><span>THE APPROACH</span><p>{project.solution}</p></div>
              <div><span>WHAT I’M LEARNING</span><p>{project.learned}</p></div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="project-links">
          <a href={project.repository} target="_blank" rel="noreferrer"><Code2 size={15} aria-hidden="true" /> Repository <ArrowUpRight size={13} aria-hidden="true" /></a>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Live demo <ArrowUpRight size={13} aria-hidden="true" /></a>}
        </div>
      </motion.article>
    </Reveal>
  )
}

function Projects() {
  return (
    <section className="section-block section-projects" id="projects" aria-labelledby="projects-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="05" eyebrow="Ideas, decisions, and working software" title="Projects with a story" description="A look at the problems behind the projects, the approach I’m taking, and what each one is teaching me." id="projects-title" />
        </Reveal>
        <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
      </div>
    </section>
  )
}

export default Projects
