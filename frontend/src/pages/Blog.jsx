import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiFilter,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";
import SectionHeader from "../components/home/SectionHeader";

const blogPosts = [
  {
    title: "How to Choose the Right Program for Your Goals",
    excerpt:
      "Learn how Praksha Academy combines coaching, coding, and exam readiness so every student can progress with purpose.",
    category: "Guides",
    author: "Ananya Bhatt",
    date: "July 10, 2026",
    readTime: "6 min",
    tags: ["Programs", "Planning"],
  },
  {
    title: "Building Confidence in Spoken English with Daily Practice",
    excerpt:
      "Practical habits, classroom strategies, and communication exercises to help you speak more naturally and clearly.",
    category: "English",
    author: "Rahul Mehta",
    date: "June 28, 2026",
    readTime: "5 min",
    tags: ["Fluency", "Speaking"],
  },
  {
    title: "Why Project-Based Learning Makes Skills Stick",
    excerpt:
      "Explore how hands-on coding and academic projects help students retain concepts and build confidence faster.",
    category: "Programming",
    author: "Priya Sharma",
    date: "June 12, 2026",
    readTime: "7 min",
    tags: ["Coding", "Projects"],
  },
  {
    title: "Exam Strategy for School and Competitive Tests",
    excerpt:
      "A concise guide to building revision routines, managing time, and staying calm on test day.",
    category: "Exam Prep",
    author: "Sneha Gupta",
    date: "May 30, 2026",
    readTime: "4 min",
    tags: ["Revision", "Success"],
  },
  {
    title: "How to Turn Homework into Better Results",
    excerpt:
      "Small changes to daily study habits that can improve retention, understanding, and grades across subjects.",
    category: "Study Skills",
    author: "Karan Joshi",
    date: "May 15, 2026",
    readTime: "5 min",
    tags: ["Habits", "Learning"],
  },
];

const featuredTags = [
  "Guides",
  "English",
  "Programming",
  "Exam Prep",
  "Study Skills",
];

function Blog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = useMemo(
    () => ["All", ...new Set(blogPosts.map((post) => post.category))],
    [],
  );

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        post.title.toLowerCase().includes(normalizedSearch) ||
        post.excerpt.toLowerCase().includes(normalizedSearch) ||
        post.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Box
      sx={{
        backgroundColor: "#F8FAFC",
        minHeight: "100vh",
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 } }}>
        <SectionHeader
          title="Blog"
          subtitle="Insights, guides, and learning resources from Praksha Academy."
        />

        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "20px",
            p: { xs: 3, md: 5 },
            mb: 5,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                Fresh ideas for students, parents, and lifelong learners.
              </Typography>
              <Typography sx={{ color: "#64748B", lineHeight: 1.8 }}>
                Browse thoughtful articles about programming, English fluency,
                exam strategy, and effective study habits.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                sx={{ gap: 1 }}
              >
                {featuredTags.map((tag) => (
                  <Chip key={tag} label={tag} clickable size="small" />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #E2E8F0",
                borderRadius: "20px",
                p: { xs: 3, md: 4 },
                mb: 4,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    placeholder="Search articles, topics or authors"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    InputProps={{
                      startAdornment: (
                        <FiSearch color="#94A3B8" style={{ marginRight: 12 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "#F8FAFC",
                        "& fieldset": {
                          borderColor: "#E2E8F0",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Filter"
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <FiFilter color="#94A3B8" style={{ marginRight: 12 }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        backgroundColor: "#F8FAFC",
                        "& fieldset": {
                          borderColor: "#E2E8F0",
                        },
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>

            <Stack spacing={4}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Paper
                    key={post.title}
                    elevation={0}
                    sx={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "24px",
                      p: { xs: 3, md: 4 },
                      transition: "transform 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        flexWrap="wrap"
                      >
                        <Chip
                          label={post.category}
                          color="primary"
                          size="small"
                        />
                        <Typography sx={{ color: "#64748B" }}>
                          {post.date} • {post.readTime} read
                        </Typography>
                      </Stack>
                      <Typography
                        variant="h4"
                        component="h2"
                        sx={{ fontWeight: 800 }}
                      >
                        {post.title}
                      </Typography>
                      <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>
                        {post.excerpt}
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        flexWrap="wrap"
                      >
                        <Typography sx={{ color: "#334155", fontWeight: 700 }}>
                          {post.author}
                        </Typography>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ borderColor: "#E2E8F0" }}
                        />
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {post.tags.map((tag) => (
                            <Chip key={tag} label={`#${tag}`} size="small" />
                          ))}
                        </Stack>
                      </Stack>
                      <Button
                        endIcon={<FiArrowRight />}
                        sx={{ alignSelf: "flex-start" }}
                        onClick={() => {
                          // Generate a URL-friendly slug from the title
                          const generatedSlug = post.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-");
                          // Navigate and pass the post data in the state
                          navigate(`/blog/${generatedSlug}`, {
                            state: { post },
                          });
                        }}
                      >
                        Read article
                      </Button>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #E2E8F0",
                    borderRadius: "20px",
                    p: 6,
                    textAlign: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    No articles found
                  </Typography>
                  <Typography sx={{ color: "#64748B" }}>
                    Try another keyword or category to find what you need.
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  p: 4,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Trending Topics
                </Typography>
                <Stack spacing={1}>
                  {featuredTags.map((tag) => (
                    <Chip key={tag} label={tag} clickable />
                  ))}
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  p: 4,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Popular Reads
                </Typography>
                <Stack spacing={2}>
                  {blogPosts.slice(0, 3).map((post) => (
                    <Box key={post.title}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {post.title}
                      </Typography>
                      <Typography
                        sx={{ color: "#64748B", fontSize: "0.95rem" }}
                      >
                        {post.date}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "20px",
                  p: 4,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Join the newsletter
                  </Typography>
                  <Typography sx={{ color: "#64748B", lineHeight: 1.7 }}>
                    Get new blog posts, learning tips, and program updates
                    delivered to your inbox.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<FiTrendingUp />}
                  >
                    Subscribe now
                  </Button>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Blog;
