import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ForwardIcon from '@mui/icons-material/Forward';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ResultFooter({
  handleDownload,
  handleCopy,
  handleForward,
  disabled,
  hideCopy,
  downloadLabel,
  hideForward
}: {
  handleDownload: () => void;
  handleCopy?: () => void;
  handleForward?: () => void;
  disabled?: boolean;
  hideCopy?: boolean;
  hideForward?: boolean;
  downloadLabel?: string;
}) {
  const { t } = useTranslation();
  return (
    <Stack mt={1} direction={'row'} spacing={2}>
      <Button
        disabled={disabled}
        onClick={handleDownload}
        startIcon={<DownloadIcon />}
      >
        {downloadLabel || t('resultFooter.download')}
      </Button>
      {!hideCopy && (
        <Button
          disabled={disabled}
          onClick={handleCopy}
          startIcon={<ContentPasteIcon />}
        >
          {t('resultFooter.copy')}
        </Button>
      )}
      {!hideForward && (
        <Button
          disabled={disabled}
          onClick={handleForward}
          startIcon={<ForwardIcon />}
        >
          {t('resultFooter.forward')}
        </Button>
      )}
    </Stack>
  );
}
