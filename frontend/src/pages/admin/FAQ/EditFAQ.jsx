import AddFAQ from './AddFAQ';

const MOCK_FAQ = {
  id: 1,
  question: 'How do I enroll in a course?',
  answer: 'To enroll in a course, navigate to the Courses page, select your desired course, and click the "Enroll Now" button. You will be guided through the payment process. Once payment is complete, the course will appear in your student dashboard.',
  category: 'Enrollment',
  status: 'Active',
};

const EditFAQ = () => <AddFAQ prefill={MOCK_FAQ} editMode />;

export default EditFAQ;
