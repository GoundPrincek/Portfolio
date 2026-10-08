import { ArrowUpRight } from 'lucide-react'
import { links } from '../../data/links.js'
import { contactDetails } from '../../data/contact.js'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <a className="footer-brand" href="#home"><span className="brand-mark" aria-hidden="true">PG</span><span><strong>Prince Gound</strong><small>Full-Stack Developer &amp; IT Engineering Student</small></span></a>
        <p>Building. Learning. Improving.</p>
        <div className="footer-links">
          <a href={links.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} aria-hidden="true" /></a>
          {contactDetails.email && <a href={`mailto:${contactDetails.email}`}>Email <ArrowUpRight size={13} aria-hidden="true" /></a>}
        </div>
        <span className="copyright">© 2026 Prince Gound</span>
      </div>
    </footer>
  )
}

export default Footer
