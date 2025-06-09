import React from 'react';
import { TextField } from '@mui/material';

const StyledTextField = ({ label, name, type = 'text', value, onChange, required = true }) => {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      fullWidth
      variant="filled"
      margin="dense"
      value={value}
      onChange={onChange}
      required={required}
      InputProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#f5f5f5',
          '&:hover': { bgcolor: '#eeeeee' },
          '&.Mui-focused': { bgcolor: '#fff' }
        }
      }}
    />
  );
};

export default StyledTextField;
