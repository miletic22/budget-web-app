import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useContext(UserContext);

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
        setErrorMessage(data.detail);
      } else {
        console.log(data.access_token);
        setToken(data.access_token);
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
      setErrorMessage(
        "Ensure that the passwords match and are greater than 5 characters"
      );
    }
  };

  return (
    <div className="column">
      <form className="box" onSubmit={handleSubmit}>
        <h1 className="title has-text-centered">Register</h1>
        <div className="field">
          <label className="label">Email Address</label>
          <div className="control">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required />
          </div>
        </div>
        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input
              type="password"
              placeholder="Enter password"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              className="input"
              required />
          </div>
        </div>
        <h1>{JSON.stringify(errorMessage)}</h1>
        <br />
        <button className="button is-primary" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}