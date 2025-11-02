"use client";

import { UserContext } from "@/context/User.context";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const page = () => {
  const pathName = usePathname();
  const { userData } = useContext(UserContext);

  const [verified, setVerified] = useState<boolean>(false);

  async function verifyEmail() {
    
  }

  useEffect(() => {
    console.log("pathName", pathName);
  }, []);
  return <div>page</div>;
};

export default page;
