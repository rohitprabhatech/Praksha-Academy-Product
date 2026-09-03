import { Box, Typography } from "@mui/material";
import { FaLaptop } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

/**
 * Praksha Academy's physical-location status isn't confirmed
 * (contactData.hasPhysicalAddress). Rather than inventing branch
 * addresses, this shows a location-independent support message.
 *
 * Once real offline centers are confirmed: build a BranchLocator that
 * reads from a `branches` array in contactData.js (city, address, phone,
 * hours) instead of hardcoding cards here.
 */
const OnlineSupport = () => {
  if (contactData.hasPhysicalAddress) return null; // real address exists — a proper branch/map section should be used instead

  return (
    <Box
      sx={{
        textAlign: "center",
        border: `1px dashed ${colors.dividerColor}`,
        borderRadius: "12px",
        backgroundColor: colors.sectionBackground,
        py: 5,
        px: 3,
      }}
    >
      <Box sx={{ color: colors.primaryBlue, fontSize: 30, mb: 2 }} aria-hidden="true">
        <FaLaptop />
      </Box>
      <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 1 }}>
        Online Learning Support
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, maxWidth: 480, mx: "auto" }}>
        Praksha Academy classes are delivered online — reach us through the
        contact options on this page rather than visiting an office.
      </Typography>
    </Box>
  );
};

export default OnlineSupport;
