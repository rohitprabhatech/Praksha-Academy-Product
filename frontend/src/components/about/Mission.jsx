import { Box, Typography, Paper } from "@mui/material";
import { FaBullseye } from "react-icons/fa";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

const Mission = () => {
  return (
    <Paper
      elevation={0}
      className="pa-hover-card"
      sx={{ p: 4, height: "100%", border: `1px solid ${colors.borderColor}`, backgroundColor: colors.cardBackground }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          color: colors.primaryBlue,
          mb: 3,
          fontSize: 24,
        }}
        aria-hidden="true"
      >
        <FaBullseye />
      </Box>
      <Typography variant="h5" component="h3" sx={{ mb: 2, color: colors.textPrimary }}>
        Our Mission
      </Typography>
      <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
        {aboutData.mission}
      </Typography>
    </Paper>
  );
};

export default Mission;
