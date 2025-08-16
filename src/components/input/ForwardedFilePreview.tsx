import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Paper,
  useTheme,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ForwardedData } from '../../hooks/useForwardedData';
import { useTranslation } from 'react-i18next';

interface ForwardedFilePreviewProps {
  forwardedData: ForwardedData;
  onRemove: () => void;
  onDelete: () => void; // New prop for actual deletion
}

export default function ForwardedFilePreview({
  forwardedData,
  onRemove,
  onDelete
}: ForwardedFilePreviewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (forwardedData.file) {
      const objectUrl = URL.createObjectURL(forwardedData.file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [forwardedData.file]);

  const getFileType = (): 'image' | 'video' | 'audio' | 'pdf' | 'unknown' => {
    if (!forwardedData.file) return 'unknown';
    if (forwardedData.file.type.startsWith('image/')) return 'image';
    if (forwardedData.file.type.startsWith('video/')) return 'video';
    if (forwardedData.file.type.startsWith('audio/')) return 'audio';
    if (forwardedData.file.type.startsWith('application/pdf')) return 'pdf';
    return 'unknown';
  };

  const fileType = getFileType();

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        width: 300,
        maxHeight: 400,
        zIndex: 1000,
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText'
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          {t('forwardedFilePreview.forwardedFile')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{ color: 'primary.contrastText' }}
            title="Delete from storage"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{ color: 'primary.contrastText' }}
            title="Hide preview"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          p: 1,
          maxHeight: 350,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {fileType === 'image' && preview && (
          <img
            src={preview}
            alt="Forwarded file"
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              objectFit: 'contain'
            }}
          />
        )}

        {fileType === 'video' && preview && (
          <video
            src={preview}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: 200
            }}
          />
        )}

        {fileType === 'audio' && preview && (
          <audio src={preview} controls style={{ width: '100%' }} />
        )}

        {fileType === 'pdf' && preview && (
          <iframe
            src={preview}
            width="100%"
            height="200"
            style={{ border: 'none' }}
          />
        )}

        {fileType === 'unknown' && (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {forwardedData.file?.name || 'Unknown file'}
            </Typography>
          </Box>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, textAlign: 'center' }}
        >
          {forwardedData.file?.name}
        </Typography>
      </Box>
    </Paper>
  );
}
