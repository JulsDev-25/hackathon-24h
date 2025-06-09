import React, { useEffect, useState } from "react";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Box, Paper, Grid, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setProjects(res.data.projects);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          alert(err.response.data.error || "Session expirée. Veuillez vous reconnecter.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          console.error(err);
        }
      });
  }, [token, navigate]);

  return (
    <Box sx={{ bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TaskMaster
          </Typography>
          {user && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              Bonjour, {user.username}
            </Typography>
          )}
          <LogoutButton />
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mes Projets
        </Typography>
        <Grid container spacing={3}>
          {projects.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography>Aucun projet pour le moment.</Typography>
              </Paper>
            </Grid>
          )}
          {projects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" color="primary">
                  {project.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Tâches :
                </Typography>
                <List dense>
                  {project.tasks && project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <ListItem key={task.id} sx={{ pl: 0 }}>
                        <ListItemText
                          primary={task.title}
                          secondary={`Statut : ${task.status} | Assigné à : ${task.assigned_to || "Non assigné"}`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem sx={{ pl: 0 }}>
                      <ListItemText primary="Aucune tâche." />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
