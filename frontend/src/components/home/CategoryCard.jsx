function CategoryCard({ title, subtitle, icon }) {
 return (
  <div className="card-surface category-card">
   <div className="category-icon">{icon}</div>
   <h3>{title}</h3>
   <p>{subtitle}</p>
  </div>
 )
}

export default CategoryCard