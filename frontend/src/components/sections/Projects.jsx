import { ArrowRight, ArrowUpRight, Code2, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../../data/projects.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function ProjectLinks({ project, featured = false }) {
  return (
    <div className={`project-links${featured ? ' project-links-featured' : ''}`}>
      <Link className="project-case-link" to={`/projects/${project.id}`}>
        {featured ? 'View case study' : 'Case study'} <ArrowRight size={15} aria-hidden="true" />
      </Link>
      <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`${project.name} repository`}>
        <Code2 size={15} aria-hidden="true" /> GitHub <ArrowUpRight size={13} aria-hidden="true" />
      </a>
      {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Demo <ArrowUpRight size={13} aria-hidden="true" /></a>}
    </div>
  )
}

function FeaturedProject({ project, reduceMotion }) {
  return (
    <Reveal>
      <motion.article
        className="project-featured"
        whileHover={reduceMotion ? undefined : { y: -3 }}
        transition={{ duration: 0.2 }}
      >
        <div className="featured-map" role="img" aria-label="TrackIt system map connecting planning, tracking, and follow-through">
          <div className="featured-map-topline"><span>TRACKIT / SYSTEM MAP</span><span>01 — FEATURED</span></div>
          <div className="featured-map-core">
            <span className="featured-map-orbit featured-map-orbit-one" aria-hidden="true" />
            <span className="featured-map-orbit featured-map-orbit-two" aria-hidden="true" />
            <div className="featured-map-center"><span>FINANCE</span><b>+</b><span>FOCUS</span></div>
            <span className="map-node map-node-plan">Plan<small>salary · budget</small></span>
            <span className="map-node map-node-track">Track<small>expenses · goals</small></span>
            <span className="map-node map-node-do">Follow through<small>todos · reminders</small></span>
          </div>
          <div className="featured-map-caption"><span>One workspace</span><span className="map-caption-line" aria-hidden="true" /><span>Connected routines</span></div>
        </div>

        <div className="featured-copy">
          <div className="project-card-header">
            <span className="featured-overline">A practical product in progress</span>
            <span className="project-status status-active"><i />{project.status}</span>
          </div>
          <p className="project-kind">{project.kind}</p>
          <h3><Link to={`/projects/${project.id}`}>TrackIt <ArrowUpRight size={17} aria-hidden="true" /></Link></h3>
          <p className="featured-subtitle">Smart Personal Finance &amp; Productivity Tracker</p>
          <p className="featured-summary">One workspace for managing money and the everyday tasks that move personal goals forward.</p>

          <div className="featured-stories">
            <div><span>The problem</span><p>{project.problem}</p></div>
            <div><span>Built so far</span><p>{project.solution}</p></div>
            <div><span>What I’m learning</span><p>{project.learned}</p></div>
          </div>

          <div className="featured-stack">
            <span>Stack</span>
            <ul aria-label="TrackIt technology stack">
              {['React', 'Node.js', 'Express.js', 'MongoDB'].map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </div>
          <ProjectLinks project={project} featured />
        </div>
      </motion.article>
    </Reveal>
  )
}

function SupportingProject({ project, reduceMotion }) {
  const isWide = project.id === 'vayudrishti'

  return (
    <Reveal className={isWide ? 'project-support-reveal project-support-reveal-wide' : 'project-support-reveal'}>
      <motion.article
        className={`project-support-card${isWide ? ' project-support-wide' : ''} project-support-${project.id}`}
        whileHover={reduceMotion ? undefined : { y: -3 }}
        transition={{ duration: 0.2 }}
      >
        <div className="project-support-main">
          <div className="project-card-header">
            <span className="project-index">{project.index} <span>/ 04</span></span>
            <span className="project-status"><i />{project.status}</span>
          </div>
          <p className="project-kind">{project.kind}</p>
          <h3><Link className="project-title-link" to={`/projects/${project.id}`}>{project.name}{project.localName && <span>{project.localName}</span>}</Link></h3>
          {project.tagline && <p className="project-tagline">{project.tagline}</p>}
          <p className="project-summary">{project.summary}</p>
          <div className="project-feature-list" aria-label="Selected features or approaches">
            {project.features.map((feature) => <span key={feature}>{feature}</span>)}
          </div>
        </div>
        <div className="project-support-footer">
          <div className="project-tech-list" aria-label="Technologies and approaches">
            {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
          <ProjectLinks project={project} />
        </div>
      </motion.article>
    </Reveal>
  )
}

function Projects() {
  const reduceMotion = useReducedMotion()
  const [featured, ...supporting] = projects

  return (
    <section className="section-block section-projects" id="projects" aria-labelledby="projects-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="05" eyebrow="Ideas, decisions, and working software" title="Projects with a story" description="One featured build, then three different problem spaces I’m exploring through software." id="projects-title" />
        </Reveal>
        {featured && <FeaturedProject project={featured} reduceMotion={reduceMotion} />}
        <div className="projects-support-grid" aria-label="More projects">
          {supporting.map((project) => <SupportingProject key={project.id} project={project} reduceMotion={reduceMotion} />)}
        </div>
      </div>
    </section>
  )
}

export default Projects
