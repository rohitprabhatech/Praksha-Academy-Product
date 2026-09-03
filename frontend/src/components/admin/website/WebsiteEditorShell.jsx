import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Stack, Typography } from '@mui/material'
import { FiExternalLink, FiSave, FiUploadCloud } from 'react-icons/fi'

/**
 * Shared chrome for Owner website editors.
 */
function WebsiteEditorShell({
  title,
  description,
  saving = false,
  publishing = false,
  onSave,
  onPublish,
  children,
  dirtyHint,
}) {
  return (
    <Stack spacing={2.5}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'flex-start' }}
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: 'text.primary' }}>
            {title}
          </Typography>
          {description && (
            <Typography sx={{ color: 'text.secondary', mt: 0.5, maxWidth: 640 }}>
              {description}
            </Typography>
          )}
          {dirtyHint && (
            <Typography sx={{ color: 'warning.main', fontSize: '0.8rem', mt: 0.75 }}>
              {dirtyHint}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            component={RouterLink}
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<FiExternalLink size={16} />}
            sx={{ textTransform: 'none' }}
          >
            View site
          </Button>
          <Button
            variant="outlined"
            startIcon={<FiSave size={16} />}
            disabled={saving || publishing}
            onClick={onSave}
            sx={{ textTransform: 'none' }}
          >
            {saving ? 'Saving…' : 'Save draft'}
          </Button>
          <Button
            variant="contained"
            startIcon={<FiUploadCloud size={16} />}
            disabled={saving || publishing}
            onClick={onPublish}
            sx={{ textTransform: 'none' }}
          >
            {publishing ? 'Publishing…' : 'Publish'}
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 2, md: 2.5 },
        }}
      >
        {children}
      </Box>
    </Stack>
  )
}

export default WebsiteEditorShell
