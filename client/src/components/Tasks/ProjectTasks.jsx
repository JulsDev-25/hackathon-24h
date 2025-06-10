import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Box, Typography, Grid, Paper, Button, List, ListItem, ListItemText
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const STATUSES = {
  TODO: "À faire",
  DOING: "En cours",
  DONE: "Terminé",
};

const ProjectTasks = ({ projectId }) => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Erreur chargement des tâches", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return (
    <Box mt={4}>
      <Typography variant="h5">Tâches</Typography>
      <Grid container spacing={2} mt={1}>
        {Object.keys(STATUSES).map((status) => (
          <Grid item xs={12} sm={4} key={status}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{STATUSES[status]}</Typography>
              <List>
                {tasks.filter(t => t.status === status).map(task => (
                  <ListItem key={task.id}>
                    <ListItemText
                      primary={task.title}
                      secondary={task.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectTasks;
