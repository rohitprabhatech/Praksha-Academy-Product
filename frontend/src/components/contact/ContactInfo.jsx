import { Box, Typography, Stack, IconButton } from "@mui/material";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

const socialIcons = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

/**
 * Reads every value from src/data/contactData.js. Any channel left null
 * there is simply not rendered — no placeholder numbers or addresses ever
 * appear on screen.
 */
const ContactInfo = () => {
  const { address, hasPhysicalAddress, phone, email, socialLinks } = contactData;

  const infoItems = [
    hasPhysicalAddress && address && { icon: <FaMapMarkerAlt />, label: "Visit Us", value: address },
    phone && { icon: <FaPhoneAlt />, label: "Call Us", value: phone, href: `tel:${phone}` },
    email && { icon: <FaEnvelope />, label: "Email Us", value: email, href: `mailto:${email}` },
  ].filter(Boolean);

  const activeSocials = Object.entries(socialLinks).filter(([, url]) => Boolean(url));

  return (
    <Box sx={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.borderColor}`, borderRadius: "12px", p: { xs: 3, md: 4 } }}>
      <Typography variant="h5" component="h3" sx={{ color: colors.textPrimary, mb: 3 }}>
        Contact Information
      </Typography>

      {infoItems.length === 0 ? (
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Contact details are being finalized. In the meantime, use the form
          on this page and we'll get back to you.
        </Typography>
      ) : (
        <Stack spacing={3} sx={{ mb: activeSocials.length ? 4 : 0 }}>
          {infoItems.map((item) => (
            <Stack direction="row" spacing={2} key={item.label} alignItems="flex-start">
              <Box
                aria-hidden="true"
                sx={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  borderRadius: "10px",
                  backgroundColor: "rgba(37,99,235,0.08)",
                  color: colors.primaryBlue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {item.icon}
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                  {item.label}
                </Typography>
                {item.href ? (
                  <Typography
                    component="a"
                    href={item.href}
                    variant="body2"
                    sx={{ color: colors.textSecondary, textDecoration: "none", "&:hover": { color: colors.primaryBlue } }}
                  >
                    {item.value}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    {item.value}
                  </Typography>
                )}
              </Box>
            </Stack>
          ))}
        </Stack>
      )}

      {activeSocials.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 1.5 }}>
            Follow Us
          </Typography>
          <Stack direction="row" spacing={1}>
            {activeSocials.map(([key, url]) => {
              const Icon = socialIcons[key];
              return (
                <IconButton
                  key={key}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Praksha Academy on ${key}`}
                  sx={{
                    backgroundColor: colors.sectionBackground,
                    color: colors.textSecondary,
                    transition: "all 0.3s ease",
                    "&:hover": { backgroundColor: colors.primaryBlue, color: colors.textWhite },
                  }}
                >
                  <Icon size={16} />
                </IconButton>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ContactInfo;
