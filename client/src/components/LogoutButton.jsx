import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <Button color="inherit" sx={{backgroundColor: '#ff4a4a'}} onClick={handleLogout}>
      Se déconnecter
    </Button>
  );
};

export default LogoutButton;
