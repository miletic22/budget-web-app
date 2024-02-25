import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./Auth.css";
import "./Login.css";
import MessagePopup from "../Message/MessagePopup";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [, setToken] = useContext(UserContext);
  const [rememberMe, setRememberMe] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };

    const response = await fetch("http://localhost:8000/login", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.detail);
      setShowFailureMessage(true);
    } else {
      setToken(data.access_token);
      setShowSuccessMessage(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div className="wrapper">
      <div className="login-wrapper">
        <h1 className="title">LOGIN</h1>
        <form className="box" onSubmit={handleSubmit}>
          <div className="buttons">
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="user-choices">
            <div className="forgot-password">
              <a href="http://localhost:3000/forgot-password">Forgot password?</a>
            </div>
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
          </div>
          <br />
          <button className="main-button" type="submit">
            Login
          </button>
        </form>

        {showFailureMessage && (
          <MessagePopup text={message} title="failure" />
        )}

        {showSuccessMessage && (
          <MessagePopup text="Logged in successfully." title="success" />
        )}
        {showSuccessMessage && (
          window.location.href = "/home"
        )}

        <p className="message">Don't have an account? <a href="#">Register</a> instead.</p>
      </div>
    </div>
  );
};

export default Login;
