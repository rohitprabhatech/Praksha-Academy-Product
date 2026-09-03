import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function HomeEditor() {
  const { draft, updateSection, setDraft, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const home = draft.home

  const setHighlight = (index, value) => {
    const highlights = [...home.highlights]
    highlights[index] = value
    updateSection('home', { highlights })
  }

  return (
    <WebsiteEditorShell
      title="Home page"
      description="Edit the first-screen message visitors see. Course cards still come from your course catalogue."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={2.25} sx={{ maxWidth: 720 }}>
        <Typography sx={{ fontWeight: 700 }}>Hero</Typography>
        <TextField
          label="Eyebrow"
          value={home.heroEyebrow}
          onChange={(e) => updateSection('home', { heroEyebrow: e.target.value })}
          fullWidth
        />
        <TextField
          label="Headline"
          value={home.heroTitle}
          onChange={(e) => updateSection('home', { heroTitle: e.target.value })}
          fullWidth
          multiline
        />
        <TextField
          label="Supporting text"
          value={home.heroSubtitle}
          onChange={(e) => updateSection('home', { heroSubtitle: e.target.value })}
          fullWidth
          multiline
          minRows={3}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            label="Primary button label"
            value={home.heroCtaLabel}
            onChange={(e) => updateSection('home', { heroCtaLabel: e.target.value })}
            fullWidth
          />
          <TextField
            label="Primary button path"
            value={home.heroCtaPath}
            onChange={(e) => updateSection('home', { heroCtaPath: e.target.value })}
            fullWidth
          />
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            label="Secondary button label"
            value={home.secondaryCtaLabel}
            onChange={(e) => updateSection('home', { secondaryCtaLabel: e.target.value })}
            fullWidth
          />
          <TextField
            label="Secondary button path"
            value={home.secondaryCtaPath}
            onChange={(e) => updateSection('home', { secondaryCtaPath: e.target.value })}
            fullWidth
          />
        </Stack>

        <Typography sx={{ fontWeight: 700, pt: 1 }}>Highlights</Typography>
        {home.highlights.map((item, index) => (
          <TextField
            key={`hl-${index}`}
            label={`Highlight ${index + 1}`}
            value={item}
            onChange={(e) => setHighlight(index, e.target.value)}
            fullWidth
          />
        ))}

        <Typography sx={{ fontWeight: 700, pt: 1 }}>Section titles</Typography>
        {Object.entries(home.sectionTitles || {}).map(([key, value]) => (
          <TextField
            key={key}
            label={key}
            value={value}
            onChange={(e) =>
              updateSection('home', {
                sectionTitles: { ...home.sectionTitles, [key]: e.target.value },
              })
            }
            fullWidth
          />
        ))}
      </Stack>
    </WebsiteEditorShell>
  )
}

export default HomeEditor
