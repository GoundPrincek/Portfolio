import { ArrowUpRight, Code2 } from 'lucide-react'
import { links } from '../../data/links.js'
import Reveal from '../shared/Reveal.jsx'

function GitHub() {
  return (
    <section className="section-block section-github" id="github" aria-labelledby="github-title">
      <div className="page-shell">
        <Reveal className="github-panel">
          <div className="github-symbol"><Code2 size={22} aria-hidden="true" /></div>
          <div className="github-copy">
            <p className="section-eyebrow">Work in the open</p>
            <h2 id="github-title">Follow the projects as they grow.</h2>
            <p>Browse repositories, read the project notes, and see what I’m learning by building.</p>
          </div>
          <a className="button button-secondary" href={links.github} target="_blank" rel="noreferrer">Visit GitHub <ArrowUpRight size={16} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  )
}

export default GitHub
