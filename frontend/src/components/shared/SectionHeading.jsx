function SectionHeading({ number, eyebrow, title, description, id }) {
  return (
    <div className="section-heading">
      <div className="section-heading-top">
        {number && <span className="section-number">{number}</span>}
        <p className="section-eyebrow">{eyebrow}</p>
      </div>
      <h2 id={id}>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  )
}

export default SectionHeading
