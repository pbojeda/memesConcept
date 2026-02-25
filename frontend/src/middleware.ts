import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export default auth((req) => {
    const isAuth = !!req.auth;
    const isLoginPage = req.nextUrl.pathname === '/admin/login';

    if (req.nextUrl.pathname.startsWith('/admin') && !isLoginPage && !isAuth) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (isLoginPage && isAuth) {
        return NextResponse.redirect(new URL('/admin/products', req.url));
    }
});

export const config = {
    matcher: ["/admin/:path*"],
};
