import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

import "./Auth.css";
import "./Register.css";
import MessagePopup from "../Message/MessagePopup";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useContext(UserContext);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const submitRegistration = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      };

      const response = await fetch("http://127.0.0.1:8000/users", requestOptions);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail);
        setShowFailureMessage(true);
      } else {
        setToken(data.access_token);
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("JWTToken", token as string);
  }, [token]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === confirmationPassword) {
      submitRegistration();
    } else {
      setMessage(
        "Ensure that the passwords match and are greater than 5 characters"
      );
    }
  };

  return (
    <div className="wrapper">
      <div className="register-wrapper">
      <h1 className="title">REGISTER</h1>
      <form className="box" onSubmit={handleSubmit}>
      <div className="buttons">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        required
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        required
      />
      <input
        type="password"
        placeholder="Enter password"
        value={confirmationPassword}
        onChange={(e) => setConfirmationPassword(e.target.value)}
        className="input"
        required
      />
      </div>
      <br />
      <button className="main-button" type="submit">
        Register
      </button>
    </form>
    {showFailureMessage && (
      <MessagePopup text={message + '.'} title="failure" />
    )}

    {showSuccessMessage && (
      <MessagePopup text="Registered successfully." title="success" />
    )}
    <p className="message">Have an have an account? <a href="/login">Login</a> instead.</p>
    </div>
    </div>
  );
}