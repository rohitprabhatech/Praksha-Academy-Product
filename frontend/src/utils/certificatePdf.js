import jsPDF from 'jspdf';

/**
 * Builds a landscape A4 certificate PDF using brand tokens.
 * Drawn with jsPDF primitives (no image loading) so generation is
 * synchronous and has no external asset dependency.
 */
const buildCertificateDoc = ({ studentName, courseTitle, mentor, issuedDate, certificateId }) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;

  // Outer brand-blue border, inner hairline border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(3);
  doc.rect(24, 24, pageWidth - 48, pageHeight - 48);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.rect(36, 36, pageWidth - 72, pageHeight - 72);

  // Logo badge (drawn, not an image — keeps this dependency-free)
  const badgeY = 92;
  doc.setFillColor(37, 99, 235);
  doc.circle(centerX, badgeY, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('P', centerX, badgeY + 7, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('PRAKSHA ACADEMY', centerX, badgeY + 42, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('LEARN  \u2022  GROW  \u2022  SUCCEED', centerX, badgeY + 57, { align: 'center' });

  // Title
  doc.setTextColor(217, 119, 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CERTIFICATE OF COMPLETION', centerX, badgeY + 98, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('This is to certify that', centerX, badgeY + 133, { align: 'center' });

  // Student name — the visual centerpiece
  doc.setTextColor(15, 23, 42);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(30);
  doc.text(studentName, centerX, badgeY + 172, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('has successfully completed the course', centerX, badgeY + 199, { align: 'center' });

  // Course title
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(courseTitle, centerX, badgeY + 230, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`under the mentorship of ${mentor}`, centerX, badgeY + 253, { align: 'center' });

  // Footer — Issued (left) / Certificate ID (right), matching the app's card layout
  const footerY = pageHeight - 70;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(70, footerY - 12, 210, footerY - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('ISSUED', 70, footerY + 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(issuedDate, 70, footerY + 20);

  const rightEdge = pageWidth - 70;
  doc.setDrawColor(226, 232, 240);
  doc.line(rightEdge - 140, footerY - 12, rightEdge, footerY - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('CERTIFICATE ID', rightEdge, footerY + 4, { align: 'right' });
  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(certificateId, rightEdge, footerY + 20, { align: 'right' });

  return doc;
};

/** Triggers a real browser download of the generated certificate PDF. */
export const downloadCertificatePdf = (data) => {
  const doc = buildCertificateDoc(data);
  doc.save(`${data.certificateId}.pdf`);
};

/** Opens the generated certificate PDF in a new browser tab. */
export const viewCertificatePdf = (data) => {
  const doc = buildCertificateDoc(data);
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl, '_blank', 'noopener,noreferrer');
};