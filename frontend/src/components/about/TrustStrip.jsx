import { Box, Typography } from "@mui/material";
import { FaChalkboardTeacher, FaTasks, FaHeadset, FaLayerGroup, FaBriefcase } from "react-icons/fa";
import { colors } from "../../theme/theme";

/**
 * Restrained credibility strip — describes HOW Praksha Academy teaches,
 * not unverified numbers. No claim here is a quantitative statistic;
 * if you want to add real numbers later (e.g. actual enrollment), do it
 * in aboutData.js and render them through a proper Statistics component
 * instead of adding fake figures here.
 */
const points = [
  { icon: <FaChalkboardTeacher />, label: "Experienced Faculty" },
  { icon: <FaTasks />, label: "Practical, Exercise-Led Learning" },
  { icon: <FaHeadset />, label: "Direct Student Support" },
  { icon: <FaLayerGroup />, label: "Structured Programs" },
  { icon: <FaBriefcase />, label: "Career-Focused Tracks" },
];

const TrustStrip = () => {
  return (
    <Box
      component="section"
      aria-label="What Praksha Academy offers"
      sx={{ backgroundColor: colors.cardBackground, borderBottom: `1px solid ${colors.borderColor}`, py: { xs: 3.5, md: 4.5 } }}
    >
      <div className="container">
        <div className="row justify-content-center g-3">
          {points.map((point) => (
            <div className="col-6 col-md-auto text-center" key={point.label}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, px: { md: 2 } }}>
                <Box sx={{ color: colors.primaryBlue, fontSize: 22 }}>{point.icon}</Box>
                <Typography variant="body2" sx={{ color: colors.textSecondary, fontWeight: 600, fontSize: "0.85rem" }}>
                  {point.label}
                </Typography>
              </Box>
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default TrustStrip;
