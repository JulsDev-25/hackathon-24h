import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Fade
} from '@mui/material';
import StyledTextField from './StyledTextField';
import AlertMessage from './AlertMessage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ajout de l'import axios

const AuthForm = () => {

  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');  // Redirige si connecté
    }
  }, [navigate]);

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [alert, setAlert] = useState({ message: '', type: 'success' });

  const [alertVisible, setAlertVisible] = useState(false)

  useEffect(() => {
    if (alert.message) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
      }, 4000); // Durée d'affichage de l'alerte
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Validation email simple
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setAlert({ message: 'Les mots de passe ne correspondent pas.', type: 'error' });
      return;
    }

    if (mode === 'register' && !validateEmail(form.email)) {
      setAlert({ message: 'Adresse email invalide.', type: 'error' });
      return;
    }

    const url = mode === 'login' ? '/api/login/' : '/api/register/';
    const payload = mode === 'login'
      ? { username: form.username, password: form.password }
      : {
          username: form.username,
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword
        };

    try {
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (mode === 'login') {
        localStorage.setItem('token', response.data.token);
        setAlert({ message: 'Connexion réussie ✅', type: 'success' });
        setForm({ username: '', firstname: '', lastname: '', email: '', password: '', confirmPassword: '' }); // reset
        navigate('/dashboard');
      } else {
        setAlert({ message: "Inscription réussie ✅", type: 'success' });
        setForm({ username: '', firstname: '', lastname: '', email: '', password: '', confirmPassword: '' }); // reset
        if(mode ==='register') {setMode('login');}
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Erreur lors de la requête';
      setAlert({ message: errorMessage, type: 'error' });
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f7fa, #fce4ec)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <AlertMessage
        message={alert.message}
        type={alert.type}
        visible={alertVisible}
        onClose={() => {
          setAlertVisible(false);
          setAlert({ message: '', type: 'success' });
        }}
      />

      <Fade in={true} timeout={500}>
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
            bgcolor: 'white',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }} align="center" gutterBottom>
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </Typography>

          <Tabs
            value={mode}
            onChange={(e, val) => setMode(val)}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label="Connexion" value="login" />
            <Tab label="Inscription" value="register" />
          </Tabs>

          <form onSubmit={handleSubmit}>
            <StyledTextField
              label="Nom d'utilisateur"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />

            {mode === 'register' && (
              <>
                <StyledTextField
                  label="Prénom"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                <StyledTextField
                  label="Nom"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
                <StyledTextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </>
            )}

            <StyledTextField
              label="Mot de passe"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />

            {mode === 'register' && (
              <StyledTextField
                label="Confirmer le mot de passe"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mt: 2, py: 1.3, fontWeight: 'bold', borderRadius: 2 }}
            >
              {mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AuthForm;
