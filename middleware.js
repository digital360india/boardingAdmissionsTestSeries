import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

const secretKey = "qwertyhnbgvfcdxsza";

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export function middleware(request) {
  const userRoleEncrypted = request.cookies.get("userRole")?.value;

  let userRole;
  try {
    if (userRoleEncrypted) {
      userRole = decryptData(userRoleEncrypted);
    }
  } catch (error) {
    console.error("Error decrypting the role:", error);
  }

  const pathname = request.nextUrl.pathname;

  if (userRole === "user") {
    if (pathname.startsWith("/user")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  }

  if (userRole === "admin") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  if (userRole === "teacher") {
    if (pathname.startsWith("/teacher")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }
  }

  if (
    !userRole &&
    (pathname.startsWith("/user") ||
      pathname.startsWith("/teacher") ||
      pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/teacher/:path*"], // Paths that need protection
};
