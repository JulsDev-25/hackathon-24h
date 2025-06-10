import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutButton from "./LogoutButton";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" sx={{ px: 2, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Nom de l'app */}
          <Typography variant="h6" sx={{ mr: 15 }}>
            TaskMaster
          </Typography>

          {/* Bouton Dashboard */}
          <Button color="inherit" onClick={() => navigate("/")}>
            Dashboard
          </Button>

          {/* Bouton Dashboard */}
          <Button color="inherit" onClick={() => navigate("/projects")}>
            Projets
          </Button>
        </Box>

        {user && (
          <>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Bonjour, {user.username}
            </Typography>

            <LogoutButton />
          </>
        )}
        {!user && (
          <Button color="inherit" sx={{backgroundColor: 'green'}} onClick={() => navigate("/login")}>
            Connexion
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
