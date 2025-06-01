import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/Home',
    '/Active_Patient',
    '/Admission',
    '/Appointment',
    '/History',
    '/Profile',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const pathname = url.pathname;

  const isAuthPage = pathname === '/' || pathname === '/signin' || pathname === '/signup';
  const protectedRoutes = ['/Home', '/Active_Patient', '/Admission', '/Appointment', '/History', '/Profile'];
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (token) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/Home', request.url));
    }
    return NextResponse.next();
  } else {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
    return NextResponse.next();
  }
}