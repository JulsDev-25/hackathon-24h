import { useNavigate } from "react-router-dom";

const AuthButton = ({ user }) => {
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <button onClick={onLogout}>
        Se déconnecter
      </button>
    );
  } else {
    return (
      <button onClick={() => navigate("/login")}>
        Se connecter
      </button>
    );
  }
};

export default AuthButton;