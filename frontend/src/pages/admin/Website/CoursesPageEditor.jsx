import { Box, CircularProgress, Stack, TextField } from '@mui/material'
import WebsiteEditorShell from '../../../components/admin/website/WebsiteEditorShell'
import { useWebsiteDraftEditor } from '../../../hooks/useWebsiteDraftEditor'

function CoursesPageEditor() {
  const { draft, updateSection, loading, saving, publishing, save, publish } =
    useWebsiteDraftEditor()

  if (loading || !draft) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
        <CircularProgress />
      </Box>
    )
  }

  const page = draft.coursesPage

  return (
    <WebsiteEditorShell
      title="Courses page"
      description="Controls the Courses page header. Individual courses are managed under Academic → Courses when that module is enabled."
      saving={saving}
      publishing={publishing}
      onSave={save}
      onPublish={publish}
    >
      <Stack spacing={2.25} sx={{ maxWidth: 640 }}>
        <TextField
          label="Page title"
          value={page.title}
          onChange={(e) => updateSection('coursesPage', { title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Subtitle"
          value={page.subtitle}
          onChange={(e) => updateSection('coursesPage', { subtitle: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Empty state message"
          value={page.emptyMessage}
          onChange={(e) => updateSection('coursesPage', { emptyMessage: e.target.value })}
          fullWidth
        />
      </Stack>
    </WebsiteEditorShell>
  )
}

export default CoursesPageEditor
