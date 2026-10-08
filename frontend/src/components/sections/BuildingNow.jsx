import { ArrowUpRight } from 'lucide-react'
import { buildingNow } from '../../data/building.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function BuildingNow() {
  return (
    <section className="section-block section-building" id="building" aria-labelledby="building-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="07" eyebrow="A work in progress, by design" title="What I’m building" description="The portfolio changes as the work does. Here’s what has my attention right now." id="building-title" />
        </Reveal>
        <div className="building-grid">
          {buildingNow.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.045}>
              <article className="building-card">
                <span className="building-label"><i />{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <ArrowUpRight className="building-arrow" size={16} aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BuildingNow
