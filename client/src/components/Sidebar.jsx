import React, { useEffect, useState, useContext } from 'react';
import {
  Drawer, List, ListItem, ListItemText,
  Typography, Button, Box
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProjectModal from './ProjectModal';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Erreur chargement projets :' + err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [modalOpen]); // rechargement après ajout

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{ width: 250, flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 250, boxSizing: 'border-box' }
      }}
    >
      <Box sx={{ p: 2, mt: 10}}>
        <Typography variant="h6">Projets</Typography>
        <List>
          {projects.map(project => (
            <ListItem
              button
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}/`)}
            >
              <ListItemText primary={project.name} />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          fullWidth
          onClick={() => setModalOpen(true)}
        >
          Créer un projet
        </Button>

        <ProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
