"use client";

import { signIn, signOut } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";

function AuthButton({ type }: { type: string }) {
  //   return type === "signout" ? (
  //     <Button onClick={() => signOut()}>Logout</Button>
  //   ) : (
  //     <Button
  //       onClick={() => signIn()}
  //       className={buttonVariants({
  //         variant: "ghost",
  //         size: "sm",
  //       })}
  //     >
  //       Sign In
  //     </Button>
  //   );
  return (
    <Button
      onClick={() => {
        type === "signout" ? signOut() : signIn();
      }}
      className={buttonVariants({
        variant: "ghost",
        size: "sm",
      })}
    >
      {type === "signout" ? "Logout" : "Sign In"}
    </Button>
  );
}

export default AuthButton;
