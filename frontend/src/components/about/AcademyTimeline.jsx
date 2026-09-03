import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * Academy history timeline. Reads from aboutData.timeline, which starts
 * empty. Renders nothing until real founding/milestone dates are added —
 * never invents a founding year or history. The parent page (About.jsx)
 * also skips the surrounding section heading when this returns null.
 */
const AcademyTimeline = () => {
  const milestones = aboutData.timeline;
  if (milestones.length === 0) return null;

  return (
    <Box sx={{ position: "relative", pl: { xs: 5, md: 6 } }}>
      <span className="pa-timeline-line" aria-hidden="true" />
      {milestones.map((item, index) => (
        <Box key={item.year} sx={{ position: "relative", pb: index === milestones.length - 1 ? 0 : 5 }}>
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              left: { xs: -33, md: -40 },
              top: 4,
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: colors.primaryBlue,
              border: `3px solid ${colors.cardBackground}`,
              boxShadow: `0 0 0 3px ${colors.primaryBlue}`,
            }}
          />
          <Typography variant="subtitle2" sx={{ color: colors.primaryBlue, fontWeight: 700, mb: 0.5 }}>
            {item.year}
          </Typography>
          <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
            {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
            {item.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AcademyTimeline;
