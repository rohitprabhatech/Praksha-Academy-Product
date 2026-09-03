import { Box, Typography } from "@mui/material";
import { FaQuestion, FaListUl, FaHeadset, FaGraduationCap, FaArrowRight } from "react-icons/fa";
import { colors } from "../../theme/theme";

// A visual answer to "what happens after I reach out" — more useful on a
// contact page than another paragraph of prose.
const steps = [
  { icon: <FaQuestion />, title: "Have a Question" },
  { icon: <FaListUl />, title: "Choose a Program" },
  { icon: <FaHeadset />, title: "Talk to an Advisor" },
  { icon: <FaGraduationCap />, title: "Start Learning" },
];

const SupportFlow = () => {
  return (
    <Box
      className="pa-fade-up"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1.5, md: 1 },
      }}
    >
      {steps.map((step, index) => (
        <Box key={step.title} sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 1 } }}>
          <Box
            className="pa-hover-card"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              textAlign: "center",
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: "12px",
              p: 3,
              minWidth: 150,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(37,99,235,0.08)",
                color: colors.primaryBlue,
                fontSize: 18,
              }}
            >
              {step.icon}
            </Box>
            <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
              {step.title}
            </Typography>
          </Box>

          {index < steps.length - 1 && (
            <Box
              sx={{
                color: colors.dividerColor,
                fontSize: 16,
                transform: { xs: "rotate(90deg)", md: "none" },
              }}
            >
              <FaArrowRight />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default SupportFlow;
