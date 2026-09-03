import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function BrandingEditor() {
  const { draft, updateSection, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const b = draft.branding

  return (
    <WebsiteEditorShell
      title="Branding"
      description="These details appear in the navbar, footer, browser title area, and hero treatment for this academy only."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={2.25} sx={{ maxWidth: 640 }}>
        <TextField
          label="Academy name"
          value={b.academyName}
          onChange={(e) => updateSection('branding', { academyName: e.target.value })}
          fullWidth
        />
        <TextField
          label="Short name"
          helperText="Used in compact UI (sidebar, small headers)."
          value={b.shortName}
          onChange={(e) => updateSection('branding', { shortName: e.target.value })}
          fullWidth
        />
        <TextField
          label="Tagline"
          value={b.tagline}
          onChange={(e) => updateSection('branding', { tagline: e.target.value })}
          fullWidth
        />
        <TextField
          label="Logo URL"
          helperText="Paste an image URL for now. File upload can connect to storage later."
          value={b.logoUrl}
          onChange={(e) => updateSection('branding', { logoUrl: e.target.value })}
          fullWidth
        />
        <TextField
          label="Hero image URL"
          value={b.heroImageUrl}
          onChange={(e) => updateSection('branding', { heroImageUrl: e.target.value })}
          fullWidth
        />
        <TextField
          label="Primary colour"
          type="color"
          value={b.primaryColor || '#2563EB'}
          onChange={(e) => updateSection('branding', { primaryColor: e.target.value })}
          sx={{ maxWidth: 160 }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={b.logoUrl}
            alt="Logo preview"
            sx={{ width: 48, height: 48, objectFit: 'contain' }}
          />
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{b.academyName}</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              {b.tagline}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </WebsiteEditorShell>
  )
}

export default BrandingEditor
