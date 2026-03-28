import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';
import type { DailyScaleResults } from '@librato/shared';

function computeResults(votes_a: number, votes_b: number): DailyScaleResults {
  const total = votes_a + votes_b;
  if (total === 0) return { votes_a: 0, votes_b: 0, percent_a: 50, percent_b: 50, total: 0 };
  return {
    votes_a,
    votes_b,
    percent_a: Math.round((votes_a / total) * 100),
    percent_b: Math.round((votes_b / total) * 100),
    total,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);

    // Premium check
    const { data: sub } = await adminClient
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .single();

    const isPremium = sub && (sub.tier === 'premium' || sub.status === 'trialing');

    if (!isPremium) {
      return err('upgrade_required', 'Scale history requires BibleDiscern Premium.', 403);
    }

    // Fetch last 7 days of scales
    const { data: scales, error: scalesError } = await adminClient
      .from('daily_scales')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);

    if (scalesError || !scales) {
      return err('server_error', 'Failed to fetch scale history.', 500);
    }

    if (scales.length === 0) {
      return ok({ history: [] });
    }

    const scaleIds = scales.map((s) => s.id);

    // Fetch user's votes for these scales
    const { data: votes } = await adminClient
      .from('daily_scale_votes')
      .select('scale_id, vote')
      .eq('user_id', user.id)
      .in('scale_id', scaleIds);

    const voteMap = new Map((votes ?? []).map((v) => [v.scale_id, v.vote as 'a' | 'b']));

    const history = scales.map((scale) => ({
      scale,
      hasVoted: voteMap.has(scale.id),
      userVote: voteMap.get(scale.id),
      results: computeResults(scale.votes_a, scale.votes_b),
    }));

    return ok({ history });
  } catch (e) {
    return handleError(e);
  }
}
