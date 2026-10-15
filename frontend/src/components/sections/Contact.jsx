import { useState } from 'react'
import { ArrowUpRight, Code2, FileText, Mail, Send } from 'lucide-react'
import { contactDetails } from '../../data/contact.js'
import { links } from '../../data/links.js'
import { sendContactMessage } from '../../services/contactService.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'

function Contact() {
  const [sendState, setSendState] = useState('idle')
  const [sendError, setSendError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setSendState('sending')
    setSendError('')
    try {
      await sendContactMessage({
        name: String(form.get('name') ?? '').trim(),
        email: String(form.get('email') ?? '').trim(),
        subject: String(form.get('subject') ?? '').trim(),
        message: String(form.get('message') ?? '').trim(),
        website: String(form.get('website') ?? '').trim(),
      })
      formElement.reset()
      setSendState('sent')
    } catch (error) {
      setSendError(error.message || 'Your note could not be sent. Please try again.')
      setSendState('error')
    }
  }

  return (
    <section className="section-block section-contact" id="contact" aria-labelledby="contact-title">
      <div className="page-shell contact-layout">
        <Reveal>
          <SectionHeading number="08" eyebrow="Good things start with a conversation" title="Let’s connect" description="For internship opportunities, project ideas, or a conversation about building useful software." id="contact-title" />
          <div className="contact-links">
            {contactDetails.resume && <a href={contactDetails.resume} download><FileText size={16} aria-hidden="true" /> Resume <ArrowUpRight size={14} aria-hidden="true" /></a>}
            <a href={links.github} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer"><span className="linkedin-mark" aria-hidden="true">in</span> LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
            {contactDetails.email && <a href={`mailto:${contactDetails.email}`}><Mail size={16} aria-hidden="true" /> Email <ArrowUpRight size={14} aria-hidden="true" /></a>}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <form className="contact-form" onSubmit={handleSubmit}>
              <p className="form-heading">Send a note <span>Your message is saved privately for me to review.</span></p>
              <label className="contact-honeypot" htmlFor="contact-website" aria-hidden="true">Website</label>
              <input className="contact-honeypot" id="contact-website" name="website" tabIndex="-1" autoComplete="off" />
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" autoComplete="name" maxLength="100" required />
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength="254" required />
              <label htmlFor="contact-subject">Subject <span>(optional)</span></label>
              <input id="contact-subject" name="subject" maxLength="160" />
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="5" minLength="10" maxLength="5000" required />
              {sendState === 'sent' && <p className="form-feedback form-success" role="status">Your message has been sent. Thank you for reaching out.</p>}
              {sendState === 'error' && <p className="form-feedback form-error" role="alert">{sendError}</p>}
              <button className="button button-primary" type="submit" disabled={sendState === 'sending'}>{sendState === 'sending' ? 'Sending…' : 'Send message'} <Send size={15} aria-hidden="true" /></button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default Contact
