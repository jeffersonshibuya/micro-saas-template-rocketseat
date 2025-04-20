"use server";

import { signIn } from "../lib/auth";

export async function handleAuth() {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}
