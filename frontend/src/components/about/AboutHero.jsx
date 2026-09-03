import { useState, useRef } from "react";
import { Box, Typography, Button, Stack, useMediaQuery } from "@mui/material";
import { FaArrowRight, FaPlayCircle, FaHeadset, FaBookOpen } from "react-icons/fa";
import { colors } from "../../theme/theme";
import VideoModal from "../common/VideoModal";
import ImagePlaceholder from "../common/ImagePlaceholder";
import aboutData from "../../data/aboutData";
import mediaData from "../../data/mediaData";

/**
 * Two-column hero: text + CTAs on the left, a large editorial image with a
 * small floating accent card on the right. Previously this hero was
 * centered text only with no visual — the single biggest gap flagged in
 * the design brief. The image slot degrades gracefully to a clean
 * placeholder via ImagePlaceholder until a real photo is set in
 * mediaData.js — no fabricated stock photo is used here.
 */
const AboutHero = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoButtonRef = useRef(null);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const fadeClass = prefersReducedMotion ? "" : "pa-fade-up";
  const hasVideo = Boolean(aboutData.storyVideo?.videoUrl);

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, #1E40AF 100%)`,
        color: colors.textWhite,
        py: { xs: 8, md: 11 },
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Text column */}
          <div className="col-lg-6">
            <Typography
              component="p"
              variant="overline"
              className={fadeClass}
              sx={{ letterSpacing: 2, fontWeight: 600, color: colors.secondaryOrange, mb: 2 }}
            >
              About Praksha Academy
            </Typography>

            <Typography
              component="h1"
              variant="h2"
              className={`${fadeClass} pa-delay-1`}
              sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, mb: 3, lineHeight: 1.2 }}
            >
              Learning should move you forward.
            </Typography>

            <Typography
              variant="body1"
              className={`${fadeClass} pa-delay-2`}
              sx={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", mb: 5, maxWidth: 520 }}
            >
              From Class 8 foundations to career-focused programming and data
              science, Praksha Academy pairs experienced teachers with a
              curriculum built to make hard concepts click.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} className={`${fadeClass} pa-delay-3`}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<FaArrowRight />}
                href="/courses"
                sx={{ px: 4, py: 1.5 }}
              >
                Explore Courses
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<FaHeadset />}
                href="/contact"
                sx={{
                  px: 4,
                  py: 1.5,
                  color: colors.textWhite,
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": { borderColor: colors.textWhite, backgroundColor: "rgba(255,255,255,0.08)" },
                }}
              >
                Talk to an Academic Advisor
              </Button>
              {hasVideo && (
                <Button
                  ref={videoButtonRef}
                  variant="text"
                  size="large"
                  startIcon={<FaPlayCircle />}
                  onClick={() => setVideoOpen(true)}
                  sx={{ px: 3, py: 1.5, color: colors.textWhite, "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" } }}
                >
                  Watch Our Story
                </Button>
              )}
            </Stack>
          </div>

          {/* Image column */}
          <div className="col-lg-6">
            <Box
              className={`${fadeClass} pa-delay-2`}
              sx={{ position: "relative", maxWidth: 480, mx: { xs: "auto", lg: 0 } }}
            >
              <ImagePlaceholder
                src={mediaData.aboutHero}
                alt="Students learning at Praksha Academy"
                label="Photo coming soon"
                aspectRatio="4 / 5"
                borderRadius="20px"
                sx={{ boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)" }}
              />

              {/* Small floating accent card — decorative, not a data claim */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: -16, md: -20 },
                  left: { xs: 16, md: -24 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  backgroundColor: colors.cardBackground,
                  color: colors.textPrimary,
                  borderRadius: "14px",
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.18)",
                  px: 2.5,
                  py: 1.75,
                  maxWidth: 240,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(37,99,235,0.1)",
                    color: colors.primaryBlue,
                  }}
                >
                  <FaBookOpen size={15} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                  Learn → Practice → Improve
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={aboutData.storyVideo.videoUrl}
        returnFocusRef={videoButtonRef}
      />
    </Box>
  );
};

export default AboutHero;
