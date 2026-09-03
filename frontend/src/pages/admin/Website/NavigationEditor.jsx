import {
  Box,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function NavigationEditor() {
  const { draft, setDraft, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const updateNav = (index, patch) => {
    const navigation = draft.navigation.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    )
    setDraft({ ...draft, navigation })
  }

  return (
    <WebsiteEditorShell
      title="Navigation"
      description="Control public menu labels and visibility. Hidden pages stay reachable by URL unless you remove those routes later."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={1.5}>
        {draft.navigation.map((item, index) => (
          <Stack
            key={item.id || item.path}
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ sm: 'center' }}
            sx={{
              p: 1.5,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              label="Label"
              value={item.label}
              onChange={(e) => updateNav(index, { label: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Path"
              value={item.path}
              onChange={(e) => updateNav(index, { path: e.target.value })}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={item.visible !== false}
                  onChange={(e) => updateNav(index, { visible: e.target.checked })}
                />
              }
              label="Visible"
            />
          </Stack>
        ))}
      </Stack>
    </WebsiteEditorShell>
  )
}

export default NavigationEditor
