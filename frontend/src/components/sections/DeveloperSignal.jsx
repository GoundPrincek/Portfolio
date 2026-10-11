import { ArrowRight } from 'lucide-react'
import Reveal from '../shared/Reveal.jsx'

const signals = ['Full-stack', 'Backend', 'Java', 'DSA', 'PostgreSQL', 'Git', 'Building projects']

function DeveloperSignal() {
  return (
    <Reveal>
      <aside className="developer-signal page-shell" aria-label="Current developer focus">
        <span className="developer-signal-label">In the workshop</span>
        <div className="developer-signal-items">
          {signals.map((signal, index) => (
            <span className="developer-signal-item" key={signal}>
              {signal}
              {index < signals.length - 1 && <ArrowRight size={13} aria-hidden="true" />}
            </span>
          ))}
        </div>
      </aside>
    </Reveal>
  )
}

export default DeveloperSignal
