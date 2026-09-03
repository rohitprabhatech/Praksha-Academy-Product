import { Box, Typography, Button, Stack } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import { colors } from "../../theme/theme";

const CTASection = () => {
  return (
    <Box
      sx={{
        backgroundColor: colors.sectionBackground,
        borderRadius: "16px",
        p: { xs: 4, md: 6 },
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h2" sx={{ color: colors.textPrimary, mb: 2 }}>
        Ready to take your next step?
      </Typography>
      <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 4, maxWidth: 560, mx: "auto" }}>
        Browse our programs, or get in touch and we'll help you find the
        right one for your goals.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
        <Button variant="contained" color="primary" size="large" endIcon={<FaArrowRight />} href="/courses" sx={{ px: 4, py: 1.5 }}>
          Explore Programs
        </Button>
        <Button
          variant="outlined"
          size="large"
          href="/contact"
          sx={{
            px: 4,
            py: 1.5,
            color: colors.primaryBlue,
            borderColor: colors.primaryBlue,
            "&:hover": { backgroundColor: "rgba(37,99,235,0.06)", borderColor: colors.primaryBlueHover },
          }}
        >
          Talk to Us
        </Button>
      </Stack>
    </Box>
  );
};

export default CTASection;
