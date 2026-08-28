import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/api/revalidate/wordpress') {
    return NextResponse.next();
  }

  if (pathname !== '/' && !pathname.endsWith('/') && !pathname.split('/').pop()?.includes('.')) {
    const destination = request.nextUrl.clone();
    destination.pathname = `${pathname}/`;
    return NextResponse.redirect(destination, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
