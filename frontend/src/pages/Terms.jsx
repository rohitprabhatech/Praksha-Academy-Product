import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import legalData from '../data/legalData';

const Terms = () => {
  const { lastUpdated, sections } = legalData.terms;

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#F8FAFC', minHeight: '60vh' }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1E293B', mb: 1 }}>
          Terms of Service
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
          Last updated: {lastUpdated}
        </Typography>
        
        <Box sx={{ backgroundColor: '#FFFFFF', p: { xs: 3, md: 5 }, borderRadius: 2, border: '1px solid #E2E8F0' }}>
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: index !== sections.length - 1 ? 4 : 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E293B', mb: 1 }}>
                {section.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                {section.content}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Terms;