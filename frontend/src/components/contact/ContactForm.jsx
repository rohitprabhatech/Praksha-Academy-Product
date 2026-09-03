import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, MenuItem, CircularProgress } from "@mui/material";
import { FaPaperPlane, FaBook } from "react-icons/fa";
import { colors } from "../../theme/theme";
import contactData from "../../data/contactData";

const initialForm = { name: "", email: "", phone: "", program: "", message: "" };

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name";
  else if (values.name.trim().length < 2) errors.name = "Name looks too short";

  if (!values.email.trim()) errors.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address";

  if (values.phone && !/^[0-9]{10}$/.test(values.phone)) errors.phone = "Enter a valid 10-digit number";

  if (!values.message.trim()) errors.message = "Please add a short message";
  else if (values.message.trim().length < 10) errors.message = "A few more details would help (10+ characters)";

  return errors;
};

/**
 * TODO: replace this with a real API call once a backend endpoint exists,
 * e.g.:
 *   const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(values) });
 *   if (!res.ok) throw new Error("Failed to submit");
 */
const submitContactForm = async (values) => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  console.log("Contact form submitted (no backend wired up yet):", values);
  return { ok: true };
};

const ContactForm = () => {
  const [values, setValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [submittedName, setSubmittedName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      await submitContactForm(values);
      setSubmittedName(values.name.trim());
      setStatus("success");
      setValues(initialForm);
      setTouched({});
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Box
        id="contact-form"
        sx={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.borderColor}`, borderRadius: "12px", p: { xs: 3, md: 4 } }}
      >
        <Alert severity="success" sx={{ mb: 3 }}>
          Thanks, {submittedName || "there"}. We've received your message.
        </Alert>
        <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
          A team member will review it and get back to you. In the meantime,
          you're welcome to keep browsing.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FaBook />}
          href="/courses"
          sx={{ color: colors.primaryBlue, borderColor: colors.primaryBlue }}
        >
          Browse Courses
        </Button>
        <Button variant="text" onClick={() => setStatus("idle")} sx={{ ml: 2, color: colors.textSecondary }}>
          Send another message
        </Button>
      </Box>
    );
  }

  return (
    <Box
      id="contact-form"
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.borderColor}`, borderRadius: "12px", p: { xs: 3, md: 4 } }}
    >
      <Typography variant="h5" component="h2" sx={{ color: colors.textPrimary, mb: 1 }}>
        Send Us a Message
      </Typography>
      <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
        Tell us what you need — a team member will follow up.
      </Typography>

      {status === "error" && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Something went wrong sending your message. Please try again.
        </Alert>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <TextField
            fullWidth
            required
            label="Full Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && Boolean(errors.name)}
            helperText={touched.name && errors.name}
            disabled={status === "submitting"}
          />
        </div>
        <div className="col-md-6">
          <TextField
            fullWidth
            required
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            disabled={status === "submitting"}
          />
        </div>
        <div className="col-md-6">
          <TextField
            fullWidth
            label="Phone Number (optional)"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
            disabled={status === "submitting"}
          />
        </div>
        <div className="col-md-6">
          <TextField
            select
            fullWidth
            label="Interested Program (optional)"
            name="program"
            value={values.program}
            onChange={handleChange}
            disabled={status === "submitting"}
          >
            {contactData.programInterests.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="col-12">
          <TextField
            fullWidth
            required
            multiline
            rows={5}
            label="Message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.message && Boolean(errors.message)}
            helperText={touched.message && errors.message}
            disabled={status === "submitting"}
          />
        </div>
        <div className="col-12">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={status === "submitting"}
            startIcon={status === "submitting" ? <CircularProgress size={16} color="inherit" /> : <FaPaperPlane />}
            sx={{ px: 4, py: 1.5 }}
          >
            {status === "submitting" ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default ContactForm;
