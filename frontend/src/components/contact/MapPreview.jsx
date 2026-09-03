import { Box, Typography, Button } from "@mui/material";
import { FaMapMarkedAlt, FaExternalLinkAlt } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

/**
 * Only renders once a real address + map URL exist in contactData.js.
 * Uses a simple "open in Maps" link rather than an embedded iframe, so no
 * API key is needed and nothing breaks if one was never configured.
 * Swap in a real Google Maps embed here later if you want an inline map
 * instead of a link-out card.
 */
const MapPreview = () => {
  const { hasPhysicalAddress, address, mapUrl } = contactData;
  if (!hasPhysicalAddress || !address) return null;

  return (
    <Box
      sx={{
        borderRadius: "12px",
        border: `1px solid ${colors.borderColor}`,
        backgroundColor: colors.sectionBackground,
        p: 4,
        textAlign: "center",
      }}
    >
      <Box sx={{ color: colors.primaryBlue, fontSize: 28, mb: 1.5 }} aria-hidden="true">
        <FaMapMarkedAlt />
      </Box>
      <Typography variant="subtitle1" sx={{ color: colors.textPrimary, mb: 0.5 }}>
        {address}
      </Typography>
      {mapUrl && (
        <Button
          variant="outlined"
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          endIcon={<FaExternalLinkAlt size={12} />}
          sx={{ mt: 2, color: colors.primaryBlue, borderColor: colors.primaryBlue }}
        >
          Get Directions
        </Button>
      )}
    </Box>
  );
};

export default MapPreview;
