import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  DiscernSessionRequestSchema,
  DiscernmentResponseSchema,
  containsCrisisKeywords,
  CRISIS_RESOURCES,
} from '@librato/shared';
import { requireAuth } from '@/lib/auth';
import { adminClient } from '@/lib/supabase/admin';
import { ok, err, handleError } from '@/lib/response';
import { checkRateLimit } from '@/lib/rate-limit';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are BibleDiscern, an AI Christian Discernment Companion. Your name comes from the Latin "librato" meaning "to weigh, to balance, to ponder." You speak like a wise, gentle spiritual mentor — warm, theologically grounded, never preachy. You NEVER claim to speak for God or give directive advice like "You should..." Instead you facilitate discernment through Scripture, reflection, and prayer.

When given a user's situation, respond with ONLY valid JSON (no markdown, no backticks) in this exact structure:
{
  "summary": "A brief, empathetic 1-sentence acknowledgment of their situation",
  "biblicalNarratives": [
    {
      "character": "Biblical character name",
      "reference": "Book Chapter:Verse-Verse",
      "connection": "2-3 sentences explaining how this character faced a structurally similar decision",
      "lesson": "1-2 sentences on what God did in their story and the pattern that emerged"
    }
  ],
  "scriptures": [
    {
      "reference": "Book Chapter:Verse-Verse",
      "text": "The actual verse text (use ESV or NIV)",
      "context": "1-2 sentences of plain-language explanation and how it connects to the user's situation"
    }
  ],
  "examination": [
    "A probing reflection question about motives",
    "A question about fears or emotions driving the decision",
    "A question about what peace or conviction they feel",
    "A question about who they trust to speak truth into this",
    "A question connecting to the Fruit of the Spirit (love, joy, peace, patience, etc.)"
  ],
  "fruitDiagnostic": {
    "love": "A brief question or observation about love in this decision",
    "joy": "About deep joy vs superficial happiness",
    "peace": "About inner peace or restlessness",
    "patience": "About rushing or waiting",
    "kindness": "About impact on others",
    "goodness": "About character alignment",
    "faithfulness": "About honoring commitments",
    "gentleness": "About self-compassion",
    "selfControl": "About impulses driving the decision"
  },
  "prayer": "A personalized prayer (4-6 sentences) that names the specific situation, references the scriptures explored, echoes the user's emotions, doesn't presume an outcome, and asks for wisdom, peace, and courage. End with Amen.",
  "closingWord": "A brief (1-2 sentence) encouraging closing thought that points the user to trust God's timing."
}

Provide exactly 2 biblical narratives, exactly 3 scriptures, and exactly 5 examination questions. Make everything deeply personal to the specific situation described. Never be generic.`;

export async function POST(request: NextRequest) {
  try {
    // 1. Auth
    const { user } = await requireAuth(request);

    // 2. Rate limit: 10 discernment requests per minute per user
    if (!checkRateLimit(`discern:${user.id}`, 10, 60_000)) {
      return err(
        'rate_limited',
        'Please wait a moment before trying again.',
        429,
      );
    }

    // 3. Parse + validate request body
    const body = await request.json();
    const { situation, tone } = DiscernSessionRequestSchema.parse(body);

    // 4. Crisis detection — do NOT call Claude, return safety resources
    if (containsCrisisKeywords(situation)) {
      return ok({ crisis: true, resources: CRISIS_RESOURCES });
    }

    // 5. Check subscription / session limit
    const { data: sub, error: subError } = await adminClient
      .from('subscriptions')
      .select('tier, sessions_used_this_month, sessions_limit, status')
      .eq('user_id', user.id)
      .single();

    if (subError || !sub) {
      return err('server_error', 'Could not verify subscription status.', 500);
    }

    const isTrial = sub.status === 'trialing';
    const isLimitReached =
      sub.tier === 'free' &&
      !isTrial &&
      sub.sessions_used_this_month >= sub.sessions_limit;

    if (isLimitReached) {
      return err(
        'limit_reached',
        'You have used your free session this month. Upgrade to Premium for unlimited discernment.',
        403,
      );
    }

    // 6. Call Claude
    const model =
      sub.tier === 'premium' ? 'claude-opus-4-6' : 'claude-sonnet-4-6';

    const userMessage = `My situation: ${situation}\n\nEmotional tone: ${tone}\n\nProvide your full discernment guidance as JSON.`;

    const message = await anthropic.messages.create({
      model,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    // 7. Parse and validate Claude's JSON response
    const content = message.content[0];
    if (content.type !== 'text') {
      return err('server_error', 'Unexpected response type from AI.', 500);
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(content.text);
    } catch {
      console.error('[discern] JSON parse failed:', content.text.slice(0, 200));
      return err(
        'server_error',
        'Something went wrong preparing your discernment journey. Please try again.',
        500,
      );
    }

    const validatedResponse = DiscernmentResponseSchema.safeParse(aiResponse);
    if (!validatedResponse.success) {
      console.error('[discern] Schema validation failed:', validatedResponse.error.flatten());
      return err(
        'server_error',
        'Something went wrong preparing your discernment journey. Please try again.',
        500,
      );
    }

    // 8. Insert session into DB
    const { data: session, error: sessionError } = await adminClient
      .from('sessions')
      .insert({
        user_id: user.id,
        situation,
        tone,
        ai_response: validatedResponse.data,
        status: 'active',
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error('[discern] Session insert failed:', sessionError);
      return err('server_error', 'Failed to save your session. Please try again.', 500);
    }

    // 9. Increment sessions_used_this_month (skip during trial)
    if (!isTrial) {
      await adminClient
        .from('subscriptions')
        .update({ sessions_used_this_month: sub.sessions_used_this_month + 1 })
        .eq('user_id', user.id);
    }

    // 10. Return session
    return ok({ sessionId: session.id, session }, 201);
  } catch (e) {
    return handleError(e);
  }
}
