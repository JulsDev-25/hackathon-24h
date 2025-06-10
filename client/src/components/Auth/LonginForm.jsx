import { useState, useContext } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login/", { username, password });
      login(res.data.token);
      navigate("/");  // redirige vers la page d'accueil
    } catch {
      alert("Identifiants invalides");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>Connexion</Typography>
      <form onSubmit={handleLogin}>
        <TextField fullWidth label="Nom d'utilisateur" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField fullWidth label="Mot de passe" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Mot de passe oublié ? <Link to="/reset-password">Réinitialiser</Link>
        </Typography>
        <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Se connecter</Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Pas encore inscrit ? <Link to="/register">Créer un compte</Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Vous pouvez aussi vous connecter avec <Link to="/oauth/google">Google</Link> ou <Link to="/oauth/linkedin">LinkedIn</Link>.
        </Typography>
      </form>
    </Box>
  );
}
