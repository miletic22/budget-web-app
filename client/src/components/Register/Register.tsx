import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [message, setMessage] = useState("");
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
        setMessage(data.detail);
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
      setMessage(
        "Ensure that the passwords match and are greater than 5 characters"
      );
    }
  };

  return (
    <form className="box" onSubmit={handleSubmit}>
      <label className="label">Email Address</label>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        required
      />

      <label className="label">Password</label>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        required
      />

      <label className="label">Confirm Password</label>
      <input
        type="password"
        placeholder="Enter password"
        value={confirmationPassword}
        onChange={(e) => setConfirmationPassword(e.target.value)}
        className="input"
        required
      />

      <h1>{JSON.stringify(message)}</h1>
      <br />
      <button className="button is-primary" type="submit">
        Register
      </button>
    </form>
  );
}