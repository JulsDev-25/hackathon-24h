import React, { useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AlertMessage = ({ type = 'success', message, visible = true, duration = 10000, onClose }) => {
  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, visible, onClose]);

  if (!visible || !message) return null;

  const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
  const textColor = type === 'success' ? '#155724' : '#721c24';
  const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: bgColor,
        color: textColor,
        border: `1px solid ${borderColor}`,
        px: 3,
        py: 1.5,
        borderRadius: 2,
        minWidth: 300,
        display: 'flex',
        alignItems: 'center',
        zIndex: 1300,
        boxShadow: 1,
      }}
      role="alert"
      aria-live="assertive"
    >
      <Typography sx={{ flexGrow: 1 }}>{message}</Typography>
      <IconButton
        size="small"
        aria-label="Fermer"
        onClick={onClose}
        sx={{marginRight: -1}}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default AlertMessage;
