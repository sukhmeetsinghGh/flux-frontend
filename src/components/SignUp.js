import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast.success("Sign-up successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Error during sign-up. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignUp}>
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>

      <div className="login-link">
        <p>Already have an account?</p>
        <button className="login-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUp;
