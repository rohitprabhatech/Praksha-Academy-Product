import { Box, Typography, Paper } from "@mui/material";
import { FaAward } from "react-icons/fa";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * Recognition / awards / press section. Reads from aboutData.recognition,
 * which starts empty. Renders nothing until real, verifiable entries are
 * added — never invents awards, certifications, or press mentions.
 */
const Recognition = () => {
  const items = aboutData.recognition;
  if (items.length === 0) return null;

  return (
    <div className="row g-4">
      {items.map((item) => (
        <div className="col-md-4" key={item.title}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: "100%",
              border: `1px solid ${colors.borderColor}`,
              backgroundColor: colors.cardBackground,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                minWidth: 48,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(245, 158, 11, 0.12)",
                color: colors.secondaryOrange,
                fontSize: 20,
              }}
            >
              <FaAward />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                {item.title}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                {item.issuer} {item.year ? `· ${item.year}` : ""}
              </Typography>
            </Box>
          </Paper>
        </div>
      ))}
    </div>
  );
};

export default Recognition;
