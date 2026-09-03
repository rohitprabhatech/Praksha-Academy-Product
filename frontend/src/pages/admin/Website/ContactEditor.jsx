import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function ContactEditor() {
  const { draft, updateSection, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const contact = draft.contact
  const footer = draft.footer

  const updateHours = (index, patch) => {
    const workingHours = contact.workingHours.map((row, i) =>
      i === index ? { ...row, ...patch } : row
    )
    updateSection('contact', { workingHours })
  }

  return (
    <WebsiteEditorShell
      title="Contact & footer"
      description="Address, phone, and social links are tenant-specific. Leave a field blank to hide it on the public site."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={2.25} sx={{ maxWidth: 720 }}>
        <TextField
          label="Page title"
          value={contact.title}
          onChange={(e) => updateSection('contact', { title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Subtitle"
          value={contact.subtitle}
          onChange={(e) => updateSection('contact', { subtitle: e.target.value })}
          fullWidth
        />
        <TextField
          label="Support email"
          value={contact.email || ''}
          onChange={(e) => updateSection('contact', { email: e.target.value })}
          fullWidth
        />
        <TextField
          label="Phone"
          value={contact.phone || ''}
          onChange={(e) => updateSection('contact', { phone: e.target.value })}
          fullWidth
        />
        <TextField
          label="WhatsApp (digits with country code)"
          value={contact.whatsapp || ''}
          onChange={(e) => updateSection('contact', { whatsapp: e.target.value })}
          fullWidth
        />
        <TextField
          label="Address"
          value={contact.address || ''}
          onChange={(e) => updateSection('contact', { address: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            label="City"
            value={contact.city || ''}
            onChange={(e) => updateSection('contact', { city: e.target.value })}
            fullWidth
          />
          <TextField
            label="State"
            value={contact.state || ''}
            onChange={(e) => updateSection('contact', { state: e.target.value })}
            fullWidth
          />
          <TextField
            label="Postal code"
            value={contact.postalCode || ''}
            onChange={(e) => updateSection('contact', { postalCode: e.target.value })}
            fullWidth
          />
        </Stack>
        <TextField
          label="Map URL"
          value={contact.mapUrl || ''}
          onChange={(e) => updateSection('contact', { mapUrl: e.target.value })}
          fullWidth
        />

        <Typography sx={{ fontWeight: 700, pt: 1 }}>Working hours</Typography>
        {contact.workingHours.map((row, index) => (
          <Stack key={row.id || index} direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <TextField
              label="Day"
              value={row.day}
              onChange={(e) => updateHours(index, { day: e.target.value })}
              fullWidth
            />
            <TextField
              label="Time"
              value={row.time}
              onChange={(e) => updateHours(index, { time: e.target.value })}
              fullWidth
            />
          </Stack>
        ))}

        <Typography sx={{ fontWeight: 700, pt: 1 }}>Footer</Typography>
        <TextField
          label="Footer blurb"
          value={footer.blurb}
          onChange={(e) => updateSection('footer', { blurb: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        {Object.keys(footer.socialLinks || {}).map((key) => (
          <TextField
            key={key}
            label={`${key} URL`}
            value={footer.socialLinks[key] || ''}
            onChange={(e) =>
              updateSection('footer', {
                socialLinks: { ...footer.socialLinks, [key]: e.target.value },
              })
            }
            fullWidth
          />
        ))}
      </Stack>
    </WebsiteEditorShell>
  )
}

export default ContactEditor
