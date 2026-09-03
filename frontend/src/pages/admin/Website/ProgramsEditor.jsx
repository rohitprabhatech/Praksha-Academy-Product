import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function ProgramsEditor() {
  const { draft, updateSection, setDraft, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const programs = draft.programs

  const updateItem = (index, patch) => {
    const items = programs.items.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    )
    updateSection('programs', { items })
  }

  const addItem = () => {
    updateSection('programs', {
      items: [
        ...programs.items,
        {
          id: `prog-${Date.now()}`,
          title: 'New program',
          description: 'Describe this program for visitors.',
        },
      ],
    })
  }

  const removeItem = (index) => {
    updateSection('programs', {
      items: programs.items.filter((_, i) => i !== index),
    })
  }

  return (
    <WebsiteEditorShell
      title="Programs"
      description="Programs are tenant-specific marketing tracks. Keep titles short and descriptions concrete."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={2.25}>
        <TextField
          label="Page title"
          value={programs.title}
          onChange={(e) => updateSection('programs', { title: e.target.value })}
          fullWidth
          sx={{ maxWidth: 480 }}
        />
        <TextField
          label="Subtitle"
          value={programs.subtitle}
          onChange={(e) => updateSection('programs', { subtitle: e.target.value })}
          fullWidth
          sx={{ maxWidth: 640 }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontWeight: 700 }}>Program cards</Typography>
          <Button startIcon={<FiPlus />} onClick={addItem} sx={{ textTransform: 'none' }}>
            Add program
          </Button>
        </Stack>

        {programs.items.map((item, index) => (
          <Stack
            key={item.id}
            spacing={1.25}
            sx={{
              p: 1.75,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 600 }}>Program {index + 1}</Typography>
              <IconButton
                aria-label="Remove program"
                onClick={() => removeItem(index)}
                disabled={programs.items.length <= 1}
              >
                <FiTrash2 size={16} />
              </IconButton>
            </Stack>
            <TextField
              label="Title"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              value={item.description}
              onChange={(e) => updateItem(index, { description: e.target.value })}
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

export default ProgramsEditor
