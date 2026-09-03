import { useRef, useEffect } from "react";
import { Dialog, DialogContent, IconButton, Box, useMediaQuery } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { colors } from "../../theme/theme";

/**
 * Accessible video lightbox.
 *
 * - Closes on ESC (native Dialog behavior) and on click outside.
 * - Returns focus to the trigger element on close.
 * - No autoplay-with-sound: the iframe does not receive an autoplay param.
 * - Respects prefers-reduced-motion by disabling the MUI transition.
 * - Renders nothing if videoUrl is falsy — never embeds a fake/placeholder video.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   const triggerRef = useRef(null);
 *   <Button ref={triggerRef} onClick={() => setOpen(true)}>Watch Our Story</Button>
 *   <VideoModal open={open} onClose={() => setOpen(false)} videoUrl={aboutData.storyVideo.videoUrl} returnFocusRef={triggerRef} />
 */
const VideoModal = ({ open, onClose, videoUrl, returnFocusRef }) => {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open && returnFocusRef?.current) {
      returnFocusRef.current.focus();
    }
    wasOpen.current = open;
  }, [open, returnFocusRef]);

  if (!videoUrl) return null; // no real video configured — render nothing

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      transitionDuration={prefersReducedMotion ? 0 : undefined}
      aria-labelledby="story-video-title"
      PaperProps={{
        sx: { borderRadius: "14px", backgroundColor: "#000", overflow: "hidden" },
      }}
    >
      <span id="story-video-title" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
        Praksha Academy — Our Story
      </span>
      <IconButton
        onClick={onClose}
        aria-label="Close video"
        autoFocus
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: colors.textWhite,
          backgroundColor: "rgba(0,0,0,0.5)",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          "&:focus-visible": { outline: `3px solid ${colors.primaryBlue}` },
        }}
      >
        <FaTimes size={16} />
      </IconButton>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: "relative", pt: "56.25%" /* 16:9 */ }}>
          {open && (
            <Box
              component="iframe"
              src={videoUrl}
              title="Praksha Academy — Our Story"
              allow="fullscreen; encrypted-media"
              allowFullScreen
              sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
