import React, { createContext, useState, useEffect, ReactNode } from "react";

interface UserContextProps {
  userEmail: string | null;
  userId: string | null;
  setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = createContext<UserContextProps>({
  userEmail: null,
  userId: null,
  setUserEmail: () => {},
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem("userEmail") || null;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userEmail, userId, setUserEmail, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

