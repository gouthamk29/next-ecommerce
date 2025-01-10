// import { authMiddleware } from "@clerk/nextjs/";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// export default authMiddleware();
export default clerkMiddleware((auth, req) => {
  // if (isProtectedRoute(req)) {
  //   auth().protect();
  // }

  if (!isPublicRoute(req)) {
    auth().protect();
  }
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

const isProtectedRoute = createRouteMatcher(["/"]);

// need to fixed so some GET api routes are avalable public
const isPublicRoute = createRouteMatcher([
  "/api/:path(.*)",
  "/sign-in",
  "/sign-up",
]);
