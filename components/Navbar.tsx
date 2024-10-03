import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";
import AuthButton from "./AuthButton";
import MobileNav from "./MobileNav";
async function Navbar() {
  const session = await getServerSession(NEXT_AUTH);
  const user = session?.user;
  return (
    <nav className=" sticky h-14 inset-x-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all ">
      <MaxWidthWrapper>
        <div className=" flex h-14 items-center justify-between border-b border-zinc-200 ">
          <Link href="/" className="flex z-40 font-semibold">
            <span>AskPDF.</span>
          </Link>

          {/* "!!" converts user object to boolean */}
          <MobileNav isAuth={!!user} />

          <div className=" hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href="/pricing"
                >
                  Pricing
                </Link>
                <AuthButton type="login" />
                <Button
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Get Started <ArrowRight className=" ml-1.5 h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  name={!user.name ? "Your Account" : user.name}
                  email={user.email ?? ""}
                  imageUrl={user.image ?? ""}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
