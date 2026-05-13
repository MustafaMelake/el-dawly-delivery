import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER", // اختياري بس يفضل
      },
    },
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
