import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Builder from "./pages/Builder";
import Billing from "./pages/Billing";
import Layout from "./components/Layout";
import PublicRoute from "./components/PublicRoute";
import toast, { Toaster } from "react-hot-toast";

export const ServerUrl = import.meta.env.VITE_API_URL;
export const ClientUrl = import.meta.env.VITE_CLIENT_URL;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/user/current-user`, {
          withCredentials: true,
        });
        console.log("Current User:", res.data);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    console.log("App user:", user);
    fetchMe();
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute user={user} loading={loading}>
              <Login setUser={setUser} />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedRoute user={user} loading={loading} />}>
          <Route element={<Layout user={user} setUser={setUser} />}>
            <Route path="/" element={<Home user={user} />} />

            <Route
              path="/builder"
              element={<Builder user={user} setUser={setUser} />}
            />

            <Route path="/billing" element={<Billing user={user} />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
