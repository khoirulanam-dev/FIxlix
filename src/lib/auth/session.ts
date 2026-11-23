import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
}

export async function requireUser() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/masuk");
  }
  return session;
}

export async function requireRole(allowedRoles: ("CUSTOMER" | "TECHNICIAN" | "ADMIN")[]) {
  const session = await requireUser();
  const userRole = (session.user as any).role || "CUSTOMER";
  if (!allowedRoles.includes(userRole)) {
    redirect("/");
  }
  return session;
}

