"use client";

import { createContext, useContext, useState, useEffect } from "react";
import auth from "../../firebase/firebase";
import { User } from "firebase/auth";
import LoadingPage from "../page/LoadingPage";

const AuthContext = createContext<User | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingPage />;
  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default function useAuth() {
  return useContext(AuthContext);
}
