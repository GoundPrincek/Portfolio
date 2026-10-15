import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, Bug, Code2, GraduationCap, Presentation } from 'lucide-react'
import { journey } from '../../data/journey.js'
import { getAchievements, getExperience } from '../../services/experienceService.js'
import { useResource } from '../../hooks/useResource.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import ResourceState from '../shared/ResourceState.jsx'

const icons = { education: GraduationCap, building: Code2, projects: Code2, showcase: Presentation, event: Bug, internship: BriefcaseBusiness }

async function loadJourney() {
  const [experiences, achievements] = await Promise.all([getExperience(), getAchievements()])
  const titles = new Set(experiences.map((item) => item.title.toLowerCase()))
  const uniqueAchievements = achievements.filter((item) => !titles.has(item.title.toLowerCase()))
  return [
    ...experiences,
    ...uniqueAchievements.map((item) => ({
      ...item,
      id: `achievement-${item.id}`,
      period: item.date ? new Date(item.date).getFullYear().toString() : item.category,
      year: item.date ? new Date(item.date).getFullYear().toString() : '',
      learned: item.description,
      related: item.category,
    })),
  ]
}

function Journey() {
  const [selectedId, setSelectedId] = useState('stackfix')
  const fallbackJourney = journey.map((item) => ({ ...item }))
  const { data, status, error, retry } = useResource(loadJourney, fallbackJourney)
  const reduceMotion = useReducedMotion()
  const railRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 76%', 'end 48%'] })
  const selected = data.find((item) => item.id === selectedId) ?? data.find((item) => item.title.toLowerCase().includes('stackfix')) ?? data[0]
  if (!selected) return null
  const selectedCategory = selected.category.toLowerCase()
  const SelectedIcon = icons[selectedCategory.includes('education') ? 'education' : selectedCategory.includes('building') ? 'building' : selectedCategory.includes('project') ? 'projects' : selectedCategory.includes('showcase') ? 'showcase' : selectedCategory.includes('technical') || selectedCategory.includes('competition') ? 'event' : 'internship']

  return (
    <section className="section-block section-journey" id="journey" aria-labelledby="journey-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="05" eyebrow="Internship · project showcase · debugging competition" title="Journey & experience" description="Internship, project showcases, and technical events shaping how I communicate and solve problems." id="journey-title" />
        </Reveal>
        <ResourceState status={status} error={error} retry={retry} label="journey items" />
        {status !== 'empty' && <div className="journey-layout">
          <div className="journey-rail" ref={railRef} role="group" aria-label="Choose a journey milestone">
            {!reduceMotion && <motion.span className="journey-progress" aria-hidden="true" style={{ scaleY: scrollYProgress }} />}
            {data.map((item, index) => {
              const category = item.category.toLowerCase()
              const Icon = icons[category.includes('education') ? 'education' : category.includes('building') ? 'building' : category.includes('project') ? 'projects' : category.includes('showcase') ? 'showcase' : category.includes('technical') || category.includes('competition') ? 'event' : 'internship']
              const active = item.id === selected.id
              return (
                <Reveal key={item.id} delay={index * 0.035}>
                  <motion.button
                    className={`journey-stop${active ? ' is-selected' : ''}${item.title.toLowerCase().includes('stackfix') ? ' is-featured' : ''}`}
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
                className={`journey-detail${selected.title.toLowerCase().includes('stackfix') ? ' is-debugging' : ''}`}
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
        </div>}
      </div>
    </section>
  )
}

export default Journey
