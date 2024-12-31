import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make POST request for login
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      const token = response.headers["authorization"];

      if (token && token.startsWith("Bearer ")) {
        const actualToken = token.replace("Bearer ", "");
        localStorage.setItem("auth-token", actualToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        navigate("/dashboard");
      } else {
        console.error("Token not found or invalid in response headers");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
