import { Box, Typography } from "@mui/material";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";
import mediaData from "../../data/mediaData";
import ImagePlaceholder from "../common/ImagePlaceholder";
import { useWebsite } from "../../context/WebsiteContext";

/**
 * Editorial "Who We Are" section.
 * Prefers tenant website CMS content when published.
 */
const WhoWeAre = () => {
  const { content } = useWebsite();
  const whoWeAre = content?.about?.whoWeAre || aboutData.whoWeAre;
  const { story, belief, approach } = whoWeAre;

  return (
    <div className="row g-5 align-items-center">
      <div className="col-lg-5">
        <ImagePlaceholder
          src={mediaData.whoWeAre}
          alt="Inside a Praksha Academy classroom"
          label="Photo coming soon"
          aspectRatio="4 / 5"
          borderRadius="18px"
        />
      </div>
      <div className="col-lg-7">
        <Typography variant="h4" sx={{ color: colors.textPrimary, fontSize: { xs: "1.6rem", md: "2rem" }, lineHeight: 1.25, mb: 3 }}>
          Who We Are
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: colors.primaryBlue, fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.8rem" }}>
            Our Story
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
            {story}
          </Typography>
        </Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ color: colors.primaryBlue, fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.8rem" }}>
            What We Believe
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
            {belief}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ color: colors.primaryBlue, fontWeight: 700, mb: 1, textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.8rem" }}>
            How We Teach
          </Typography>
          <Typography variant="body1" sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
            {approach}
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default WhoWeAre;
