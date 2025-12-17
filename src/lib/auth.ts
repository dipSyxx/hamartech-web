import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const CredentialsSchema = z.object({
  identifier: z.string().trim().min(3),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = CredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { identifier, password } = parsed.data;
        const input = identifier.trim();
        const isEmail = input.includes("@");
        const where = isEmail ? { email: input } : { phone: input };

        const user = await prisma.user.findUnique({ where });
        if (!user || !user.passwordHash) {
          throw new Error("INVALID_CREDENTIALS");
        }
        if (!user.emailVerifiedAt) {
          throw new Error("UNVERIFIED");
        }

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) {
          throw new Error("INVALID_CREDENTIALS");
        }

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
      }
      return session;
    },
  },
};
