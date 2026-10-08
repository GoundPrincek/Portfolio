import { lessons } from '../../data/lessons.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function Lessons() {
  return (
    <section className="section-block section-lessons" id="lessons" aria-labelledby="lessons-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="08" eyebrow="Notes from the process" title="Things building has taught me" description="Not rules, just ideas that have started to stick through projects and real experiences." id="lessons-title" />
        </Reveal>
        <div className="lessons-grid">
          {lessons.map((lesson, index) => (
            <Reveal key={lesson.number} delay={index * 0.05}>
              <article className="lesson-card">
                <span className="lesson-number">{lesson.number}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.detail}</p>
                <span className="lesson-source">{lesson.source}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Lessons
