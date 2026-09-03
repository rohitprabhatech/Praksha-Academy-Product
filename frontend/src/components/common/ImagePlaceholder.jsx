import { Box, Typography } from "@mui/material";
import { FaImage } from "react-icons/fa";
import { colors } from "../../theme/theme";

/**
 * Renders a real <img> when `src` is provided, otherwise renders a clean,
 * intentional placeholder instead of a broken image or a fake stock photo.
 *
 * This is the single place that decides what "no image yet" looks like on
 * the About/Contact pages — change the placeholder style here once rather
 * than in every section that needs an image.
 */
const ImagePlaceholder = ({
  src,
  alt = "",
  label = "Image coming soon",
  aspectRatio = "4 / 3",
  borderRadius = "16px",
  icon,
  sx = {},
}) => {
  if (src) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        className="pa-image-hover"
        sx={{
          width: "100%",
          aspectRatio,
          objectFit: "cover",
          borderRadius,
          display: "block",
          ...sx,
        }}
      />
    );
  }

  return (
    <Box
      role="img"
      aria-label={alt || label}
      sx={{
        width: "100%",
        aspectRatio,
        borderRadius,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        backgroundColor: colors.sectionBackground,
        border: `1px dashed ${colors.dividerColor}`,
        color: colors.textLight,
        ...sx,
      }}
    >
      <Box sx={{ fontSize: 28, color: colors.textLight }}>{icon || <FaImage />}</Box>
      <Typography variant="caption" sx={{ color: colors.textLight, textAlign: "center", px: 2 }}>
        {label}
      </Typography>
    </Box>
  );
};

export default ImagePlaceholder;
