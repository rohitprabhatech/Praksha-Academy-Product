import { Box, Typography, Paper } from "@mui/material";
import { FaHandHoldingHeart, FaBalanceScale, FaChartLine, FaUsers } from "react-icons/fa";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

const icons = [FaHandHoldingHeart, FaBalanceScale, FaChartLine, FaUsers];

const Values = () => {
  return (
    <div className="row g-4">
      {aboutData.values.map((value, index) => {
        const Icon = icons[index % icons.length];
        return (
          <div className="col-sm-6 col-lg-3" key={value.title}>
            <Paper
              elevation={0}
              className="pa-hover-card"
              sx={{ p: 3.5, height: "100%", border: `1px solid ${colors.borderColor}`, backgroundColor: colors.cardBackground }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  color: colors.primaryBlue,
                  mb: 2.5,
                  fontSize: 22,
                }}
                aria-hidden="true"
              >
                <Icon />
              </Box>
              <Typography variant="subtitle1" sx={{ color: colors.textPrimary, fontWeight: 600, mb: 1 }}>
                {value.title}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
                {value.description}
              </Typography>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

export default Values;
