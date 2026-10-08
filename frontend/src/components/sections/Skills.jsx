import { ArrowUpRight } from 'lucide-react'
import { skillGroups } from '../../data/skills.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function Skills() {
  return (
    <section className="section-block section-skills" id="skills" aria-labelledby="skills-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="06" eyebrow="A toolkit still in progress" title="Skills I’m growing" description="Some tools are part of my current building practice; others are areas I’m actively exploring." id="skills-title" />
        </Reveal>
        <div className="skill-groups">
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.06}>
              <article className={`skill-group skill-group-${group.id}`}>
                <div className="skill-group-heading"><h3>{group.title}</h3><ArrowUpRight size={16} aria-hidden="true" /></div>
                <p>{group.note}</p>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
