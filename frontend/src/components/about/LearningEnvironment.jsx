import { Box, Typography } from "@mui/material";
import { FaVideo, FaPencilRuler, FaUserFriends, FaChartLine } from "react-icons/fa";
import { colors } from "../../theme/theme";
import ImagePlaceholder from "../common/ImagePlaceholder";
import mediaData from "../../data/mediaData";

// "What learning feels like here" — four concrete parts of taking a course,
// not abstract values. Each pairs with an image slot in mediaData.js so
// real classroom/practice photos can be dropped in later with no code
// changes.
const environment = [
  {
    key: "liveClasses",
    icon: <FaVideo />,
    title: "Live Classes",
    description: "Real-time sessions with a teacher, not just a pre-recorded video queue.",
  },
  {
    key: "practice",
    icon: <FaPencilRuler />,
    title: "Practice",
    description: "Structured exercises and problem sets tied directly to what was just taught.",
  },
  {
    key: "mentorship",
    icon: <FaUserFriends />,
    title: "Mentorship",
    description: "A teacher reviews your work and answers questions — you're not learning alone.",
  },
  {
    key: "progressTracking",
    icon: <FaChartLine />,
    title: "Progress Tracking",
    description: "See what you've completed and where you're stuck, from your student dashboard.",
  },
];

const LearningEnvironment = () => {
  return (
    <div className="row g-4">
      {environment.map((item, index) => (
        <div className="col-6 col-md-3" key={item.key}>
          <Box className={`pa-hover-card pa-fade-up pa-delay-${(index % 4) + 1}`} sx={{ height: "100%" }}>
            <ImagePlaceholder
              src={mediaData.learningEnvironment[item.key]}
              alt={item.title}
              label={`${item.title} photo coming soon`}
              aspectRatio="4 / 3"
              borderRadius="12px 12px 0 0"
            />
            <Box
              sx={{
                p: 2.5,
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.borderColor}`,
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <Box sx={{ color: colors.primaryBlue, fontSize: 20, mb: 1 }}>{item.icon}</Box>
              <Typography variant="subtitle1" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 0.5 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.6 }}>
                {item.description}
              </Typography>
            </Box>
          </Box>
        </div>
      ))}
    </div>
  );
};

export default LearningEnvironment;
