import AddTestimonial from './AddTestimonial';

const MOCK_TESTIMONIAL = {
  id: 1,
  name: 'Aditi Sharma',
  role: 'React Developer',
  course: 'React & Modern JS',
  content: 'Amazing course! Really helped me land my first job. The instructors are incredibly knowledgeable and the projects were very practical.',
  rating: 5,
  status: 'Published',
  avatar: null,
};

const EditTestimonial = () => <AddTestimonial prefill={MOCK_TESTIMONIAL} editMode />;

export default EditTestimonial;
