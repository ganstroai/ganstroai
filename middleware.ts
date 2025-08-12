import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { LoggedUser } from "./lib/utils/constants/types";
import { routes } from "./lib/utils/constants";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /profile)
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    routes.LOGIN,
    routes.SIGN_UP,
    routes.FORGOT_PASSWORD,
    routes.RESET_PASSWORD,
    routes.SUBSCRIPTIONS,
    routes.CHECK_OUT,
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get the loggedUser cookie
  const loggedUserCookie = request.cookies.get("loggedUser");

  // If no cookie exists, redirect to login
  if (!loggedUserCookie) {
    console.log("No loggedUser cookie found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Parse the cookie value as JSON
    const loggedUser: LoggedUser = JSON.parse(loggedUserCookie.value);

    // Check if user object exists and has required fields
    if (!loggedUser.user || !loggedUser.user._id || !loggedUser.user.email) {
      console.log("Invalid user object in loggedUser cookie");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if token exists and is not empty
    if (!loggedUser.token || loggedUser.token.trim() === "") {
      console.log("No valid token found in loggedUser cookie");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Use jwt-decode to decode and validate the token
    try {
      const decodedToken: { exp?: number } = jwtDecode(loggedUser.token);

      // Check for token expiration
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        console.log("Token expired, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (jwtError) {
      console.error("Error decoding JWT token:", jwtError);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If we reach here, the user is authenticated and token is valid
    // Add user info to request headers for use in pages/components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", loggedUser.user._id);
    requestHeaders.set("x-user-email", loggedUser.user.email);
    requestHeaders.set("x-user-token", loggedUser.token);

    // Continue to the requested page with user headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // If JSON parsing fails or any other error occurs
    console.error("Error processing loggedUser cookie:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
