import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import UserInfo from "./components/UserInfo";
import LogoutButton from "./components/LogoutButton";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/me" element={
          <PrivateRoute>
            <UserInfo />
          </PrivateRoute>
        } />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        {/* Catch-all : redirige vers / en cas de route inconnue */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
