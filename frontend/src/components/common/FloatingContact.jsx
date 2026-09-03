import { useState, useEffect } from "react";
import { Box, Tooltip, Zoom, useMediaQuery } from "@mui/material";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

/**
 * Sticky bottom-right instant-contact buttons — WhatsApp + Call.
 *
 * Reads phone/WhatsApp numbers from src/data/contactData.js. A channel is
 * only rendered if its value is set; if both are null, the component
 * renders nothing.
 *
 * IMPORTANT — before mounting this on a page: check whether the "Common
 * Components" owner (@omkarghule's branch) already ships a global floating
 * contact button (e.g. mounted once in App.jsx). If so, use that one
 * instead and don't import this component here — two floating buttons
 * stacking on screen is a real bug, not a style choice.
 */
const FloatingContact = () => {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { phone, whatsapp, academyName } = contactData;
  if (!phone && !whatsapp) return null; // nothing configured yet — render nothing

  const buttonSx = {
    width: 52,
    height: 52,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.textWhite,
    fontSize: 22,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: prefersReducedMotion ? "none" : "transform 0.25s ease",
    "&:hover": prefersReducedMotion ? {} : { transform: "scale(1.08)" },
    "&:focus-visible": {
      outline: `3px solid ${colors.primaryBlue}`,
      outlineOffset: "2px",
    },
  };

  const content = (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 20, md: 28 },
        // keep clear of any bottom mobile nav / form submit bars
        right: { xs: 16, md: 28 },
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {whatsapp && (
        <Tooltip title="Chat on WhatsApp" placement="left">
          <Box
            component="a"
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
              `Hi! I'd like to know more about ${academyName} courses.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ...buttonSx, backgroundColor: "#25D366" }}
            aria-label="Chat with us on WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
          </Box>
        </Tooltip>
      )}
      {phone && (
        <Tooltip title="Call us" placement="left">
          <Box
            component="a"
            href={`tel:${phone}`}
            sx={{ ...buttonSx, backgroundColor: colors.primaryBlue }}
            aria-label={`Call ${academyName}`}
          >
            <FaPhoneAlt size={18} aria-hidden="true" />
          </Box>
        </Tooltip>
      )}
    </Box>
  );

  if (prefersReducedMotion) {
    return visible ? content : null;
  }

  return <Zoom in={visible}>{content}</Zoom>;
};

export default FloatingContact;
