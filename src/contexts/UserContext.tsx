import React, { createContext, useState, ReactNode } from "react";

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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userEmail, userId, setUserEmail, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
