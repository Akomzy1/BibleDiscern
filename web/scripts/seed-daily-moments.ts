/**
 * Seed script: inserts 30 days of daily moments centered on today.
 * Run with: npm run seed (from /web)
 *
 * Dates: today - 5 days through today + 24 days (30 total)
 * Skips dates that already exist.
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Each entry: [scripture_reference, scripture_text, reflection_prompt, prayer]
const MOMENTS: [string, string, string, string][] = [
  [
    'James 1:5',
    'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.',
    'What decision weighs on you right now that you have not yet explicitly asked God about? Why have you hesitated to bring it to Him directly?',
    'Father, I confess I sometimes try to reason my way to answers before I ask You. Today I stop and ask: grant me wisdom. Not my best guess — Your wisdom. Give me ears to hear. Amen.',
  ],
  [
    'Proverbs 3:5-6',
    'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    'Where are you currently "leaning on your own understanding" — trying to figure something out entirely through your own logic, fears, or past experience? What would submission look like in that area?',
    'Lord, my understanding is limited. My fears distort my vision. Today I lay down the need to figure it all out. I trust that Your path exists even when I cannot see it. Make it straight. Amen.',
  ],
  [
    'Isaiah 40:31',
    'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    'Have you been trying to force forward momentum through willpower alone? What would it mean, practically, to "hope in the Lord" rather than strain through your own energy today?',
    'God of the ages, I am weary. My striving has run thin. I choose today to hope — not in outcomes, not in my own effort, but in You. Renew what I cannot renew in myself. Amen.',
  ],
  [
    'Psalm 46:10',
    'He says, "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth."',
    'What noise — internal or external — is making it hardest for you to be still right now? What would you hear if that noise were quieted?',
    'Lord, I still myself before You now. The urgency can wait one moment. In this stillness, remind me who You are — and who I am because of who You are. Amen.',
  ],
  [
    'Philippians 4:6-7',
    'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    'What specific anxiety have you been carrying that you have not fully surrendered in prayer? Write it down and then surrender it — what do you need from God in this situation?',
    'Father, I bring this anxiety before You as an act of trust, not a transaction. I ask for peace that doesn\'t depend on the outcome I prefer. Guard my heart and mind in Christ. Amen.',
  ],
  [
    'Romans 8:28',
    'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    'Think of a past situation where what seemed like a setback was later revealed as something good. How does that testimony shape your trust in what you\'re facing now?',
    'God, You have been faithful before. Strengthen my faith that You are faithful now — even in what I cannot yet understand. Work in all things. Not some things. All things. Amen.',
  ],
  [
    'Ecclesiastes 3:1',
    'There is a time for everything, and a season for every activity under the heavens.',
    'Is the situation you\'re discerning being driven by impatience with God\'s timing? What would it mean to accept that right now might be a season of waiting rather than acting?',
    'Lord of all seasons, I confess I often want to rush past the waiting. Help me discern whether this is a time to act or a time to be still. Give me the wisdom to know the difference. Amen.',
  ],
  [
    'John 15:5',
    'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',
    'In what areas of your discernment process have you been operating "apart from" Christ — relying on your own network, logic, or ambition rather than remaining connected to Him?',
    'Jesus, I want to remain in You — not just for fruit, but because You are where life is. Prune what needs pruning. Let this decision grow from connection, not from striving. Amen.',
  ],
  [
    'Matthew 6:33',
    'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    'If you placed God\'s kingdom and righteousness as your first priority in this decision, what would change? What would you stop worrying about?',
    'Father, I confess that I often seek my own security first and trust You to fill in the gaps. Reverse that order in my heart. Let Your kingdom come — in this decision, in this day. Amen.',
  ],
  [
    '1 Corinthians 10:13',
    'No temptation has overtaken you except what is common to mankind. And God is faithful; he will not let you be tempted beyond what you can bear. But when you are tempted, he will also provide a way out so that you can endure it.',
    'What is the strongest pull you feel right now toward a choice you suspect is not God\'s best? What might God\'s "way out" look like in your situation?',
    'Faithful God, I am not facing anything You haven\'t already accounted for. Help me see the way of escape You have prepared — and give me the courage to take it. Amen.',
  ],
  [
    'Galatians 5:22-23',
    'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.',
    'As you consider your options, which path produces more of these fruits in your heart? Which produces anxiety, harshness, or self-centeredness? The fruit often points the way.',
    'Spirit of God, bear fruit in me that I cannot manufacture on my own. Let my discernment be guided not just by logic, but by the peace and love that only You produce. Amen.',
  ],
  [
    'Ephesians 3:20',
    'Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us.',
    'Are you limiting your imagination of what God might do in this situation to what seems realistic from a human perspective? What would you ask for if you truly believed this verse?',
    'God who exceeds imagination, I confess I have shrunk You to the size of my own expectations. Expand my vision. Do far more than I can currently conceive. And let it be for Your glory. Amen.',
  ],
  [
    'Psalm 23:1-3',
    'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name\'s sake.',
    'What does it feel like to imagine God as your shepherd in this situation — not your manager, judge, or problem-solver, but your shepherd? What does a sheep do that you need to do right now?',
    'Good Shepherd, I have been trying to find my own path. Bring me back to still waters. Lead me along the right paths today — not for my reputation, but for Yours. I will follow. Amen.',
  ],
  [
    'Proverbs 16:3',
    'Commit to the Lord whatever you do, and he will establish your plans.',
    'What specific plan or ambition have you been holding tightly? What would it look like to genuinely "commit" it to God — releasing it, not just mentioning it?',
    'Lord, I want to commit this plan to You — truly commit, not just ask for Your blessing on what I\'ve already decided. Establish what is Yours to establish. Let go what is mine to release. Amen.',
  ],
  [
    'Isaiah 26:3',
    'You will keep in perfect peace those whose minds are steadfast, because they trust in you.',
    'Where is your mind most prone to spiraling in anxiety about this situation? What would it mean to actively fix your mind on God rather than on the unknown outcome?',
    'God of perfect peace, my mind runs ahead of me into every feared outcome. Draw it back. Anchor it in You. Not in resolution — in You. Let that peace that passes understanding stand guard. Amen.',
  ],
  [
    'Matthew 11:28-30',
    'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.',
    'What burden are you carrying right now that Jesus is actively inviting you to set down? What makes it hard to accept His rest — pride, control, or the belief that you must figure it out yourself?',
    'Jesus, I am weary. I accept Your invitation — not because I have nothing left, but because You are better than what I\'ve been straining toward. I take Your yoke. I will learn from You today. Amen.',
  ],
  [
    'Romans 12:2',
    'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is — his good, pleasing and perfect will.',
    'In what ways has the "pattern of this world" shaped how you are approaching this decision — through fear of failure, the need for approval, or the pursuit of status? What transformation is needed?',
    'Father, renew my mind. Strip away the expectations of culture, family, and social media. Let me think Your thoughts. Give me clarity to test and know Your will — not just what I want to be Your will. Amen.',
  ],
  [
    'James 4:13-14',
    'Now listen, you who say, "Today or tomorrow we will go to this or that city, spend a year there, carry on business and make money." Why, you do not even know what will happen tomorrow. What is your life? You are a mist that appears for a little while and then vanishes.',
    'Does this verse unsettle you or bring relief? What does the brevity of life clarify about what truly matters in the decision you\'re facing today?',
    'God of eternity, the mist of my life catches me off guard. Set my decisions in the context of what is eternal. What I build for You lasts. What I build for myself vanishes. Help me build wisely. Amen.',
  ],
  [
    'Philippians 1:6',
    'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.',
    'Do you trust that God has a "good work" He is completing in you — even through the uncertainty you\'re navigating right now? What would it change if you believed He is the one carrying this to completion?',
    'Lord, You began something in me I do not fully understand. I trust that You will complete it. Even this confusion, this waiting — You are working. I rest in Your faithfulness. Amen.',
  ],
  [
    'John 16:33',
    'I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.',
    'Jesus did not promise you a trouble-free path — He promised Himself as the peace within the trouble. How does "take heart, I have overcome" change how you approach what you\'re facing?',
    'Jesus, You did not promise an easy road. You promised Your presence on the hard one. I take heart today — not because my circumstances are resolved, but because You are with me. Amen.',
  ],
  [
    '1 Corinthians 13:4-7',
    'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love always protects, always trusts, always hopes, always perseveres.',
    'Which of these qualities of love is most absent in how you are approaching your current situation — patience, kindness, or hope? What is that absence telling you about what you need from God?',
    'God who is love, I want to act in love — not sentiment, but the kind that endures. Fill the gaps in me. Where I am impatient, give patience. Where I have lost hope, restore it. Let love be the motive. Amen.',
  ],
  [
    'Galatians 2:20',
    'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.',
    'How much of this decision is being driven by your old self — your ego, your self-preservation, your reputation? What would it look like to make this choice as one who has been "crucified with Christ"?',
    'Christ Jesus, let it be You living in me — not my fear, not my ambition, not my need for approval. I lay down my life again today. Live through me. Decide through me. Love through me. Amen.',
  ],
  [
    'Ephesians 6:10-11',
    'Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil\'s schemes.',
    'Is there a spiritual dimension to the resistance or confusion you\'re experiencing? What might "taking your stand" look like — practically — in the decision you are facing today?',
    'Lord of armies, I acknowledge that not every struggle is merely circumstantial. Give me strength that is not my own. Let me stand — not in my cleverness, but in Your mighty power. Amen.',
  ],
  [
    'Psalm 37:4-5',
    'Take delight in the Lord, and he will give you the desires of your heart. Commit your way to the Lord; trust in him and he will do this.',
    'What are the deepest desires driving this decision? Are they desires born from delight in God, or from something else? How might delighting in God first reshape what you truly want?',
    'Father, change what I delight in if my delights are pulling me away from You. Let my deepest desire be to know You. From that place, let every other desire find its proper shape. Amen.',
  ],
  [
    'Proverbs 11:14',
    'For lack of guidance a nation falls, but victory comes through many advisers.',
    'Who are the trusted, wise, God-fearing people in your life who you have not yet consulted about this decision? What is stopping you from seeking counsel?',
    'Lord, keep me from the pride that insists on going it alone. Lead me to the right voices — people who fear You, who love me enough to tell the truth. Give me humility to hear them. Amen.',
  ],
  [
    'Isaiah 55:8-9',
    '"For my thoughts are not your thoughts, neither are your ways my ways," declares the Lord. "As the heavens are higher than the earth, so are my ways higher than your ways and my thoughts than your thoughts."',
    'Is there a possibility you are resisting — one that seems wrong to you — that might actually be God\'s higher way? What would it mean to hold your current understanding loosely?',
    'God whose ways are beyond me, I confess I have sometimes confused my preferences with Your will. Humble me. Lift my eyes above my own understanding. Let Your higher way become clear. Amen.',
  ],
  [
    'Matthew 7:7-8',
    'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you. For everyone who asks receives; the one who seeks finds; and to the one who knocks, the door will be opened.',
    'Are you asking, seeking, and knocking — or are you passively waiting for clarity to arrive without pursuing God? What specific door needs knocking on today?',
    'Father, I come to You actively — asking, not assuming. Seeking, not spectating. I knock on the door of Your will today. Open what needs to be opened. Close what needs to be closed. Amen.',
  ],
  [
    'Romans 5:3-5',
    'We also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope. And hope does not put us to shame, because God\'s love has been poured out into our hearts through the Holy Spirit.',
    'What character is God producing in you through the difficulty of this season? Can you see the chain — suffering → perseverance → character → hope — at work in your own story?',
    'God, I cannot always "glory" in this. Help me trust the chain. What feels like loss, let it produce something lasting. Let my character be formed by what I cannot control. Let hope hold. Amen.',
  ],
  [
    'James 1:2-4',
    'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance. Let perseverance finish its work so that you may be mature and complete, not lacking anything.',
    'What is being tested in you right now — your faith in God\'s goodness, His timing, His power? What would it mean to let this testing "finish its work" rather than rushing past it?',
    'Lord, I cannot manufacture joy in this trial. But I ask for the kind of joy that comes from trusting the process — knowing that You are completing something in me I cannot see yet. Let perseverance do its work. Amen.',
  ],
  [
    'Ecclesiastes 12:13',
    'Now all has been heard; here is the conclusion of the matter: Fear God and keep his commandments, for this is the duty of all mankind.',
    'When all complexity is stripped away, does your discernment come back to this: fear God and obey Him? What is the simplest obedient step available to you today?',
    'God, when I have overthought and overanalyzed, bring me back to the simple call: fear You, obey You. Show me the next right step. I will take it. Amen.',
  ],
];

function getDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

async function seed() {
  console.log('🌱 Seeding daily moments...\n');

  // Start 5 days ago, go 24 days forward (30 total)
  const inserts = MOMENTS.map((moment, i) => ({
    date: getDateString(i - 5),
    scripture_reference: moment[0],
    scripture_text: moment[1],
    reflection_prompt: moment[2],
    prayer: moment[3],
  }));

  let inserted = 0;
  let skipped = 0;

  for (const row of inserts) {
    const { error } = await supabase
      .from('daily_moments')
      .upsert(row, { onConflict: 'date', ignoreDuplicates: true });

    if (error) {
      console.error(`❌ Failed to insert ${row.date}:`, error.message);
    } else {
      console.log(`✓ ${row.date} — ${row.scripture_reference}`);
      inserted++;
    }
  }

  console.log(`\n✅ Done. Inserted: ${inserted}, Skipped: ${skipped}`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
