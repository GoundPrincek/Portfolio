import Reveal from '../shared/Reveal.jsx'

const focus = ['Full-Stack Development', 'Java + DSA', 'Backend Engineering']

function CurrentFocus() {
  return (
    <section className="section-block section-focus" id="focus" aria-labelledby="focus-title">
      <Reveal className="page-shell focus-band">
        <h2 className="focus-band-title" id="focus-title">Current focus</h2>
        <ul className="focus-band-items">
          {focus.map((item) => <li className="focus-band-item" key={item}>{item}</li>)}
        </ul>
      </Reveal>
    </section>
  )
}

export default CurrentFocus
