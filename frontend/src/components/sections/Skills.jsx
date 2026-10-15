import { skillRows } from '../../data/skills.js'
import { getSkills } from '../../services/skillService.js'
import { useResource } from '../../hooks/useResource.js'
import Reveal from '../shared/Reveal.jsx'
import SectionHeading from '../shared/SectionHeading.jsx'
import ResourceState from '../shared/ResourceState.jsx'

function Skills() {
  const { data, status, error, retry } = useResource(getSkills, skillRows.flatMap((row) => row.items.map((name, index) => ({ id: `${row.id}-${name}`, name, category: row.label, sortOrder: index }))))
  const groups = data.reduce((result, skill) => {
    const group = result.find((item) => item.category === skill.category)
    if (group) group.items.push(skill)
    else result.push({ category: skill.category, items: [skill] })
    return result
  }, [])

  return (
    <section className="section-block section-skills" id="skills" aria-labelledby="skills-title">
      <div className="page-shell skills-layout">
        <Reveal>
          <SectionHeading number="04" eyebrow="Tools I use to build" title="Engineering skills" description="A practical snapshot of the technologies I’m using across my projects." id="skills-title" />
        </Reveal>
        <ResourceState status={status} error={error} retry={retry} label="skills" />
        {status !== 'empty' && <div className="skill-rows">
          {groups.map((row, index) => (
            <Reveal key={row.category} delay={index * 0.04}>
              <div className="skill-row">
                <h3>{row.category}</h3>
                <ul>{row.items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>}
      </div>
    </section>
  )
}

export default Skills
