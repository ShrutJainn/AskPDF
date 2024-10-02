"use client";

import { signIn } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";

function LoginButton() {
  return (
    <Button
      onClick={() => signIn()}
      className={buttonVariants({
        variant: "ghost",
        size: "sm",
      })}
    >
      Sign In
    </Button>
  );
}

export default LoginButton;
