import { ArrowUpRight, Code2 } from 'lucide-react'
import { projects } from '../../data/projects.js'
import { links } from '../../data/links.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function GitHub() {
  return (
    <section className="section-block section-github" id="github" aria-labelledby="github-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="07" eyebrow="GitHub" title="Selected repositories" description="Browse the code and follow the projects as they grow." id="github-title" />
        </Reveal>
        <div className="github-repositories">
          {projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.04}>
              <a className="github-repository" href={project.repository} target="_blank" rel="noreferrer">
                <span className="github-repository-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="github-repository-copy"><strong>{project.name}</strong><small>{project.kind}</small></span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="github-profile-link-wrap">
          <a className="button button-secondary" href={links.github} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /> Visit GitHub profile <ArrowUpRight size={15} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  )
}

export default GitHub
