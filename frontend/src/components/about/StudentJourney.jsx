import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * Student journey: Discover → Choose → Learn → Practice → Mentorship →
 * Progress. Vertical connected timeline — works the same on all screen
 * sizes, avoids a desktop-only layout that breaks on mobile.
 */
const StudentJourney = () => {
  const steps = aboutData.studentJourney;

  return (
    <Box sx={{ position: "relative", pl: { xs: 4, md: 5 } }} role="list" aria-label="Student journey at Praksha Academy">
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          left: { xs: 15, md: 19 },
          top: 8,
          bottom: 8,
          width: 2,
          backgroundColor: colors.borderColor,
        }}
      />
      {steps.map((item, index) => (
        <Box key={item.step} role="listitem" sx={{ position: "relative", pb: index === steps.length - 1 ? 0 : 4 }}>
          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              left: { xs: -33, md: -41 },
              top: 2,
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: colors.cardBackground,
              border: `2px solid ${colors.primaryBlue}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: colors.primaryBlue,
            }}
          >
            {index + 1}
          </Box>
          <Typography variant="subtitle1" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 0.5 }}>
            {item.step}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
            {item.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StudentJourney;
