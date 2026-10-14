import { skillRows } from '../../data/skills.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function Skills() {
  return (
    <section className="section-block section-skills" id="skills" aria-labelledby="skills-title">
      <div className="page-shell skills-layout">
        <Reveal>
          <SectionHeading number="04" eyebrow="Tools I use to build" title="Engineering skills" description="A practical snapshot of the technologies I’m using across my projects." id="skills-title" />
        </Reveal>
        <div className="skill-rows">
          {skillRows.map((row, index) => (
            <Reveal key={row.id} delay={index * 0.04}>
              <div className="skill-row">
                <h3>{row.label}</h3>
                <ul>{row.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
