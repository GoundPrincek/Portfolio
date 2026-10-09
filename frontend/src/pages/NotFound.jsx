import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="detail-page not-found-page page-shell" id="main-content">
      <p className="section-eyebrow">404 · Page not found</p>
      <h1>Looks like this page took a different route.</h1>
      <p>Return to the portfolio and pick up the story from there.</p>
      <Link className="button button-primary" to="/"><ArrowLeft size={15} aria-hidden="true" /> Back home</Link>
    </main>
  )
}

export default NotFound
