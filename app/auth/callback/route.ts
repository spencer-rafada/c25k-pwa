import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Always redirect to localhost:3000 in development
  const redirectUrl = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${redirectUrl}/?error=auth_failed`);
    }
  }

  // Redirect to home page
  return NextResponse.redirect(redirectUrl);
}
