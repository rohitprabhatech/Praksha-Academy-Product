import CreateBlog from './CreateBlog';

const MOCK_BLOG = {
  id: 1,
  title: 'Top 10 React Patterns in 2025',
  category: 'Technology',
  author: 'Rohan Mehta',
  thumbnail: null,
  content: 'React continues to evolve rapidly. In 2025, patterns like server components, concurrent rendering, and fine-grained subscriptions are shaping the way we build UIs...',
  tags: ['React', 'JS', 'Frontend'],
  seoTitle: 'Top 10 React Patterns 2025 | Praksha Academy',
  seoDescription: 'Explore the most important React design patterns every developer should know in 2025.',
  status: 'Published',
};

const EditBlog = () => {
  return <CreateBlog prefill={MOCK_BLOG} editMode />;
};

export default EditBlog;
