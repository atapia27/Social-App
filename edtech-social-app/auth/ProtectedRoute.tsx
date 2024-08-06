import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useAuthStore from "../zustand/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user_id, loggedIn, login } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loggedIn && user_id) {
      console.log("User is not logged in, logging in with stored user_id:", user_id);
      login(user_id);
    }
  }, [loggedIn, login, user_id]);

  useEffect(() => {
    if (mounted && !loggedIn) {
      console.log("Not logged in, redirecting to /register");
      router.push("/register");
    }
  }, [mounted, loggedIn, router]);

  if (!mounted || !loggedIn) {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  return <>{children}</>;
};

export default ProtectedRoute;
