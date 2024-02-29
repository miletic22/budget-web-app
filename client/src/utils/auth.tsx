import MessagePopup from "../components/Message/MessagePopup";

export default function isLoggedIn(): boolean {
  const token = localStorage.getItem('JWTToken');
  return !!token;
};

export function Logout() {
  if (isLoggedIn()) {
    localStorage.removeItem('JWTToken');
    window.location.href = '/login';
    
  }
  return <>
    <MessagePopup text="Logged out successfully." title="success" />
  </>;
}


export async function fetchWithInterceptor(dataUrl: string, payload: object) {
  const response = await fetch(dataUrl, payload);
  if (response.status === 401 && window.location.pathname !== '/login') {
    window.location.href = '/login';
    localStorage.removeItem('JWTToken');
  }

  return response;
}