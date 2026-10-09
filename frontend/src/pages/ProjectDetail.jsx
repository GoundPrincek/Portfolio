import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Code2, ExternalLink } from 'lucide-react'
import { projects } from '../data/projects.js'
import Reveal from '../components/shared/Reveal.jsx'
import SectionHeading from '../components/shared/SectionHeading.jsx'

function ProjectDetail() {
  const { projectId } = useParams()
  const project = projects.find((item) => item.id === projectId)

  useEffect(() => {
    if (project) {
      document.title = `${project.name} | Prince Gound`
      const description = `${project.summary} Project notes by Prince Gound.`
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${project.name} | Prince Gound`)
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    return () => {
      document.title = 'Prince Gound | Full-Stack Developer & IT Engineering Student'
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'Prince Gound is an IT Engineering student and full-stack developer learning by building practical software, exploring backend systems, and strengthening Java and DSA fundamentals.')
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Prince Gound | Full-Stack Developer & IT Engineering Student')
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Learning by building practical software, exploring backend systems, and growing through projects and technical challenges.')
    }
  }, [project])

  if (!project) {
    return (
      <main className="detail-page not-found-page page-shell" id="main-content">
        <p className="section-eyebrow">404 · Project not found</p>
        <h1>This project page isn’t here.</h1>
        <p>Head back to the project list to browse the work currently featured on this portfolio.</p>
        <Link className="button button-primary" to="/#projects"><ArrowLeft size={15} aria-hidden="true" /> View projects</Link>
      </main>
    )
  }

  return (
    <main className="detail-page page-shell" id="main-content">
      <Reveal>
        <Link className="back-link" to="/#projects"><ArrowLeft size={14} aria-hidden="true" /> Back to all projects</Link>
        <div className="detail-hero">
          <div className="detail-kicker"><span>{project.index} / {String(projects.length).padStart(2, '0')}</span><span className="project-status"><i />{project.status}</span><span>{project.kind}</span></div>
          <h1>{project.name} {project.localName && <span>{project.localName}</span>}</h1>
          {project.tagline && <p className="detail-tagline">{project.tagline}</p>}
          <p className="detail-summary">{project.summary}</p>
          <div className="detail-actions">
            <a className="button button-primary" href={project.repository} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /> View repository <ArrowUpRight size={14} aria-hidden="true" /></a>
            {project.live && <a className="button button-secondary" href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={15} aria-hidden="true" /> Live demo <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
        </div>
      </Reveal>

      <div className="detail-content-grid">
        <Reveal className="detail-main-column" delay={0.05}>
          <section className="detail-section">
            <SectionHeading eyebrow="The overview" title="What this project is" />
            <p>{project.overview}</p>
          </section>
          <section className="detail-section">
            <SectionHeading eyebrow="The problem space" title="Why I’m exploring it" />
            <p>{project.problem}</p>
          </section>
          <section className="detail-section">
            <SectionHeading eyebrow="The current approach" title="What’s in the project" />
            <p>{project.solution}</p>
            <ul className="detail-feature-list">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>
          <section className="detail-section">
            <SectionHeading eyebrow="System shape" title="Architecture notes" />
            <p>{project.architecture}</p>
          </section>
          <section className="detail-section">
            <SectionHeading eyebrow="An engineering question" title="What I’m thinking through" />
            <p>{project.designQuestion}</p>
          </section>
          <section className="detail-section">
            <SectionHeading eyebrow="Reflection" title="What I’m learning" />
            <p>{project.learned}</p>
          </section>
        </Reveal>

        <aside className="detail-aside">
          <Reveal delay={0.1}>
            <section className="detail-aside-card">
              <p className="eyebrow-small">TECHNOLOGIES / PROJECT CONTEXT</p>
              <ul className="detail-tech-list">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
            </section>
          </Reveal>
          <Reveal delay={0.15}>
            <section className="detail-aside-card detail-status-card">
              <p className="eyebrow-small">CURRENT STATUS</p>
              <h2>{project.status}</h2>
              <p>For current implementation notes and setup details, open the project repository.</p>
            </section>
          </Reveal>
          <Reveal delay={0.2}>
            <section className="detail-aside-card detail-next-project">
              <p className="eyebrow-small">KEEP EXPLORING</p>
              <h2>More projects, more questions.</h2>
              <p>See how this project fits into the wider journey.</p>
              <Link to="/#projects">Browse all projects <ArrowUpRight size={14} aria-hidden="true" /></Link>
            </section>
          </Reveal>
        </aside>
      </div>
    </main>
  )
}

export default ProjectDetail
