import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [, setToken] = useContext(UserContext);

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
    } else {
      setToken(data.access_token);
      setMessage("Success! Logged in as " + email);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <form className="box" onSubmit={handleSubmit}>
      <label>Email Address or Username</label>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        required
      />
      <label>Password</label>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        required
      />
      <h1>{JSON.stringify(message)}</h1>
      <br />
      <button className="button is-primary" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;