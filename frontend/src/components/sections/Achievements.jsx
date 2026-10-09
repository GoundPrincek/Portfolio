import { ArrowUpRight, Bug, BriefcaseBusiness, GraduationCap, Presentation } from 'lucide-react'
import { achievements } from '../../data/achievements.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

const icons = { presentation: Presentation, bug: Bug, briefcase: BriefcaseBusiness, graduation: GraduationCap }

function Achievements() {
  return (
    <section className="section-block section-experience" id="experience" aria-labelledby="experience-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="04" eyebrow="Experiences that move me forward" title="Experience & milestones" description="Each experience added a different tool to how I learn, collaborate, and solve problems." id="experience-title" />
        </Reveal>
        <div className="experience-grid">
          {achievements.map((item, index) => {
            const Icon = icons[item.icon]
            return (
              <Reveal key={item.id} delay={index * 0.045}>
                <article className={`experience-card${item.id === 'debugging' ? ' experience-card-featured' : ''}`}>
                  <div className="experience-topline"><span>{item.number}</span><Icon size={18} aria-hidden="true" /></div>
                  <p className="experience-category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <div className="experience-action"><span className="eyebrow-small">WHAT I DID</span><p>{item.did}</p></div>
                  <p className="experience-summary">{item.summary}</p>
                  <div className="experience-learnings">
                    <span className="eyebrow-small">WHAT I LEARNED</span>
                    <ul>{item.learned.map((point) => <li key={point}>{point}</li>)}</ul>
                  </div>
                  {item.id === 'debugging' && <a className="experience-journey-link" href="#journey">See it in my journey <ArrowUpRight size={14} aria-hidden="true" /></a>}
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Achievements
