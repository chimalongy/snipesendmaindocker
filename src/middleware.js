import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./app/utils/sessions";

const protectedRoutePrefix = ["/dashboard"];
const publicRoutes = ["/login"];

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutePrefix.some(prefix => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies(); // ✅ Now awaited
  const token = cookieStore.get("session")?.value;

  const session = await decrypt(token);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}
