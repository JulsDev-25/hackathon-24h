import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./components/Auth/LonginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import Layout from "./components/Layout";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
// import { ProjectContext } from "./context/ProjectContext";

export default function App() {
  return (
    <AuthProvider>
      {/* <ProjectContext> */}
        <Router>
          <Routes>
            {/* Route par défaut */}
            <Route
              path="/"
              element={
                <Layout>
                  <h1>Bienvenue sur le dashboard</h1>
                </Layout>
              }
            />

            {/* Routes publiques */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Routes protégées avec sidebar/layout */}
            <Route
              path="/projects"
              element={
                <Layout>
                  <ProjectList />
                </Layout>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <Layout>
                  <ProjectDetail />
                </Layout>
              }
            />
          </Routes>
        </Router>
      {/* </ProjectContext> */}
    </AuthProvider>
  );
}
