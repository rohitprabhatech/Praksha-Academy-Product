import { Box } from "@mui/material";
import AboutHero from "../components/about/AboutHero";
import TrustStrip from "../components/about/TrustStrip";
import WhoWeAre from "../components/about/WhoWeAre";
import Differentiators from "../components/about/Differentiators";
import LearningPhilosophy from "../components/about/LearningPhilosophy";
import StudentJourney from "../components/about/StudentJourney";
import LearningEnvironment from "../components/about/LearningEnvironment";
import Mission from "../components/about/Mission";
import Vision from "../components/about/Vision";
import Values from "../components/about/Values";
import Faculty from "../components/about/Faculty";
import AcademyTimeline from "../components/about/AcademyTimeline";
import Recognition from "../components/about/Recognition";
import AboutFAQ from "../components/about/AboutFAQ";
import CTASection from "../components/about/CTASection";
import FloatingContact from "../components/common/FloatingContact";
import SectionHeading from "../components/common/SectionHeading";
import aboutData from "../data/aboutData";
import { useWebsite } from "../context/WebsiteContext";
import { colors } from "../theme/theme";
import "../styles/about-contact.css";

/**
 * About page. Sections that depend on unconfirmed data hide when empty.
 * Story/differentiators prefer tenant website CMS content.
 */
const About = () => {
  const { content, branding } = useWebsite();
  const hasTimeline = aboutData.timeline.length > 0;
  const hasRecognition = aboutData.recognition.length > 0;
  const academyName = branding?.academyName || "our academy";

  return (
    <Box sx={{ backgroundColor: colors.pageBackground, position: "relative" }}>
      <AboutHero />
      <TrustStrip />

      {/* Who We Are */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <div className="container">
          <WhoWeAre />
        </div>
      </Box>

      {/* What Makes Us Different */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.sectionBackground }}>
        <div className="container">
          <SectionHeading
            eyebrow="How We Work"
            title={content?.about?.title || `What Makes ${academyName} Different`}
          />
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <Differentiators />
            </div>
          </div>
        </div>
      </Box>

      {/* Learning Philosophy */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <div className="container">
          <SectionHeading
            eyebrow="Our Teaching Model"
            title="How Students Learn Here"
            subtitle="The same loop runs through every course, from Class 8 fundamentals to career tracks."
          />
          <LearningPhilosophy />
        </div>
      </Box>

      {/* Student Journey */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.sectionBackground }}>
        <div className="container">
          <SectionHeading eyebrow="From Sign-Up to Progress" title="The Student Journey" />
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <StudentJourney />
            </div>
          </div>
        </div>
      </Box>

      {/* Learning Environment — what taking a course here actually looks like */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <div className="container">
          <SectionHeading
            eyebrow="Inside a Course"
            title="What Learning Feels Like Here"
            subtitle="Four concrete parts of every course — not just a features list."
          />
          <LearningEnvironment />
        </div>
      </Box>

      {/* Mission & Vision */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <div className="container">
          <SectionHeading eyebrow="What Drives Us" title="Mission & Vision" />
          <div className="row g-4">
            <div className="col-md-6">
              <Mission />
            </div>
            <div className="col-md-6">
              <Vision />
            </div>
          </div>
        </div>
      </Box>

      {/* Core Values */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.sectionBackground }}>
        <div className="container">
          <SectionHeading
            eyebrow="Our Principles"
            title="Core Values"
            subtitle="What guides how courses are built and how classes are taught."
          />
          <Values />
        </div>
      </Box>

      {/* Faculty */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <div className="container">
          <SectionHeading eyebrow="Meet the Team" title="Faculty" />
          <Faculty />
        </div>
      </Box>

      {/* Academy Timeline — only rendered if real milestones exist */}
      {hasTimeline && (
        <Box component="section" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.sectionBackground }}>
          <div className="container">
            <SectionHeading eyebrow="Our Journey" title="Academy Timeline" />
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <AcademyTimeline />
              </div>
            </div>
          </div>
        </Box>
      )}

      {/* Recognition — only rendered if real, verified entries exist */}
      {hasRecognition && (
        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <div className="container">
            <SectionHeading eyebrow="Recognition" title="Awards & Certifications" />
            <Recognition />
          </div>
        </Box>
      )}

      {/* FAQ */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 }, backgroundColor: colors.sectionBackground }}>
        <div className="container">
          <SectionHeading eyebrow="Questions" title="Frequently Asked Questions" />
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <AboutFAQ />
            </div>
          </div>
        </div>
      </Box>

      {/* Final CTA */}
      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <div className="container">
          <CTASection />
        </div>
      </Box>

      <FloatingContact />
    </Box>
  );
};

export default About;
