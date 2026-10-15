import { ArrowUpRight, Code2 } from 'lucide-react'
import { projects } from '../../data/projects.js'
import { getGitHubProfile, getSelectedRepos } from '../../services/githubService.js'
import { useResource } from '../../hooks/useResource.js'
import { links } from '../../data/links.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import ResourceState from '../shared/ResourceState.jsx'

function GitHub() {
  const { data: profile, status: profileStatus, error: profileError, retry: retryProfile } = useResource(getGitHubProfile, null)
  const { data: repositories, status, error, retry } = useResource(getSelectedRepos, projects.map((project) => ({
    name: project.repository.split('/').filter(Boolean).at(-1),
    description: project.kind,
    url: project.repository,
  })))

  return (
    <section className="section-block section-github" id="github" aria-labelledby="github-title">
      <div className="page-shell">
        <Reveal>
          <SectionHeading number="07" eyebrow="GitHub" title="Selected repositories" description="Browse the code and follow the projects as they grow." id="github-title" />
        </Reveal>
        {profile && <p className="github-account"><strong>{profile.name || `@${profile.username}`}</strong>{profile.bio && <span>{profile.bio}</span>}</p>}
        <ResourceState status={profileStatus} error={profileError} retry={retryProfile} label="GitHub profile" />
        <ResourceState status={status} error={error} retry={retry} label="selected repositories" />
        {status === 'empty' ? <p className="resource-empty">No selected repositories were returned by GitHub.</p> : <div className="github-repositories">
          {repositories.map((repository, index) => (
            <Reveal key={repository.fullName || repository.name} delay={index * 0.04}>
              <a className="github-repository" href={repository.url} target="_blank" rel="noreferrer">
                <span className="github-repository-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="github-repository-copy"><strong>{repository.name}</strong><small>{repository.description || repository.language || 'Public repository'}</small></span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </Reveal>
          ))}
        </div>}
        <Reveal className="github-profile-link-wrap">
          <a className="button button-secondary" href={links.github} target="_blank" rel="noreferrer"><Code2 size={16} aria-hidden="true" /> Visit GitHub profile <ArrowUpRight size={15} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  )
}

export default GitHub
