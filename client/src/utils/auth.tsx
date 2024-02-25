import { redirect } from "react-router-dom";
import MessagePopup from "../components/Message/MessagePopup";

export default function isLoggedIn(): boolean {
  const token = localStorage.getItem('JWTToken');
  return !!token;
};

export function Logout() {
  if (isLoggedIn()) {
    localStorage.removeItem('JWTToken');
    window.location.href = '/';
    
  }
  return <>
    <MessagePopup text="Logged out successfully." title="success" />

  </>;
}

