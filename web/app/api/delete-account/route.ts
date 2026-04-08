import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminClient } from '@/lib/supabase/admin';
import { SignJWT, jwtVerify } from 'jose';

const resend = new Resend(process.env.RESEND_API_KEY);

const SECRET = new TextEncoder().encode(
  process.env.DELETE_ACCOUNT_JWT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://librato.ai';

// ── POST /api/delete-account ───────────────────────────────────────────────
// Accepts { email } — verifies user exists, sends confirmation email.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email ?? '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'A valid email address is required.' }, { status: 400 });
    }

    // Look up user by email via Supabase Admin Auth
    const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) {
      console.error('[delete-account] listUsers error:', listError);
      return NextResponse.json({ message: 'Internal error. Please try again.' }, { status: 500 });
    }

    const user = usersData.users.find(
      (u) => u.email?.toLowerCase() === email,
    );

    // Always respond with success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Sign a short-lived JWT containing the user ID
    const token = await new SignJWT({ sub: user.id, email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET);

    const deleteLink = `${BASE_URL}/api/delete-account?token=${encodeURIComponent(token)}`;

    await resend.emails.send({
      from: 'BibleDiscern <noreply@biblediscern.app>',
      to: email,
      subject: 'Confirm Account Deletion — BibleDiscern',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background: #FDF6EC; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e8d5a3;">
            <div style="background: #1B2A4A; padding: 28px; text-align: center;">
              <p style="color: #C8A45E; font-size: 1.15rem; font-weight: 700; margin: 0;">✝ BibleDiscern</p>
            </div>
            <div style="padding: 36px 32px;">
              <h1 style="color: #1B2A4A; font-size: 1.4rem; margin-bottom: 12px;">Confirm Account Deletion</h1>
              <p style="color: #5C5144; line-height: 1.7; margin-bottom: 20px;">
                We received a request to permanently delete the BibleDiscern account
                associated with <strong>${email}</strong>.
              </p>
              <p style="color: #5C5144; line-height: 1.7; margin-bottom: 28px;">
                If you made this request, click the button below to confirm.
                <strong>This will permanently delete all your data</strong> — including
                your discernment sessions, journal entries, and Ebenezer stones.
                This action cannot be undone.
              </p>
              <div style="text-align: center; margin-bottom: 28px;">
                <a href="${deleteLink}"
                   style="display: inline-block; padding: 14px 32px; background: #8B3A00; color: #fff;
                          text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1rem;">
                  Confirm Account Deletion
                </a>
              </div>
              <p style="color: #8A7F72; font-size: 0.85rem; line-height: 1.6;">
                This link expires in 24 hours. If you did not request account deletion,
                you can safely ignore this email — your account will not be affected.
              </p>
            </div>
            <div style="background: #f5ecd7; padding: 16px 32px; text-align: center;">
              <p style="color: #8A7F72; font-size: 0.8rem; margin: 0;">
                Questions? Contact <a href="mailto:support@biblediscern.app" style="color: #C8A45E;">support@biblediscern.app</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[delete-account] POST error:', e);
    return NextResponse.json({ message: 'Internal error. Please try again.' }, { status: 500 });
  }
}

// ── GET /api/delete-account?token=... ─────────────────────────────────────
// Verifies JWT, deletes all user data, redirects to confirmation page.

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/delete-account?error=missing_token`);
  }

  let userId: string;
  let email: string;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    userId = payload.sub as string;
    email = payload.email as string;
  } catch {
    return NextResponse.redirect(`${BASE_URL}/delete-account?error=invalid_token`);
  }

  try {
    // Delete user data in dependency order
    await Promise.all([
      adminClient.from('daily_scale_votes').delete().eq('user_id', userId),
      adminClient.from('journal_entries').delete().eq('user_id', userId),
      adminClient.from('subscriptions').delete().eq('user_id', userId),
    ]);

    await adminClient.from('sessions').delete().eq('user_id', userId);
    await adminClient.from('profiles').delete().eq('id', userId);

    // Delete the auth user last
    const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('[delete-account] deleteUser error:', deleteAuthError);
      return NextResponse.redirect(`${BASE_URL}/delete-account?error=delete_failed`);
    }

    // Send goodbye email (fire-and-forget)
    resend.emails.send({
      from: 'BibleDiscern <noreply@biblediscern.app>',
      to: email,
      subject: 'Your BibleDiscern account has been deleted',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Georgia, serif; background: #FDF6EC; margin: 0; padding: 40px 20px;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e8d5a3;">
            <div style="background: #1B2A4A; padding: 28px; text-align: center;">
              <p style="color: #C8A45E; font-size: 1.15rem; font-weight: 700; margin: 0;">✝ BibleDiscern</p>
            </div>
            <div style="padding: 36px 32px;">
              <h1 style="color: #1B2A4A; font-size: 1.4rem; margin-bottom: 12px;">Account Deleted</h1>
              <p style="color: #5C5144; line-height: 1.7; margin-bottom: 16px;">
                Your BibleDiscern account has been permanently deleted. All your data
                has been removed from our systems.
              </p>
              <p style="color: #5C5144; line-height: 1.7; margin-bottom: 16px;">
                We're grateful for the time you spent weighing what matters.
                May God guide every decision ahead.
              </p>
              <p style="color: #8A7F72; font-size: 0.9rem; font-style: italic;">"Weigh it with wisdom." — BibleDiscern</p>
            </div>
            <div style="background: #f5ecd7; padding: 16px 32px; text-align: center;">
              <p style="color: #8A7F72; font-size: 0.8rem; margin: 0;">
                If you change your mind, you can always create a new account at
                <a href="${BASE_URL}" style="color: #C8A45E;">biblediscern.app</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }).catch(() => {});

    return NextResponse.redirect(`${BASE_URL}/delete-account?deleted=true`);
  } catch (e) {
    console.error('[delete-account] data deletion error:', e);
    return NextResponse.redirect(`${BASE_URL}/delete-account?error=delete_failed`);
  }
}
