"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

function LogoutButton() {
  return <Button onClick={() => signOut()}>Logout</Button>;
}

export default LogoutButton;
