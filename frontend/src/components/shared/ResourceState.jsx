function ResourceState({ status, error, retry, label, hasFallback = true }) {
  if (status === 'success') return null

  const message = status === 'loading'
    ? `Loading live ${label}… existing content remains visible.`
    : status === 'empty'
      ? `No ${label} are published yet.`
      : `Live ${label} could not be loaded${error ? `: ${error}` : ''}.${hasFallback ? ' Keeping available content visible.' : ''}`

  return (
    <div className={`resource-state resource-state-${status}`} role={status === 'error' ? 'alert' : 'status'}>
      <span>{message}</span>
      {status !== 'loading' && <button type="button" onClick={retry}>Retry</button>}
    </div>
  )
}

export default ResourceState
