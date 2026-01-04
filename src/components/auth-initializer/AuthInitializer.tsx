"use client";

import { UserContext } from "@/context/User.context";
import { useContext, useEffect } from "react";

const AuthInitializer = () => {
  const { setUserData } = useContext(UserContext);

  async function authorization() {
    const request = await fetch("/api/auth/authorization");

    const response = await request.json();

    if (response.success === true) {
      setUserData(response.data);
    }
  }

  useEffect(() => {
    authorization();
  }, []);
  
  return null;
};

export default AuthInitializer;
