import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
        } else {
          console.error(data.error);
        }
      });
  }, []);

  if (!user) return null;

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6">Connecté en tant que :</Typography>
      <Typography>Nom d'utilisateur : {user.username}</Typography>
      <Typography>Email : {user.email || 'Non fourni'}</Typography>
    </Box>
  );
};

export default UserInfo;
