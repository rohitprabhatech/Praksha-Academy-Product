import { Box, Typography, Stack } from "@mui/material";
import { FaClock } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

/**
 * Reads contactData.workingHours, which is null until confirmed. Renders a
 * short honest placeholder instead of invented hours.
 */
const WorkingHours = () => {
  const hours = contactData.workingHours;

  return (
    <Box sx={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.borderColor}`, borderRadius: "12px", p: { xs: 3, md: 4 } }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Box sx={{ color: colors.secondaryOrange, fontSize: 20 }} aria-hidden="true">
          <FaClock />
        </Box>
        <Typography variant="h6" component="h3" sx={{ color: colors.textPrimary }}>
          Working Hours
        </Typography>
      </Stack>

      {!hours ? (
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          Working hours will be listed here once confirmed.
        </Typography>
      ) : (
        <Stack spacing={1.5} divider={<Box sx={{ borderBottom: `1px solid ${colors.dividerColor}` }} />}>
          {hours.map((item) => (
            <Stack direction="row" justifyContent="space-between" key={item.day} sx={{ py: 0.5 }}>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {item.day}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: item.time === "Closed" ? colors.errorRed : colors.textPrimary, fontWeight: 600 }}
              >
                {item.time}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default WorkingHours;
