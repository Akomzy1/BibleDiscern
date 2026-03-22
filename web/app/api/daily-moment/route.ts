import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, handleError } from '@/lib/response';

// Fallback moment shown when no row exists for today's date
const FALLBACK_MOMENT = {
  id: 'fallback',
  date: new Date().toISOString().split('T')[0],
  scripture_reference: 'James 1:5',
  scripture_text:
    'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
  reflection_prompt:
    'What decision or uncertainty are you bringing to God today? Have you asked Him directly for wisdom?',
  prayer:
    'Lord, I confess that I do not always know the right path. Grant me wisdom today — not just information, but discernment. Let me hear Your voice above the noise of my own fears and desires. Amen.',
  created_at: new Date().toISOString(),
};

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: moment } = await adminClient
      .from('daily_moments')
      .select('*')
      .eq('date', today)
      .single();

    return ok({ moment: moment ?? FALLBACK_MOMENT });
  } catch (e) {
    return handleError(e);
  }
}
