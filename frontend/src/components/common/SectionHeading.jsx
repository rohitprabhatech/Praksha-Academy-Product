import { Typography } from "@mui/material";
import { colors } from "../../theme/theme";

/**
 * Shared section heading — was previously defined inline and duplicated in
 * both pages/About.jsx and pages/Contact.jsx. Centralized here so both
 * pages (and any future section) stay visually identical automatically.
 */
const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => (
  <div className={`row ${align === "center" ? "justify-content-center text-center" : ""} mb-5`}>
    <div className={align === "center" ? "col-lg-7" : "col-12"}>
      {eyebrow && (
        <Typography variant="overline" sx={{ color: colors.primaryBlue, fontWeight: 600, letterSpacing: 1.5 }}>
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h2"
        component="h2"
        sx={{ color: colors.textPrimary, mt: eyebrow ? 1 : 0, mb: 2, fontSize: { xs: "1.75rem", md: "2.25rem" } }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ color: colors.textSecondary }}>
          {subtitle}
        </Typography>
      )}
    </div>
  </div>
);

export default SectionHeading;
