import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';
import { toClientScale, type ScaleRow } from '@/lib/daily-selector';
import type { DailyScaleResults } from '@librato/shared';

const VoteSchema = z.object({
  scale_id: z.string().uuid(),
  vote: z.enum(['a', 'b']),
});

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

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAuth(request);
    const body = await request.json();
    const { scale_id, vote } = VoteSchema.parse(body);

    // Check the scale exists AND is published (you can only vote on the live scale)
    const { data: scale, error: scaleError } = await adminClient
      .from('daily_scales')
      .select('*')
      .eq('id', scale_id)
      .eq('status', 'published')
      .single();

    if (scaleError || !scale) {
      return err('not_found', 'Scale not found.', 404);
    }

    // Check for duplicate vote (defensive — UNIQUE constraint also catches it)
    const { data: existing } = await adminClient
      .from('daily_scale_votes')
      .select('vote')
      .eq('user_id', user.id)
      .eq('scale_id', scale_id)
      .single();

    if (existing) {
      return err(
        'already_voted',
        'You have already voted on this scale.',
        409,
      );
    }

    // Insert the vote
    const { error: insertError } = await adminClient
      .from('daily_scale_votes')
      .insert({ user_id: user.id, scale_id, vote });

    if (insertError) {
      // UNIQUE constraint race condition
      if (insertError.code === '23505') {
        return err('already_voted', 'You have already voted on this scale.', 409);
      }
      console.error('[daily-scale vote POST]', insertError);
      return err('server_error', 'Failed to record vote.', 500);
    }

    // Atomically increment the vote count
    const column = vote === 'a' ? 'votes_a' : 'votes_b';
    const { data: updated, error: updateError } = await adminClient
      .from('daily_scales')
      .update({ [column]: scale[column] + 1 })
      .eq('id', scale_id)
      .select()
      .single();

    if (updateError || !updated) {
      console.error('[daily-scale vote count update]', updateError);
      // Vote was recorded — return best-effort results using pre-update counts
      return ok({
        scale: toClientScale(scale as ScaleRow),
        hasVoted: true,
        userVote: vote,
        results: computeResults(scale.votes_a, scale.votes_b),
      });
    }

    return ok({
      scale: toClientScale(updated as ScaleRow),
      hasVoted: true,
      userVote: vote,
      results: computeResults(updated.votes_a, updated.votes_b),
    });
  } catch (e) {
    return handleError(e);
  }
}
