import { Box, Typography, Paper } from "@mui/material";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

/**
 * Immediately-actionable contact cards. Each card only renders if the
 * matching channel is configured in contactData.js — no dead links, no
 * fake numbers. Links use proper deep-linking (tel:, mailto:, wa.me,
 * Maps URL) so mobile opens the right app.
 */
const QuickActions = () => {
  const { phone, whatsapp, email, hasPhysicalAddress, mapUrl, academyName } = contactData;

  const actions = [
    phone && {
      icon: <FaPhoneAlt />,
      title: "Call Us",
      subtitle: phone,
      href: `tel:${phone}`,
      color: colors.primaryBlue,
      bg: "rgba(37,99,235,0.08)",
    },
    whatsapp && {
      icon: <FaWhatsapp />,
      title: "WhatsApp",
      subtitle: "Chat with us",
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I'd like to know more about ${academyName}.`)}`,
      external: true,
      color: "#25D366",
      bg: "rgba(37,211,102,0.1)",
    },
    email && {
      icon: <FaEnvelope />,
      title: "Email Us",
      subtitle: email,
      href: `mailto:${email}`,
      color: colors.secondaryOrange,
      bg: "rgba(245,158,11,0.1)",
    },
    hasPhysicalAddress && mapUrl && {
      icon: <FaMapMarkerAlt />,
      title: "Visit Us",
      subtitle: "Get directions",
      href: mapUrl,
      external: true,
      color: colors.errorRed,
      bg: "rgba(239,68,68,0.08)",
    },
  ].filter(Boolean);

  if (actions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, textAlign: "center", border: `1px solid ${colors.borderColor}`, borderRadius: "12px", backgroundColor: colors.sectionBackground }}
      >
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Contact channels are being finalized — please use the form below in the meantime.
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="row g-3">
      {actions.map((action) => (
        <div className="col-6 col-md-3" key={action.title}>
          <Paper
            component="a"
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            elevation={0}
            className="pa-hover-card"
            sx={{
              display: "block",
              textDecoration: "none",
              textAlign: "center",
              p: 3,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: "12px",
              backgroundColor: colors.cardBackground,
              "&:focus-visible": { outline: `3px solid ${colors.primaryBlue}`, outlineOffset: "2px" },
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 48,
                height: 48,
                mx: "auto",
                mb: 1.5,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: action.bg,
                color: action.color,
                fontSize: 20,
              }}
            >
              {action.icon}
            </Box>
            <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
              {action.title}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary, wordBreak: "break-word" }}>
              {action.subtitle}
            </Typography>
          </Paper>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
