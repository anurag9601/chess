"use client";

import { UserContext } from "@/context/User.context";
import React, { useContext, useEffect } from "react";

const AuthInitializer = () => {
  const { setUserData } = useContext(UserContext);

  async function authorization() {
    const request = await fetch("/api/auth/authorization");

    const response = await request.json();

    console.log("response", response);

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
