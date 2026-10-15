import { ArrowRight, ArrowUpRight, Code2, ExternalLink } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../../data/projects.js'
import { getProjects } from '../../services/projectService.js'
import { useResource } from '../../hooks/useResource.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import ResourceState from '../shared/ResourceState.jsx'

function ProjectLinks({ project, featured = false }) {
  return (
    <div className={`project-links${featured ? ' project-links-featured' : ''}`}>
      {featured && project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Live demo <ArrowUpRight size={13} aria-hidden="true" /></a>}
      <a href={project.repository} target="_blank" rel="noreferrer" aria-label={`${project.name} repository`}>
        <Code2 size={15} aria-hidden="true" /> GitHub <ArrowUpRight size={13} aria-hidden="true" />
      </a>
      {!featured && <Link className="project-case-link" to={`/projects/${project.id}`}>Case study <ArrowRight size={15} aria-hidden="true" /></Link>}
      {!featured && project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Demo <ArrowUpRight size={13} aria-hidden="true" /></a>}
      {featured && <Link className="project-case-link" to={`/projects/${project.id}`}>Case study <ArrowRight size={15} aria-hidden="true" /></Link>}
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
        {project.imageUrl ? (
          <img className="featured-project-image" src={project.imageUrl} alt={`${project.name} project screenshot`} loading="lazy" />
        ) : <div className="featured-map" role="img" aria-label={`${project.name} system map connecting its main workflows`}>
          <div className="featured-map-topline"><span>{project.name.toUpperCase()} / SYSTEM MAP</span><span>01 — FEATURED</span></div>
          <div className="featured-map-core">
            <span className="featured-map-orbit featured-map-orbit-one" aria-hidden="true" />
            <span className="featured-map-orbit featured-map-orbit-two" aria-hidden="true" />
            <div className="featured-map-center"><span>FEATURED</span><b>+</b><span>{project.name.toUpperCase()}</span></div>
            {project.features.slice(0, 3).map((feature, index) => <span className={`map-node map-node-${['plan', 'track', 'do'][index]}`} key={feature}>{feature}</span>)}
          </div>
          <div className="featured-map-caption"><span>One workspace</span><span className="map-caption-line" aria-hidden="true" /><span>Connected routines</span></div>
        </div>}

        <div className="featured-copy">
          <div className="project-card-header">
            <span className="featured-overline">FEATURED PROJECT</span>
            <span className="project-status status-active"><i />{project.status}</span>
          </div>
          <p className="project-kind">{project.kind}</p>
          <h3><Link to={`/projects/${project.id}`}>{project.name} <ArrowUpRight size={17} aria-hidden="true" /></Link></h3>
          <p className="featured-subtitle">{project.title}</p>
          <p className="featured-summary">{project.summary}</p>

          <div className="featured-stories">
            <div><span>Problem</span><p>{project.problem}</p></div>
            <div><span>Solution</span><p>{project.overview}</p></div>
            <div><span>Architecture</span><p>{project.architecture}</p></div>
            {project.contribution && <div><span>My contribution</span><p>{project.contribution}</p></div>}
          </div>

          <div className="featured-stack">
            <span>Tech</span>
            <ul aria-label={`${project.name} technology stack`}>
              {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
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
  const { data, status, error, retry } = useResource(getProjects, projects)
  const sortedProjects = [...data].sort((a, b) => Number(b.featured) - Number(a.featured) || a.index.localeCompare(b.index))
  const [featured, ...supporting] = sortedProjects

  return (
    <section className="section-block section-projects" id="projects" aria-labelledby="projects-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="03" eyebrow="Ideas, decisions, and working software" title="Featured project" description="A closer look at the problem, product decisions, and engineering behind a project in progress." id="projects-title" />
        </Reveal>
        <ResourceState status={status} error={error} retry={retry} label="projects" />
        {status !== 'empty' && <>
        {featured && <FeaturedProject project={featured} reduceMotion={reduceMotion} />}
        {supporting.length > 0 && <><Reveal><h3 className="projects-support-title">Other projects</h3></Reveal>
          <div className="projects-support-grid" aria-label="More projects">
            {supporting.map((project) => <SupportingProject key={project.id} project={project} reduceMotion={reduceMotion} />)}
          </div></>}
        </>}
      </div>
    </section>
  )
}

export default Projects
