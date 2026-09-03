import { Box, Typography } from "@mui/material";
import { FaArrowRight, FaArrowDown } from "react-icons/fa";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * Learning philosophy loop: Understand → Practice → Apply → Feedback →
 * Improve → Confidence. Horizontal connected flow on desktop, vertical
 * stack on mobile.
 */
const LearningPhilosophy = () => {
  const steps = aboutData.learningPhilosophy;

  return (
    <Box>
      {/* Desktop: horizontal flow */}
      <Box
        sx={{ display: { xs: "none", md: "flex" }, alignItems: "stretch", gap: 0 }}
        role="list"
        aria-label="Praksha Academy learning philosophy steps"
      >
        {steps.map((item, index) => (
          <Box key={item.step} sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Box
              role="listitem"
              sx={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: "12px",
                p: 2.5,
                textAlign: "center",
                flex: 1,
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="subtitle1" sx={{ color: colors.primaryBlue, fontWeight: 700, mb: 1 }}>
                {item.step}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.6, fontSize: "0.82rem" }}>
                {item.description}
              </Typography>
            </Box>
            {index < steps.length - 1 && (
              <Box sx={{ color: colors.dividerColor, px: 1, flexShrink: 0 }} aria-hidden="true">
                <FaArrowRight />
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Mobile: simple vertical stack */}
      <Box sx={{ display: { xs: "block", md: "none" } }} role="list" aria-label="Praksha Academy learning philosophy steps">
        {steps.map((item, index) => (
          <Box key={item.step} role="listitem">
            <Box
              sx={{
                backgroundColor: colors.cardBackground,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: "12px",
                p: 2.5,
              }}
            >
              <Typography variant="subtitle1" sx={{ color: colors.primaryBlue, fontWeight: 700, mb: 0.5 }}>
                {item.step}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.6 }}>
                {item.description}
              </Typography>
            </Box>
            {index < steps.length - 1 && (
              <Box sx={{ color: colors.dividerColor, textAlign: "center", py: 1 }} aria-hidden="true">
                <FaArrowDown />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LearningPhilosophy;
