import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { aboutContent } from '../../data/about.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function About() {
  return (
    <section className="section-block section-about" id="about" aria-labelledby="about-title">
      <div className="page-shell about-layout">
        <Reveal>
          <SectionHeading number="02" eyebrow={aboutContent.label} title={aboutContent.title} id="about-title" />
        </Reveal>
        <Reveal className="about-story" delay={0.08}>
          {aboutContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="education-note">
            <GraduationCap size={18} aria-hidden="true" />
            <span>{aboutContent.education}</span>
            <a href="#journey" aria-label="Explore my education and journey"><ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default About
