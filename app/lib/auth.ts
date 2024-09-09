import { db } from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
      },
      async authorize(credentials: any) {
        const email = credentials.email;

        //find user in the db
        let user;
        user = await db.user.findUnique({
          where: { email: email },
        });
        if (!user) {
          user = await db.user.create({
            data: {
              email: email,
            },
          });
        }
        return {
          //token will be created based on the id, name and email

          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token, user }: any) => {
      if (session && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
