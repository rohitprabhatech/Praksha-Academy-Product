import { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

const FAQPreview = () => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (_e, isExpanded) => setExpanded(isExpanded ? panel : false);

  return (
    <Box sx={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.borderColor}`, borderRadius: "12px", p: { xs: 3, md: 4 } }}>
      <Typography variant="h5" component="h2" sx={{ color: colors.textPrimary, mb: 0.5 }}>
        Frequently Asked Questions
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
        Quick answers before you reach out.
      </Typography>

      {contactData.faqs.map((item, index) => (
        <Accordion
          key={item.q}
          expanded={expanded === `contact-panel${index}`}
          onChange={handleChange(`contact-panel${index}`)}
          disableGutters
          elevation={0}
          sx={{
            border: `1px solid ${colors.borderColor}`,
            borderRadius: "10px !important",
            mb: 1.5,
            "&:before": { display: "none" },
            overflow: "hidden",
          }}
        >
          <AccordionSummary
            expandIcon={<FaChevronDown size={14} color={colors.textSecondary} aria-hidden="true" />}
            aria-controls={`contact-panel${index}-content`}
            id={`contact-panel${index}-header`}
            sx={{ backgroundColor: colors.sectionBackground }}
          >
            <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
              {item.q}
            </Typography>
          </AccordionSummary>
          <AccordionDetails id={`contact-panel${index}-content`}>
            <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
              {item.a}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQPreview;
