import {
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function AboutEditor() {
  const { draft, updateSection, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const about = draft.about

  const updateDiff = (index, patch) => {
    const differentiators = about.differentiators.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    )
    updateSection('about', { differentiators })
  }

  return (
    <WebsiteEditorShell
      title="About page"
      description="Tell each academy’s own story. Avoid invented awards or faculty — only publish facts you can stand behind."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={2.25} sx={{ maxWidth: 720 }}>
        <TextField
          label="Page title"
          value={about.title}
          onChange={(e) => updateSection('about', { title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Subtitle"
          value={about.subtitle}
          onChange={(e) => updateSection('about', { subtitle: e.target.value })}
          fullWidth
        />

        <Typography sx={{ fontWeight: 700, pt: 1 }}>Who we are</Typography>
        <TextField
          label="Story"
          value={about.whoWeAre.story}
          onChange={(e) =>
            updateSection('about', {
              whoWeAre: { ...about.whoWeAre, story: e.target.value },
            })
          }
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          label="Belief"
          value={about.whoWeAre.belief}
          onChange={(e) =>
            updateSection('about', {
              whoWeAre: { ...about.whoWeAre, belief: e.target.value },
            })
          }
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Approach"
          value={about.whoWeAre.approach}
          onChange={(e) =>
            updateSection('about', {
              whoWeAre: { ...about.whoWeAre, approach: e.target.value },
            })
          }
          fullWidth
          multiline
          minRows={2}
        />

        <Typography sx={{ fontWeight: 700, pt: 1 }}>Differentiators</Typography>
        {about.differentiators.map((item, index) => (
          <Stack
            key={item.id || index}
            spacing={1.25}
            sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}
          >
            <TextField
              label="Title"
              value={item.title}
              onChange={(e) => updateDiff(index, { title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={item.description}
              onChange={(e) => updateDiff(index, { description: e.target.value })}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        ))}
      </Stack>
    </WebsiteEditorShell>
  )
}

export default AboutEditor
