import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * "What Makes Us Different" — editorial list, not identical feature cards.
 * Each item explains a teaching principle in plain language.
 */
const Differentiators = () => {
  return (
    <Box>
      {aboutData.differentiators.map((item, index) => (
        <Box
          key={item.title}
          sx={{
            display: "flex",
            gap: { xs: 2.5, md: 4 },
            py: 3.5,
            borderBottom:
              index === aboutData.differentiators.length - 1 ? "none" : `1px solid ${colors.borderColor}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.borderColor,
              fontWeight: 700,
              minWidth: { xs: 40, md: 64 },
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </Typography>
          <Box>
            <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
              {item.title}
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.75, maxWidth: 640 }}>
              {item.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Differentiators;
