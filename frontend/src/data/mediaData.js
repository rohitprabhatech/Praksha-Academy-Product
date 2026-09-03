/**
 * Central image/media configuration for the About and Contact pages.
 *
 * Every field defaults to null. Components that consume this file are
 * written to render a clean, intentional placeholder (see
 * components/common/ImagePlaceholder.jsx) when a value is null — never a
 * broken <img>, never a stock photo presented as a real Praksha Academy
 * photo.
 *
 * HOW TO ADD A REAL IMAGE:
 * 1. Drop the file into /public/images/... (or wherever the project's
 *    existing asset convention lives — check src/assets or public/ first).
 * 2. Set the matching field below to that path, e.g. "/images/hero.jpg".
 * 3. No component code needs to change.
 */

const mediaData = {
  // Hero — large editorial image on the About page.
  aboutHero: null, // e.g. "/images/about/hero-classroom.jpg"

  // "Who We Are" section image.
  whoWeAre: null, // e.g. "/images/about/who-we-are.jpg"

  // "Learning Environment" cards — one image per card, in this order:
  // Live Classes, Practice, Mentorship, Progress Tracking.
  learningEnvironment: {
    liveClasses: null,
    practice: null,
    mentorship: null,
    progressTracking: null,
  },

  // Faculty photos are stored alongside each person in aboutData.faculty
  // (the `photo` field on each entry) — not duplicated here.

  // Contact page hero visual.
  contactHero: null, // e.g. "/images/contact/hero.jpg"

  // "Watch Our Story" video — a real, embeddable URL only.
  // e.g. "https://www.youtube.com/embed/REAL_VIDEO_ID"
  // Also mirrored in aboutData.storyVideo.videoUrl — keep both in sync,
  // or better, have one become the single source of truth once this file
  // is adopted project-wide.
  storyVideo: null,
};

export default mediaData;
