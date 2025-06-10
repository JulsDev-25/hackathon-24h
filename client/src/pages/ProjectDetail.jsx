import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container, Typography, Box, Button, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import EditProjectModal from "../components/EditProjectModal";
import ProjectTasks from "../components/Tasks/ProjectTasks";

const ProjectDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);

  // Pour la suppression de projet
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // fonction de suppression
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      window.location.href = "/projects"; // rediriger vers la liste des projets en actualisant la page
    } catch (err) {
      alert("Erreur lors de la suppression du projet.");
    }
  };



  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/projects/${id}/`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProject(res.data);
    }).catch(err => {
      alert("Erreur lors du chargement du projet");
      navigate("/projects");
    }).finally(() => {
      setLoading(false);
    });
  }, [id, token, navigate]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4">{project.name}</Typography>
          <Box>
            <Button variant="contained" sx={{mr: 1}} onClick={() => setEditModalOpen(true)}>
              Modifier
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Supprimer
            </Button>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {project.description || "Pas de description."}
        </Typography>

        <ProjectTasks projectId={id} />
      </Paper>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{mr: 1}} onClick={() => setDeleteDialogOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <EditProjectModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={project}
        onSave={async (updatedData) => {
          try {
            await axios.put(`/api/projects/${id}/`, updatedData, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setProject({ ...project, ...updatedData });
            setEditModalOpen(false);
          } catch (err) {
            alert("Erreur lors de la mise à jour du projet.");
          }
        }}
      />
    </Container>
  );
};

export default ProjectDetail;
