import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi'


const fullArticleContent = {
  'How to Choose the Right Program for Your Goals': `Choosing the right academic or skill-building program is one of the most critical decisions a student can make. It sets the foundation for future career paths and personal confidence.

At Praksha Academy, we understand that no two students are alike. Some thrive in highly structured, exam-focused environments, while others need project-based learning to truly grasp complex concepts like coding and web development.

Here is a simple framework to help you choose:
1. Identify your immediate goal: Is it board exam readiness, or building a future-proof tech skill?
2. Assess your current bandwidth: Ensure you have the time to dedicate to assignments and practice.
3. Consult a mentor: Our academic advisors are always available to help map out your trajectory.

Remember, the goal isn't just to pass a test, but to progress with purpose and build skills that stick.`,

  'Building Confidence in Spoken English with Daily Practice': `Fluency in Spoken English is rarely achieved by just reading grammar books. It is built through consistent, daily verbal practice.

Many students feel anxious when speaking, fearing they will make grammatical errors or struggle to find the right word. This is completely normal. 

Effective Daily Habits:
• Shadowing: Listen to a native speaker (via podcasts or videos) and try to mimic their intonation and pacing.
• Think in English: Force your internal monologue to switch languages. If you are cooking, narrate what you are doing in English.
• Safe Practice Spaces: Join peer groups where making mistakes is encouraged, not mocked.

At the academy, our communication exercises prioritize getting your point across first, and refining the grammar second. Confidence is the key to fluency.`,

  'Why Project-Based Learning Makes Skills Stick': `When learning to code, it is incredibly easy to fall into "tutorial hell"—the cycle of watching tutorial after tutorial without ever writing an original line of code.

Project-based learning breaks this cycle. By focusing on a tangible end goal—like building a calculator, a weather app, or a personal portfolio—students are forced to solve real problems. 

The Benefits:
• Contextual Learning: You understand why a loop or a function is needed, rather than just how to write it.
• Debugging Skills: You will encounter bugs that tutorials don't cover, forcing you to read documentation and use problem-solving skills.
• Portfolio Building: You finish the course with actual projects you can show to future schools or employers.

Theory is important, but application is what makes the knowledge permanent.`,

  'Exam Strategy for School and Competitive Tests': `Success in board exams and competitive tests comes down to two things: structured revision and stress management.

1. The 80/20 Rule of Revision
Focus 80% of your energy on the core concepts that yield the highest marks. Analyze past papers to identify these recurring themes.

2. Spaced Repetition
Reviewing a topic immediately after learning it, then 3 days later, then a week later, drastically improves long-term memory retention compared to cramming the night before.

3. Mock Tests Under Exam Conditions
Taking tests in a relaxed environment does not prepare you for the pressure of the actual exam hall. Time yourself, remove distractions, and sit for the full duration of the paper. This builds both mental stamina and time management skills.`,

  'How to Turn Homework into Better Results': `Homework is often viewed as a chore, a box to check off before you can relax. But when approached correctly, it is the most powerful tool for academic improvement.

Instead of rushing through assignments, use them to identify your weak spots. 

The Review Method:
• Attempt the homework without looking at your notes first. This tests your actual recall.
• When you get stuck, don't immediately ask for the answer. Review the concept, then try again.
• For any question you get wrong, write down exactly why you got it wrong. Was it a calculation error? A misunderstood concept?

By changing your relationship with homework from a "task to finish" to a "diagnostic tool," you will see your grades naturally begin to rise.`
}

function BlogDetail() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Grab the basic post data passed from the Blog.jsx button
  const post = location.state?.post

  if (!post) {
    return (
      <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '80vh', display: 'flex', alignItems: 'center', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '24px', p: 6, textAlign: 'center', backgroundColor: '#FFFFFF' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#1E293B' }}>
              Article Not Found
            </Typography>
            <Typography sx={{ color: '#64748B', mb: 4 }}>
              The article you are looking for does not exist or has been removed.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/blog')}>
              Back to Blog
            </Button>
          </Paper>
        </Container>
      </Box>
    )
  }

  // Look up the full content based on the title. If not found, fall back to the excerpt.
  const articleContent = fullArticleContent[post.title] || post.excerpt

  return (
    <Box sx={{ backgroundColor: '#F8FAFC', minHeight: '100vh', pb: { xs: 8, md: 12 } }}>
      <Container maxWidth="md" sx={{ pt: { xs: 6, md: 8 } }}>
        
        <Button
          startIcon={<FiArrowLeft />}
          onClick={() => navigate('/blog')}
          sx={{ mb: 4, color: '#64748B', textTransform: 'none', fontWeight: 600, '&:hover': { color: '#2563EB' } }}
        >
          Back to articles
        </Button>

        <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '24px', p: { xs: 3, md: 6 }, backgroundColor: '#FFFFFF' }}>
          <Stack spacing={3}>
            
            {/* Meta Information */}
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
              <Chip label={post.category} color="primary" size="small" />
              <Typography sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}>
                <FiCalendar /> {post.date}
              </Typography>
              <Typography sx={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}>
                <FiClock /> {post.readTime}
              </Typography>
            </Stack>

            {/* Title & Author */}
            <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#1E293B', lineHeight: 1.3 }}>
              {post.title}
            </Typography>
            
            <Typography sx={{ color: '#334155', fontWeight: 700, fontSize: '1.05rem' }}>
              By {post.author}
            </Typography>

            <Divider sx={{ borderColor: '#E2E8F0', my: 1 }} />

            {/* Article Content (Now pulls from the dictionary above) */}
            <Box sx={{ typography: 'body1', color: '#475569', lineHeight: 1.9, fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
              {articleContent}
            </Box>

            <Divider sx={{ borderColor: '#E2E8F0', mt: 4, mb: 2 }} />

            {/* Tags */}
            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
              <Typography sx={{ color: '#64748B', mr: 1, fontWeight: 600 }}>Tags:</Typography>
              {post.tags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ color: '#64748B', borderColor: '#E2E8F0' }} />
              ))}
            </Stack>

          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default BlogDetail