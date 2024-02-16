import { createContext, useEffect, useState } from "react";

interface UserContextProps {
  children: React.ReactNode;
}

export const UserContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, () => {}]);

export const UserProvider: React.FC<UserContextProps> = (props) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("JWTToken"));

  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token, // This might be null after setToken(null)
        },
      };
    
      const response = await fetch("http://127.0.0.1:8000/users", requestOptions);
    
      if (!response.ok) {
        setToken(null);
      }
    
      if (token !== null) {
        localStorage.setItem("JWTToken", token);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};
