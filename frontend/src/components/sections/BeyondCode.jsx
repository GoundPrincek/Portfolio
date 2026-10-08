import { ArrowUpRight, UsersRound } from 'lucide-react'
import { links } from '../../data/links.js'
import Reveal from '../shared/Reveal.jsx'

function BeyondCode() {
  return (
    <section className="section-block section-beyond" id="beyond" aria-labelledby="beyond-title">
      <div className="page-shell beyond-card">
        <Reveal>
          <div className="beyond-icon"><UsersRound size={19} aria-hidden="true" /></div>
          <p className="section-eyebrow">The people side of building</p>
          <h2 id="beyond-title">Beyond the code</h2>
          <p className="beyond-copy">Technical events have reminded me that software does not end at the editor. Sharing an idea asks for clarity; debugging asks for patience; good collaboration depends on listening and communication.</p>
          <a href={links.linkedin} target="_blank" rel="noreferrer">Connect and compare notes <ArrowUpRight size={15} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  )
}

export default BeyondCode
