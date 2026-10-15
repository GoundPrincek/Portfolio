import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { aboutContent } from '../../data/about.js'
import { getEducation } from '../../services/experienceService.js'
import { useResource } from '../../hooks/useResource.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import ResourceState from '../shared/ResourceState.jsx'

function About() {
  const reduceMotion = useReducedMotion()
  const { data: education, status, error, retry } = useResource(getEducation, [{ id: 'local-education', description: aboutContent.education }])
  const educationText = education.map((item) => item.description || `${item.degree} · ${item.field} · ${item.institution}`).join(' · ')

  return (
    <section className="section-block section-about" id="about" aria-labelledby="about-title">
      <div className="page-shell about-layout">
        <Reveal>
          <SectionHeading number="02" eyebrow={aboutContent.label} title={aboutContent.title} id="about-title" />
        </Reveal>
        <Reveal className="about-story" delay={0.08}>
          {aboutContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <ol className="about-process" aria-label="How I approach building software">
            {['Learn', 'Build', 'Debug', 'Improve'].map((step, index) => (
              <motion.li
                key={step}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduceMotion ? 0 : 0.38, delay: reduceMotion ? 0 : index * 0.07, ease: 'easeOut' }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>{step}
              </motion.li>
            ))}
          </ol>
          <div className="education-note">
            <GraduationCap size={18} aria-hidden="true" />
            <span>{status === 'empty' ? 'Education details will appear here when published.' : educationText}</span>
            <a href="#journey" aria-label="Explore my education and journey"><ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <ResourceState status={status} error={error} retry={retry} label="education details" />
        </Reveal>
      </div>
    </section>
  )
}

export default About
