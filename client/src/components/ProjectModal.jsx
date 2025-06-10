import React, { useState, useContext } from 'react';
import {
  Modal, Box, TextField, Button, Typography
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const style = {
  position: 'absolute',
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
  boxShadow: 24,
};

const ProjectModal = ({ open, onClose, initialData = null }) => {
  const { token } = useContext(AuthContext);
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        // TODO: Edit logic
      } else {
        await axios.post('/api/projects/', { name, description }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      alert('Erreur création projet : ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          {initialData ? 'Modifier le projet' : 'Créer un projet'}
        </Typography>
        <TextField
          fullWidth label="Nom" value={name}
          onChange={e => setName(e.target.value)}
          required sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="Description" value={description}
          onChange={e => setDescription(e.target.value)}
          multiline rows={3}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit">
          {initialData ? 'Modifier' : 'Créer'}
        </Button>
      </Box>
    </Modal>
  );
};

export default ProjectModal;
