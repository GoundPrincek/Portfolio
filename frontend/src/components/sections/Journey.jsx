import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Bug, Code2, GraduationCap, Presentation } from 'lucide-react'
import { journey } from '../../data/journey.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

const icons = { education: GraduationCap, building: Code2, projects: Code2, showcase: Presentation, event: Bug, internship: BriefcaseBusiness }

function Journey() {
  const [selectedId, setSelectedId] = useState('stackfix')
  const reduceMotion = useReducedMotion()
  const selected = journey.find((item) => item.id === selectedId) ?? journey[0]
  const SelectedIcon = icons[selected.category === 'Education' ? 'education' : selected.category === 'Building' ? 'building' : selected.category === 'Projects' ? 'projects' : selected.category === 'Showcase' ? 'showcase' : selected.category === 'Technical event' ? 'event' : 'internship']

  return (
    <section className="section-block section-journey" id="journey" aria-labelledby="journey-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="03" eyebrow="Learning through the work" title="My journey" description="Learning by building, breaking, debugging, and building again." id="journey-title" />
        </Reveal>
        <div className="journey-layout">
          <div className="journey-rail" role="group" aria-label="Choose a journey milestone">
            {journey.map((item, index) => {
              const Icon = icons[item.category === 'Education' ? 'education' : item.category === 'Building' ? 'building' : item.category === 'Projects' ? 'projects' : item.category === 'Showcase' ? 'showcase' : item.category === 'Technical event' ? 'event' : 'internship']
              const active = item.id === selectedId
              return (
                <Reveal key={item.id} delay={index * 0.035}>
                  <motion.button
                    className={`journey-stop${active ? ' is-selected' : ''}${item.id === 'stackfix' ? ' is-featured' : ''}`}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    aria-pressed={active}
                    aria-controls="journey-detail"
                  >
                    <span className="journey-marker"><Icon size={15} aria-hidden="true" /></span>
                    <span className="journey-stop-copy">{item.year && <span className="journey-year">{item.year}</span>}<span className="journey-stop-title">{item.title}</span></span>
                    {active ? <ArrowUpRight size={15} aria-hidden="true" /> : <ArrowDownRight size={15} aria-hidden="true" />}
                  </motion.button>
                </Reveal>
              )
            })}
          </div>
          <div className="journey-detail-wrap" id="journey-detail" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait">
              <motion.article
                className={`journey-detail${selected.id === 'stackfix' ? ' is-debugging' : ''}`}
                key={selected.id}
                initial={reduceMotion ? false : { opacity: 0, y: 9 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -7 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
              >
                <div className="journey-detail-heading">
                  <span className="journey-detail-icon"><SelectedIcon size={19} aria-hidden="true" /></span>
                  <div><p>{selected.category} <span>·</span> {selected.period}</p><h3>{selected.title}</h3></div>
                  {selected.year && <span className="journey-detail-year">{selected.year}</span>}
                </div>
                <p className="journey-description">{selected.description}</p>
                <div className="learned-box">
                  <span className="eyebrow-small">WHAT I LEARNED</span>
                  <p>{selected.learned}</p>
                </div>
                <div className="related-line"><span>CONNECTED TO</span><strong>{selected.related}</strong></div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Journey
