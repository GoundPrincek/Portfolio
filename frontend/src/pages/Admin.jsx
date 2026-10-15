import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, LogOut, Plus, Save, Trash2 } from 'lucide-react'
import { createAdminItem, deleteAdminItem, getAdminCollection, getAdminMessages, getAdminOverview, getCurrentAdmin, login, logout, updateAdminItem, updateMessageStatus } from '../services/authService.js'

const sections = [
  { id: 'projects', label: 'Projects', countKey: 'projects', titleKey: 'title' },
  { id: 'skills', label: 'Skills', countKey: 'skills', titleKey: 'name' },
  { id: 'experience', label: 'Experience', countKey: 'experience', titleKey: 'title' },
  { id: 'education', label: 'Education', countKey: 'education', titleKey: 'institution' },
  { id: 'achievements', label: 'Achievements', countKey: 'achievements', titleKey: 'title' },
  { id: 'messages', label: 'Messages', countKey: 'messages', titleKey: 'subject' },
]

const fields = {
  projects: [
    ['title', 'Project name', 'text'], ['slug', 'URL slug', 'text'], ['subtitle', 'Subtitle', 'text'], ['localName', 'Local name', 'text'], ['tagline', 'Tagline', 'text'],
    ['shortDescription', 'Short description', 'textarea'], ['description', 'Overview', 'textarea'], ['problem', 'Problem', 'textarea'], ['solution', 'Solution', 'textarea'],
    ['architecture', 'Architecture', 'textarea'], ['contribution', 'My contribution', 'textarea'], ['designQuestion', 'Design question', 'textarea'], ['learned', 'What I learned', 'textarea'],
    ['kind', 'Project type', 'text'], ['status', 'Status', 'text'], ['technologies', 'Technologies (one per line)', 'list'], ['features', 'Features (one per line)', 'list'],
    ['githubUrl', 'GitHub URL', 'url'], ['liveUrl', 'Live demo URL', 'url'], ['imageUrl', 'Hero screenshot URL', 'url'], ['galleryUrls', 'Additional screenshot URLs (one per line)', 'list'], ['featured', 'Featured project', 'checkbox'], ['sortOrder', 'Display order (starting at 0)', 'number'],
  ],
  skills: [['name', 'Skill', 'text'], ['category', 'Category', 'text'], ['level', 'Level', 'text'], ['sortOrder', 'Display order', 'number']],
  experience: [['title', 'Title', 'text'], ['organization', 'Organization', 'text'], ['description', 'Description', 'textarea'], ['learned', 'What I learned', 'textarea'], ['related', 'Related topics', 'text'], ['category', 'Category', 'text'], ['period', 'Period', 'text'], ['year', 'Year', 'text'], ['location', 'Location', 'text'], ['startDate', 'Start date', 'date'], ['endDate', 'End date', 'date'], ['sortOrder', 'Display order', 'number']],
  education: [['institution', 'Institution', 'text'], ['degree', 'Degree', 'text'], ['field', 'Field', 'text'], ['description', 'Description', 'textarea'], ['startDate', 'Start date', 'date'], ['endDate', 'End date', 'date'], ['sortOrder', 'Display order', 'number']],
  achievements: [['title', 'Title', 'text'], ['category', 'Category', 'text'], ['description', 'Description', 'textarea'], ['date', 'Date', 'date'], ['url', 'Reference URL', 'url'], ['sortOrder', 'Display order', 'number']],
}

function AdminGate({ children }) {
  const [state, setState] = useState('checking')
  useEffect(() => {
    let active = true
    getCurrentAdmin().then(() => { if (active) setState('authorized') }).catch(() => { if (active) setState('unauthorized') })
    return () => { active = false }
  }, [])
  if (state === 'checking') return <main className="admin-page page-shell"><p role="status">Checking admin session…</p></main>
  if (state === 'unauthorized') return <Navigate to="/admin/login" replace />
  return children
}

export function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmitting(true)
    setError('')
    try {
      await login({ email: String(data.get('email')).trim(), password: String(data.get('password')) })
      navigate('/admin', { replace: true })
    } catch (reason) {
      setError(reason.message || 'Sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-page page-shell admin-login-page" id="main-content">
      <Link className="admin-back-link" to="/"><ArrowLeft size={15} /> Back to portfolio</Link>
      <section className="admin-panel admin-login-panel">
        <p className="admin-eyebrow">OWNER ACCESS</p>
        <h1>Sign in</h1>
        <p className="admin-description">Manage portfolio content and review contact messages.</p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Email<input name="email" type="email" autoComplete="username" maxLength="254" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <p className="admin-feedback admin-feedback-error" role="alert">{error}</p>}
          <button className="button button-primary" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'} <ArrowUpRight size={15} /></button>
        </form>
      </section>
    </main>
  )
}

function AdminHeader({ title, description }) {
  const navigate = useNavigate()
  async function handleLogout() {
    try { await logout() } finally { navigate('/admin/login', { replace: true }) }
  }
  return (
    <header className="admin-header">
      <div><p className="admin-eyebrow">PRINCE GOUND · CONTENT CMS</p><h1>{title}</h1><p className="admin-description">{description}</p></div>
      <div className="admin-header-actions"><Link to="/" className="admin-text-link">View site <ArrowUpRight size={14} /></Link><button className="admin-logout" type="button" onClick={handleLogout}><LogOut size={15} /> Sign out</button></div>
    </header>
  )
}

function AdminNavigation() {
  return <nav className="admin-nav" aria-label="Admin sections">{sections.map((section) => <Link key={section.id} to={`/admin/${section.id}`}>{section.label}</Link>)}</nav>
}

export function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    getAdminOverview().then((data) => { if (active) { setOverview(data); setError('') } }).catch((reason) => { if (active) setError(reason.message) })
    return () => { active = false }
  }, [attempt])

  return (
    <AdminGate><main className="admin-page page-shell" id="main-content">
      <AdminHeader title="Dashboard" description="Keep your project story current and review messages from visitors." />
      <AdminNavigation />
      {error && <div className="admin-feedback admin-feedback-error" role="alert">{error} <button type="button" onClick={() => setAttempt((count) => count + 1)}>Retry</button></div>}
      {!overview && !error && <p role="status">Loading dashboard…</p>}
      {overview && <div className="admin-overview-grid">{sections.map((section) => <Link className="admin-overview-card" key={section.id} to={`/admin/${section.id}`}><span>{section.label}</span><strong>{overview[section.countKey] ?? 0}</strong>{section.id === 'messages' && <small>{overview.newMessages ?? 0} new</small>}</Link>)}</div>}
      <div className="admin-note"><Check size={16} /><p>Public project, skill, education, and journey content is served from the portfolio API. Changes appear on the site after saving.</p></div>
    </main></AdminGate>
  )
}

function valueForForm(value, type) {
  if (value == null) return ''
  if (type === 'date' && value) return String(value).slice(0, 10)
  if (Array.isArray(value)) return value.join('\n')
  return value
}

function normalizeForm(form, collection) {
  return Object.fromEntries(fields[collection].map(([name, , type]) => {
    let value = form[name]
    if (type === 'list') value = String(value ?? '').split('\n').map((entry) => entry.trim()).filter(Boolean)
    if (type === 'checkbox') value = Boolean(value)
    if (type === 'number') value = Number(value || 0)
    if (type === 'date' && value) value = `${value}T00:00:00.000Z`
    return [name, value]
  }))
}

function AdminCollection({ collection }) {
  const navigate = useNavigate()
  const { recordId } = useParams()
  const { section = collection } = useParams()
  const newItem = location.pathname.endsWith('/new')
  const config = sections.find((item) => item.id === section)
  const formFields = fields[collection]
  const blankForm = Object.fromEntries(formFields.map(([name, , type]) => [name, type === 'checkbox' ? false : '']))
  const [items, setItems] = useState([])
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    getAdminCollection(collection).then((data) => {
      if (!active) return
      setItems(data)
      setError('')
      if (recordId) {
        const record = data.find((item) => item.id === recordId)
        if (!record) setError('This item could not be found.')
        else setForm(Object.fromEntries(formFields.map(([name, , type]) => [name, valueForForm(record[name], type)])))
      } else setForm(blankForm)
    }).catch((reason) => { if (active) setError(reason.message || 'Content could not be loaded.') })
    return () => { active = false }
  }, [collection, recordId, attempt])

  async function handleSave(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const payload = normalizeForm(form, collection)
      if (recordId) await updateAdminItem(collection, recordId, payload)
      else await createAdminItem(collection, payload)
      setNotice('Saved. Public content has been updated.')
      if (recordId) setAttempt((count) => count + 1)
      else navigate(`/admin/${collection}`)
    } catch (reason) {
      setError(reason.message || 'The item could not be saved.')
    } finally { setBusy(false) }
  }

  async function handleDelete(item) {
    const title = item[config.titleKey] || 'this item'
    if (!window.confirm(`Delete “${title}”?`)) return
    setBusy(true)
    setError('')
    try {
      await deleteAdminItem(collection, item.id)
      if (recordId) navigate(`/admin/${collection}`)
      else setItems((current) => current.filter(({ id }) => id !== item.id))
    } catch (reason) { setError(reason.message || 'The item could not be deleted.') }
    finally { setBusy(false) }
  }

  const editing = Boolean(recordId)
  const title = `${config.label}${newItem ? ' · New item' : editing ? ' · Edit item' : ''}`

  return (
    <AdminGate><main className="admin-page page-shell" id="main-content">
      <AdminHeader title={title} description={editing || newItem ? 'Keep each detail accurate and current.' : `Manage the ${config.label.toLowerCase()} shown across your portfolio.`} />
      <AdminNavigation />
      {error && <p className="admin-feedback admin-feedback-error" role="alert">{error} <button type="button" onClick={() => setAttempt((count) => count + 1)}>Retry</button></p>}
      {notice && <p className="admin-feedback admin-feedback-success" role="status">{notice}</p>}
      {!editing && !newItem && <div className="admin-list-heading"><h2>{config.label}</h2><Link className="button button-primary" to={`/admin/${collection}/new`}><Plus size={15} /> Add {config.label.toLowerCase().replace(/s$/, '')}</Link></div>}
      {(editing || newItem) ? <>
        <Link className="admin-back-link" to={`/admin/${collection}`}><ArrowLeft size={14} /> Back to {config.label.toLowerCase()}</Link>
        {!newItem && items.length === 0 && !error && <p role="status">Loading item…</p>}
        <form className="admin-form admin-content-form" onSubmit={handleSave}>
          <div className="admin-fields-grid">{formFields.map(([name, label, type]) => <label className={type === 'textarea' || type === 'list' ? 'admin-field-wide' : ''} key={name}>{label}
            {type === 'textarea' || type === 'list' ? <textarea rows={type === 'list' ? 4 : 3} value={form[name] ?? ''} onChange={(event) => setForm({ ...form, [name]: event.target.value })} required={['shortDescription', 'description', 'problem', 'solution', 'architecture'].includes(name)} /> :
              type === 'checkbox' ? <span className="admin-checkbox"><input type="checkbox" checked={Boolean(form[name])} onChange={(event) => setForm({ ...form, [name]: event.target.checked })} /> Featured on the homepage</span> :
                <input type={type} value={form[name] ?? ''} onChange={(event) => setForm({ ...form, [name]: event.target.value })} required={['title', 'slug', 'name', 'category', 'institution', 'degree', 'field', 'githubUrl', 'shortDescription', 'description', 'problem', 'solution', 'architecture', 'kind', 'status'].includes(name)} />}
          </label>)}</div>
          <button className="button button-primary" type="submit" disabled={busy}><Save size={15} /> {busy ? 'Saving…' : 'Save changes'}</button>
        </form>
      </> : <div className="admin-list">{items.map((item) => <article className="admin-list-item" key={item.id}>
        <div><h3>{item[config.titleKey] || '(No subject)'}</h3><p>{item.status && collection === 'projects' ? item.status : item.category || item.email || item.shortDescription || ''}</p></div>
        <div className="admin-list-actions"><Link to={`/admin/${collection}/${item.id}/edit`}>Edit <ArrowUpRight size={14} /></Link><button type="button" disabled={busy} onClick={() => handleDelete(item)} aria-label={`Delete ${item[config.titleKey] || 'item'}`}><Trash2 size={15} /> Delete</button></div>
      </article>)}{items.length === 0 && !error && <p className="resource-empty">No {collection} have been added yet.</p>}</div>}
    </main></AdminGate>
  )
}

function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    getAdminMessages().then((data) => { if (active) { setMessages(data); setError('') } }).catch((reason) => { if (active) setError(reason.message) })
    return () => { active = false }
  }, [attempt])
  async function setStatus(id, status) {
    try {
      const updated = await updateMessageStatus(id, status)
      setMessages((items) => items.map((item) => item.id === id ? updated : item))
    } catch (reason) { setError(reason.message) }
  }

  return <AdminGate><main className="admin-page page-shell" id="main-content">
    <AdminHeader title="Messages" description="Contact form submissions are stored here for private review." />
    <AdminNavigation />
    {error && <p className="admin-feedback admin-feedback-error" role="alert">{error} <button type="button" onClick={() => setAttempt((count) => count + 1)}>Retry</button></p>}
    <div className="admin-message-list">{messages.map((message) => <article className="admin-message" key={message.id}>
      <header><div><h2>{message.subject || 'Portfolio contact'}</h2><p>{message.name} · <a href={`mailto:${message.email}`}>{message.email}</a></p></div><select aria-label={`Status for message from ${message.name}`} value={message.status} onChange={(event) => setStatus(message.id, event.target.value)}>{['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => <option key={status}>{status}</option>)}</select></header>
      <p className="admin-message-body">{message.message}</p><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
    </article>)}{messages.length === 0 && !error && <p className="resource-empty">No messages yet.</p>}</div>
  </main></AdminGate>
}

export function AdminPage() {
  const { section = 'projects', recordId } = useParams()
  if (section === 'messages') return <AdminMessages />
  if (!fields[section]) return <Navigate to="/admin" replace />
  return <AdminCollection key={`${section}-${recordId || ''}-${location.pathname.endsWith('/new')}`} collection={section} />
}
