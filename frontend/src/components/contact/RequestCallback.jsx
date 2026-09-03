import { useState } from "react";
import { Box, Typography, TextField, Button, Alert, Stack } from "@mui/material";
import { FaPhoneVolume } from "react-icons/fa";
import { colors } from "../../theme/theme";

/**
 * Short 2-field lead-capture widget for people who'd rather leave a
 * number than fill the full contact form.
 *
 * TODO: replace with a real API call once a backend endpoint exists, e.g.:
 *   await fetch("/api/callback-request", { method: "POST", body: JSON.stringify({ name, phone }) });
 */
const RequestCallback = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    // TODO: wire up to backend/CRM lead endpoint
    console.log("Callback requested:", { name, phone });
    setError("");
    setSubmitted(true);
    setName("");
    setPhone("");
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colors.secondaryOrange} 0%, ${colors.secondaryOrangeHover} 100%)`,
        borderRadius: "14px",
        p: { xs: 3, md: 3.5 },
        color: colors.textWhite,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
        <FaPhoneVolume size={18} />
        <Typography variant="h6" sx={{ color: colors.textWhite }}>
          Request a Callback
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mb: 2.5 }}>
        Leave your number and we'll call you back — no need to fill the full form.
      </Typography>

      {submitted ? (
        <Alert severity="success" sx={{ backgroundColor: "rgba(255,255,255,0.95)" }}>
          Got it — we'll be in touch.
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={1.5}>
            <TextField
              size="small"
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                backgroundColor: colors.cardBackground,
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
            <TextField
              size="small"
              label="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{
                backgroundColor: colors.cardBackground,
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
            />
            {error && (
              <Typography variant="caption" role="alert" sx={{ color: colors.textWhite, fontWeight: 600 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: colors.textPrimary,
                "&:hover": { backgroundColor: "#0F172A" },
              }}
            >
              Request Callback
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default RequestCallback;
