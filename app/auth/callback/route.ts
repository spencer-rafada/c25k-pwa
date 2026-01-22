import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle errors from Supabase
  if (error) {
    const encodedError = encodeURIComponent(errorDescription || 'Authentication failed');
    return NextResponse.redirect(`${origin}/auth/callback/status?error=${encodedError}`);
  }

  // If no code, show error
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/callback/status?error=No%20authentication%20code%20found`);
  }

  try {
    const supabase = await createClient();

    // Exchange code for session (server-side, avoids PKCE issues)
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Auth exchange error:', exchangeError);
      const encodedError = encodeURIComponent(
        exchangeError.message || 'This link may have expired. Please try again.'
      );
      return NextResponse.redirect(`${origin}/auth/callback/status?error=${encodedError}`);
    }

    // Success! Redirect to success page
    return NextResponse.redirect(`${origin}/auth/callback/status?success=true`);
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(
      `${origin}/auth/callback/status?error=An%20unexpected%20error%20occurred`
    );
  }
}
