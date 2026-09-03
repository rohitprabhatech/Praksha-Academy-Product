import { Box, Typography, Button, Stack } from "@mui/material";
import { FaComments } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

/**
 * Conversion section for students who haven't picked a program yet.
 * Routes to whichever contact channel is actually configured.
 */
const AcademicAdvisor = () => {
  const { phone, whatsapp, email } = contactData;
  const href = phone ? `tel:${phone}` : whatsapp ? `https://wa.me/${whatsapp}` : email ? `mailto:${email}` : "#contact-form";

  return (
    <Box
      sx={{
        border: `1px solid ${colors.borderColor}`,
        borderRadius: "14px",
        p: { xs: 3, md: 4 },
        backgroundColor: colors.sectionBackground,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 3,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: 56,
          height: 56,
          minWidth: 56,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(37,99,235,0.1)",
          color: colors.primaryBlue,
          fontSize: 24,
        }}
      >
        <FaComments />
      </Box>
      <Stack sx={{ flex: 1 }} spacing={0.5}>
        <Typography variant="h6" sx={{ color: colors.textPrimary }}>
          Not sure which program is right for you?
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Talk to an academic advisor before you enroll — they can walk you
          through the options based on your class and goals.
        </Typography>
      </Stack>
      <Button
        variant="contained"
        color="primary"
        size="large"
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        sx={{ px: 3, py: 1.25, whiteSpace: "nowrap" }}
      >
        Talk to an Advisor
      </Button>
    </Box>
  );
};

export default AcademicAdvisor;
