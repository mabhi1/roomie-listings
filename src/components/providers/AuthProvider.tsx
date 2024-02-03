"use client";

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import auth from "../../firebase/firebase";
import { User, sendEmailVerification } from "firebase/auth";
import LoadingPage from "../page/LoadingPage";
import { dosignOut } from "@/firebase/firebaseAuthFunctions";

const AuthContext = createContext<{
  currentUser: User | null;
  currentCity: string;
  setCurrentCity: Dispatch<SetStateAction<string>>;
}>({
  currentUser: null,
  currentCity: "JERSEY CITY",
  setCurrentCity: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCity, setCurrentCity] = useState<string>("JERSEY CITY");

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        await dosignOut();
      } else if (!user || user.emailVerified) {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    const city = localStorage.getItem("roomie_listings_current_location");
    if (city) setCurrentCity(city);
  }, []);

  useEffect(() => {
    localStorage.setItem("roomie_listings_current_location", currentCity);
  }, [currentCity]);

  if (loading) return <LoadingPage />;
  return <AuthContext.Provider value={{ currentUser, currentCity, setCurrentCity }}>{children}</AuthContext.Provider>;
};

export { AuthProvider };

export default function useAuth() {
  return useContext(AuthContext);
}
