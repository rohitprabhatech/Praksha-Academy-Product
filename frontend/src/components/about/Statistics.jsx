import { useEffect, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { colors } from "../../theme/theme";
import aboutData from "../../data/aboutData";

/**
 * Animated stat counters. Reads from aboutData.stats, which starts empty —
 * this component renders nothing until real, confirmed figures are added.
 * Counters only ever display real statistics, never placeholders.
 */
const useCountUp = (target, isVisible, decimals = 0, duration = 1400, disabled = false) => {
  const [value, setValue] = useState(disabled ? target : 0);

  useEffect(() => {
    if (!isVisible || disabled) return;
    let start = null;
    let frameId;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = progress * target;
      setValue(decimals ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, target, decimals, duration, disabled]);

  return value;
};

const StatItem = ({ value, suffix, label, decimals, isVisible, disabled }) => {
  const count = useCountUp(value, isVisible, decimals, 1400, disabled);
  return (
    <div className="col-6 col-md text-center mb-4 mb-md-0">
      <Typography variant="h3" sx={{ color: colors.textWhite, fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
        {decimals ? count.toFixed(decimals) : count}
        {suffix}
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
        {label}
      </Typography>
    </div>
  );
};

const Statistics = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const stats = aboutData.stats;

  useEffect(() => {
    if (stats.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [stats.length]);

  if (stats.length === 0) return null; // no confirmed figures yet — render nothing

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-label="Praksha Academy by the numbers"
      sx={{ background: `linear-gradient(135deg, ${colors.primaryBlue} 0%, #1E40AF 100%)`, py: { xs: 6, md: 8 } }}
    >
      <div className="container">
        <div className="row justify-content-center">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} isVisible={isVisible} disabled={prefersReducedMotion} />
          ))}
        </div>
      </div>
    </Box>
  );
};

export default Statistics;
