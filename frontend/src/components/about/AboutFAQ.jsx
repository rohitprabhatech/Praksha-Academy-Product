import { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * About-page FAQ accordion. Keyboard accessible via MUI Accordion
 * (native button semantics + aria-expanded handled by MUI).
 */
const AboutFAQ = () => {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (_e, isExpanded) => setExpanded(isExpanded ? panel : false);

  return (
    <div>
      {aboutData.faqs.map((item, index) => (
        <Accordion
          key={item.q}
          expanded={expanded === `about-panel${index}`}
          onChange={handleChange(`about-panel${index}`)}
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
            aria-controls={`about-panel${index}-content`}
            id={`about-panel${index}-header`}
            sx={{ backgroundColor: colors.sectionBackground }}
          >
            <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
              {item.q}
            </Typography>
          </AccordionSummary>
          <AccordionDetails id={`about-panel${index}-content`}>
            <Typography variant="body2" sx={{ color: colors.textSecondary, lineHeight: 1.7 }}>
              {item.a}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AboutFAQ;
