import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  const isPublic = pathname === "/";

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/stashbox", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};