"use server";

import { cookies } from "next/headers";
import { createSession } from "./session";
import { redirect } from "next/navigation";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function authenticate(
  username: string,
  password: string
): Promise<{ error?: string } | undefined> {
  try {
    // Input validation
    if (!username?.trim() || !password) {
      return { error: "Username and password are required" };
    }

    if (username.trim().length < 3) {
      return { error: "Username must be at least 3 characters" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    // Find user in database by name (displayName)
    const user = await prisma.user.findFirst({
      where: {
        name: username.trim(),
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return { error: "Invalid username or password" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: "Invalid username or password" };
    }

    // Credentials are correct, create a session
    await createSession({
      username: user.name,
      role: user.role.name,
      userId: user.id,
      permissions: user.role.permissions,
    });

    return {};
  } catch (error) {
    console.error("Authentication error:", error);

    // Better error categorization
    if (error instanceof Error) {
      if (
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND")
      ) {
        return { error: "Database connection failed. Please try again later." };
      }
      if (error.message.includes("timeout")) {
        return { error: "Request timeout. Please try again." };
      }
      return {
        error: "An error occurred during authentication. Please try again.",
      };
    }

    return { error: "An unknown error occurred. Please try again." };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Failed to logout");
  }
}
