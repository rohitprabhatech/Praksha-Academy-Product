function SectionHeader({ title, subtitle, badge }) {
 return (
  <div className="section-header" data-aos="fade-up">
   {badge && <span className="section-badge">{badge}</span>}
   <h2 className="section-title">{title}</h2>
   <p className="section-subtitle">{subtitle}</p>
  </div>
 )
}

export default SectionHeader