import { Avatar, LinearProgress } from '@mui/material'
import { FiStar } from 'react-icons/fi'
import './ReviewsSection.css'

function renderStars(rating) {
 return Array.from({ length: 5 }, (_, index) => (
  <FiStar className={index < Math.round(rating) ? 'is-filled' : ''} aria-hidden="true" key={index} />
 ))
}

function ReviewsSection({ rating, reviewCount, reviews = [], distribution = [] }) {
 return (
  <section className="course-section reviews-section" aria-labelledby="reviews-title">
   <div className="course-section-header">
    <span>Student Feedback</span>
    <h2 id="reviews-title">Reviews</h2>
   </div>

   <div className="reviews-summary-grid">
    <div className="reviews-overall" aria-label={`${rating} out of 5 from ${reviewCount} ratings`}>
     <strong>{rating}</strong>
     <div className="reviews-stars">{renderStars(rating)}</div>
     <span>{reviewCount.toLocaleString()} ratings</span>
    </div>

    <div className="reviews-distribution">
     {distribution.map((item) => (
      <div className="rating-row" key={item.stars}>
       <span>{item.stars} Stars</span>
       <LinearProgress
        variant="determinate"
        value={item.percentage}
        aria-label={`${item.stars} star reviews ${item.percentage}%`}
       />
       <strong>{item.percentage}%</strong>
      </div>
     ))}
    </div>
   </div>

   {reviews.length === 0 ? (
    <div className="reviews-empty-state">No reviews yet.</div>
   ) : (
    <div className="review-list">
     {reviews.map((review) => (
      <article className="review-card" key={review.id}>
       <Avatar className="review-avatar" aria-hidden="true">
        {review.name.charAt(0)}
       </Avatar>
       <div>
        <div className="review-card-header">
         <div>
          <h3>{review.name}</h3>
          <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>
           {renderStars(review.rating)}
          </div>
         </div>
         <span>{review.date}</span>
        </div>
        <p>{review.text}</p>
       </div>
      </article>
     ))}
    </div>
   )}
  </section>
 )
}

export default ReviewsSection
