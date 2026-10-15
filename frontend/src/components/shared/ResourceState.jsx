function ResourceState({ status, error, retry, label }) {
  if (status === 'success') return null

  const message = status === 'loading'
    ? `Loading live ${label}… saved portfolio content remains visible.`
    : status === 'empty'
      ? `No ${label} are published yet.`
      : `Live ${label} could not be loaded${error ? `: ${error}` : ''}. Showing saved portfolio content.`

  return (
    <div className={`resource-state resource-state-${status}`} role={status === 'error' ? 'alert' : 'status'}>
      <span>{message}</span>
      {status !== 'loading' && <button type="button" onClick={retry}>Retry</button>}
    </div>
  )
}

export default ResourceState
