import { motion } from 'framer-motion'
import { BookOpen, Code2, Compass, TrendingUp } from 'lucide-react'
import { focusItems } from '../../data/focus.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

const icons = { code: Code2, book: BookOpen, compass: Compass, trending: TrendingUp }

function CurrentFocus() {
  return (
    <section className="section-block section-focus" id="focus" aria-labelledby="focus-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="01" eyebrow="The work in front of me" title="What I’m focused on" description="A snapshot of what I’m building, learning, and getting better at right now." id="focus-title" />
        </Reveal>
        <div className="focus-grid">
          {focusItems.map(({ number, title, detail, icon }, index) => {
            const Icon = icons[icon]
            return (
              <Reveal key={number} delay={index * 0.06}>
                <motion.article className="focus-tile" whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
                  <div className="focus-tile-top"><span>{number}</span><Icon size={18} aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </motion.article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CurrentFocus
