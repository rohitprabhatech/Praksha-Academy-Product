import { Box, Typography } from "@mui/material";
import QuickActions from "../components/contact/QuickActions";
import ContactForm from "../components/contact/ContactForm";
import RequestCallback from "../components/contact/RequestCallback";
import AcademicAdvisor from "../components/contact/AcademicAdvisor";
import ContactInfo from "../components/contact/ContactInfo";
import WorkingHours from "../components/contact/WorkingHours";
import OnlineSupport from "../components/contact/OnlineSupport";
import MapPreview from "../components/contact/MapPreview";
import FAQPreview from "../components/contact/FAQPreview";
import SupportFlow from "../components/contact/SupportFlow";
import ContactCTA from "../components/contact/ContactCTA";
import FloatingContact from "../components/common/FloatingContact";
import SectionHeading from "../components/common/SectionHeading";
import contactData from "../data/contactData";
import { colors } from "../theme/theme";
import "../styles/about-contact.css";

/**
 * Contact page. Branch/Map sections render only when
 * contactData.hasPhysicalAddress is true; otherwise OnlineSupport shows a
 * location-independent message. Nothing here fabricates an address, phone
 * number, or working hours — see src/data/contactData.js to fill in real
 * values as they're confirmed.
 */
const Contact = () => {
  return (
    // TODO(SEO): set document title/meta description for this route,
    // matching whatever pattern Home/Courses already use.
    <Box sx={{ backgroundColor: colors.pageBackground, position: "relative" }}>
      {/* Hero */}
      <Box
        sx={{ background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, #1E40AF 100%)`, color: colors.textWhite, py: { xs: 6, md: 8 }, textAlign: "center" }}
      >
        <div className="container">
          <Typography variant="overline" sx={{ color: colors.secondaryOrange, fontWeight: 600, letterSpacing: 1.5 }}>
            Get In Touch
          </Typography>
          <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: "1.9rem", md: "2.5rem" } }}>
            Let's talk about your learning journey.
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)", mt: 1.5, maxWidth: 560, mx: "auto" }}>
            Questions about a course, admissions, or anything else — reach us
            using whichever option works best for you.
          </Typography>
        </div>
      </Box>

      {/* Quick Actions */}
      <Box component="section" sx={{ py: { xs: 5, md: 6 } }}>
        <div className="container">
          <QuickActions />
        </div>
      </Box>

      {/* Support Flow — what happens after you reach out */}
      <Box component="section" sx={{ pb: { xs: 5, md: 6 } }}>
        <div className="container">
          <SupportFlow />
        </div>
      </Box>

      {/* Form + Info + Callback */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 }, backgroundColor: colors.sectionBackground }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <ContactForm />
            </div>
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4">
                <RequestCallback />
                <ContactInfo />
                <WorkingHours />
              </div>
            </div>
          </div>
        </div>
      </Box>

      {/* Academic Advisor */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <div className="container">
          <AcademicAdvisor />
        </div>
      </Box>

      {/* Location — real branch/map if confirmed, otherwise online-support message */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 }, backgroundColor: colors.sectionBackground }}>
        <div className="container">
          <SectionHeading eyebrow="Find Us" title={contactData.hasPhysicalAddress ? "Visit Us" : "Where We Teach"} />
          {contactData.hasPhysicalAddress ? <MapPreview /> : <OnlineSupport />}
        </div>
      </Box>

      {/* FAQ */}
      <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <FAQPreview />
            </div>
          </div>
        </div>
      </Box>

      {/* Final CTA */}
      <Box component="section" sx={{ pb: { xs: 7, md: 10 } }}>
        <div className="container">
          <ContactCTA />
        </div>
      </Box>

      <FloatingContact />
    </Box>
  );
};

export default Contact;
