import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, handleError } from '@/lib/response';
import { ensureDayPublished, toClientScale } from '@/lib/daily-selector';
import type { DailyScale, DailyScaleResults } from '@librato/shared';

// Safety-net fallback — shown when no scale has been seeded for today
const FALLBACK_SCALE: DailyScale = {
  id: 'fallback',
  date: new Date().toISOString().split('T')[0],
  question:
    'When you feel restless about a decision, is that anxiety speaking — or the Holy Spirit creating holy discomfort?',
  side_a_label: 'It\'s anxiety speaking',
  side_a_argument:
    'Restlessness often reflects our brain\'s threat-detection system, not divine guidance. Paul commands us to "be anxious for nothing" (Phil 4:6) — suggesting anxiety is something to hand over, not follow. Treating restlessness as a spiritual signal can keep us paralyzed instead of trusting the wisdom God has already given us.',
  side_b_label: 'It\'s holy discomfort',
  side_b_argument:
    'God often uses an unsettled spirit to keep us from settling for less than His best. Jonah felt no restlessness before Nineveh — and ran the wrong way. The disciples were "troubled in spirit" before every major calling. A persistent, directional restlessness that returns after prayer may be the Spirit\'s gentle refusal to let you rest in the wrong place.',
  scripture_reference: 'Philippians 4:6–7 & 1 Kings 19:4–8',
  scripture_text:
    '"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus." — Phil 4:6–7',
  scripture_lens:
    'Paul\'s command is not to suppress restlessness but to convert it — bring it to God in prayer and watch it transform into peace. Yet Elijah\'s story reminds us that God sometimes speaks in the restlessness itself: the angel touched him twice, saying "arise and eat, the journey is too great." Scripture holds both: bring the anxiety to God (Paul) and listen to what the restlessness is pointing toward (Elijah). The question is not whether to feel restless, but what to do with it.',
  prayer:
    'Lord, I bring You this restlessness. I do not know if it is fear or faith, anxiety or calling. Guard my heart with Your peace — and if this unease is Your voice, give me ears to hear it clearly. Amen.',
  votes_a: 214,
  votes_b: 183,
};

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

    // Lazy selection (no-cron safety): ensure today's scale is published, then
    // read it. Falls back to a hardcoded scale only if the pool is truly empty.
    const row = await ensureDayPublished();
    const scale: DailyScale = row ? toClientScale(row) : FALLBACK_SCALE;
    const scaleId = row?.id ?? 'fallback';

    // Check if user has already voted (only for a real published scale)
    const { data: voteRow } =
      scaleId !== 'fallback'
        ? await adminClient
            .from('daily_scale_votes')
            .select('vote')
            .eq('user_id', user.id)
            .eq('scale_id', scaleId)
            .maybeSingle()
        : { data: null };

    if (voteRow) {
      return ok({
        scale,
        hasVoted: true,
        userVote: voteRow.vote as 'a' | 'b',
        results: computeResults(scale.votes_a, scale.votes_b),
      });
    }

    // Not yet voted — strip the Scripture Lens fields
    const { scripture_reference, scripture_text, scripture_lens, prayer, ...preview } = scale;
    return ok({ scale: preview, hasVoted: false });
  } catch (e) {
    return handleError(e);
  }
}
