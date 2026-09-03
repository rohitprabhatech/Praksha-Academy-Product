import { Avatar, Box, Typography } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * Faculty section. Reads from aboutData.faculty — starts empty on purpose.
 * Shows a clean "coming soon" state instead of inventing instructors.
 * Once real faculty data is added to aboutData.js, this component renders
 * it automatically with no code changes needed.
 */
const Faculty = () => {
  const faculty = aboutData.faculty;

  if (faculty.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          px: 3,
          border: `1px dashed ${colors.dividerColor}`,
          borderRadius: "12px",
          backgroundColor: colors.sectionBackground,
        }}
      >
        <Box sx={{ color: colors.textLight, fontSize: 32, mb: 2 }}>
          <FaChalkboardTeacher />
        </Box>
        <Typography variant="subtitle1" sx={{ color: colors.textPrimary, mb: 1 }}>
          Faculty profiles are being added
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary, maxWidth: 420, mx: "auto" }}>
          We're putting together instructor profiles for this page. In the
          meantime, course pages list the instructor for each program.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="row g-4">
      {faculty.map((member) => (
        <div className="col-sm-6 col-lg-3" key={member.name}>
          <Box
            className="pa-hover-card"
            sx={{
              textAlign: "center",
              backgroundColor: colors.cardBackground,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: "12px",
              p: 3,
              height: "100%",
            }}
          >
            <Avatar
              src={member.photo || undefined}
              alt={member.name}
              sx={{ width: 84, height: 84, mx: "auto", mb: 2, border: `3px solid ${colors.sectionBackground}` }}
            >
              {!member.photo && member.name?.[0]}
            </Avatar>
            <Typography variant="subtitle1" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
              {member.name}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.primaryBlue, fontWeight: 600, mb: 1 }}>
              {member.role}
            </Typography>
            {member.bio && (
              <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.6 }}>
                {member.bio}
              </Typography>
            )}
          </Box>
        </div>
      ))}
    </div>
  );
};

export default Faculty;
