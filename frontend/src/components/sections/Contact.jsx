import { ArrowUpRight, Code2, Mail, Send } from 'lucide-react'
import { contactDetails } from '../../data/contact.js'
import { links } from '../../data/links.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const replyTo = String(form.get('email') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    const subject = encodeURIComponent(`Portfolio message from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nReply to: ${replyTo}`)
    window.location.href = `mailto:${contactDetails.email}?subject=${subject}&body=${body}`
  }

  return (
    <section className="section-block section-contact" id="contact" aria-labelledby="contact-title">
      <div className="page-shell contact-layout">
        <Reveal>
          <SectionHeading number="09" eyebrow="Good things start with a conversation" title="Have an idea, opportunity, or project in mind?" description="I’m always interested in learning, building, and connecting with people working on interesting technical problems." id="contact-title" />
          <div className="contact-links">
            <a href={links.github} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer"><span className="linkedin-mark" aria-hidden="true">in</span> LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
            {contactDetails.email && <a href={`mailto:${contactDetails.email}`}><Mail size={16} aria-hidden="true" /> Email <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          {contactDetails.email ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <p className="form-heading">Send a note <span>Opens your email app; this site does not store messages.</span></p>
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" autoComplete="name" required />
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required />
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="5" required />
              <button className="button button-primary" type="submit">Prepare message <Send size={15} aria-hidden="true" /></button>
            </form>
          ) : (
            <div className="contact-form contact-form-note">
              <Mail size={20} aria-hidden="true" />
              <h3>Start a conversation</h3>
              <p>Reach me on LinkedIn or GitHub. A public email address can be added here whenever you’re ready.</p>
              <a className="button button-secondary" href={links.linkedin} target="_blank" rel="noreferrer">Message on LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
