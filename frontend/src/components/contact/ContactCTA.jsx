import { Box, Typography, Button, Stack } from "@mui/material";
import { FaArrowRight, FaHeadset } from "react-icons/fa";
import { colors } from "../../theme/theme";

/**
 * Editorial closing banner for the Contact page — the "what should I do
 * next" moment the design brief calls for, instead of ending on the FAQ
 * accordion with no clear next step.
 */
const ContactCTA = () => {
  return (
    <Box
      className="pa-fade-up"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, #1E40AF 100%)`,
        color: colors.textWhite,
        px: { xs: 3, md: 6 },
        py: { xs: 5, md: 7 },
        textAlign: "center",
      }}
    >
      {/* Subtle decorative accent — restrained, on-brand, no stray gradients */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "rgba(245,158,11,0.12)",
        }}
      />

      <Typography variant="h3" sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 1.5, position: "relative" }}>
        Have a question? Start here.
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 480, mx: "auto", mb: 4, position: "relative" }}
      >
        Whether you're comparing courses or ready to enroll, there's a fast
        path to an answer.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" sx={{ position: "relative" }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          endIcon={<FaArrowRight />}
          href="/courses"
          sx={{ px: 4, py: 1.5 }}
        >
          Explore Courses
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<FaHeadset />}
          href="#top"
          sx={{
            px: 4,
            py: 1.5,
            color: colors.textWhite,
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": { borderColor: colors.textWhite, backgroundColor: "rgba(255,255,255,0.08)" },
          }}
        >
          Contact Support
        </Button>
      </Stack>
    </Box>
  );
};

export default ContactCTA;
