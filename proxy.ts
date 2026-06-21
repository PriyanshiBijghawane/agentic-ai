import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
  "/projects(.*)",
]);
export default clerkMiddleware(async(auth,req)=>{
  const { userId } = await auth();

  if(!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } =await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|png|gif|svg|ttf|woff2?|ico)).*)',
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
};