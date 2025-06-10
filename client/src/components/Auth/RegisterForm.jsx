import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function RegisterForm() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register/", form);
      alert("Compte créé avec succès !");
      navigate("/login");
    } catch (err) {
      alert("erreur lors de l'inscription : " + (err.response?.data?.error || "Veuillez réessayer plus tard."));
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>Inscription</Typography>
      <form onSubmit={handleRegister}>
        <TextField fullWidth name="username" label="Nom d'utilisateur" margin="normal" onChange={handleChange} />
        <TextField fullWidth name="email" label="Email" margin="normal" onChange={handleChange} />
        <TextField fullWidth name="firstName" label="Prénom" margin="normal" onChange={handleChange} />
        <TextField fullWidth name="lastName" label="Nom" margin="normal" onChange={handleChange} />
        <TextField fullWidth name="password" label="Mot de passe" type="password" margin="normal" onChange={handleChange} />
        <TextField fullWidth name="confirmPassword" label="Confirmez le mot de passe" type="password" margin="normal" onChange={handleChange} />
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>S'inscrire</Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Déjà inscrit ? <Link to="/login">Se connecter</Link>
        </Typography>
      </form>
    </Box>
  );
}
