import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function randVotes(sideAPercent: number) {
  const total = Math.floor(Math.random() * 300) + 150;
  const votes_a = Math.round(total * (sideAPercent / 100));
  return { votes_a, votes_b: total - votes_a };
}

const today = new Date();

const scales = [
  {
    date: addDays(today, 0),
    question: 'When you feel restless about a decision, is that anxiety speaking — or the Holy Spirit creating holy discomfort?',
    side_a_label: 'It\'s anxiety speaking',
    side_a_argument: 'Restlessness often reflects our brain\'s threat-detection system rather than divine guidance. Paul commands us to "be anxious for nothing" (Phil 4:6), suggesting anxiety is something to surrender, not follow. Treating every unsettled feeling as a spiritual signal can keep us paralyzed rather than trusting the wisdom God has already given.',
    side_b_label: 'It\'s holy discomfort',
    side_b_argument: 'God frequently uses an unsettled spirit to prevent us from settling for less than His best. Jonah felt no restlessness before fleeing Nineveh — and ran the wrong direction. A persistent, directional unease that returns after prayer may be the Spirit\'s quiet refusal to let us rest in the wrong place.',
    scripture_reference: 'Philippians 4:6–7 & 1 Kings 19:4–8',
    scripture_text: '"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus." — Philippians 4:6–7',
    scripture_lens: 'Paul\'s command is not to suppress restlessness but to convert it — bring it to God and watch it transform into peace. Yet Elijah\'s story shows that God sometimes speaks through the restlessness itself: the angel touched him twice, saying "arise and eat, the journey is too great for you." Scripture holds both: surrender the anxiety to God (Paul) and listen to what the unease is pointing toward (Elijah). The question isn\'t whether to feel restless, but what to do with it.',
    prayer: 'Lord, I bring You this unsettled feeling. I don\'t know if it is fear or faith, anxiety or calling. Give me the peace that surpasses understanding — and if this unease is Your voice, grant me ears to hear it clearly. Amen.',
    ...randVotes(55),
  },
  {
    date: addDays(today, 1),
    question: 'Is "keeping the peace" wisdom — or avoidance?',
    side_a_label: 'It\'s relational wisdom',
    side_a_argument: 'Peacemaking is a beatitude, not a weakness. "Blessed are the peacemakers" (Matt 5:9) — Jesus names it as a hallmark of God\'s children. Many conflicts are not worth the relational damage they cause, and choosing harmony over being right can itself be an act of love.',
    side_b_label: 'It\'s often avoidance',
    side_b_argument: 'Jesus also said, "I did not come to bring peace, but a sword" (Matt 10:34) — He knew that truth divides. Keeping peace at the expense of honesty allows sin to fester, relationships to calcify, and people we love to remain in comfortable error. What feels like keeping the peace is often just keeping the silence.',
    scripture_reference: 'Matthew 5:9 & Matthew 10:34–36',
    scripture_text: '"Blessed are the peacemakers, for they shall be called sons of God." — Matthew 5:9 | "Do not think that I have come to bring peace to the earth. I have not come to bring peace, but a sword." — Matthew 10:34',
    scripture_lens: 'Both verses come from the same Jesus — and that\'s the point. Biblical peacemaking is not conflict avoidance; it is the costly work of reconciliation. Peacemakers do hard things for the sake of real peace, not a false surface calm. The sword Jesus brings is not cruelty — it\'s the truth that forces us to choose. Discernment here is asking: am I avoiding this conversation because I love this person, or because I love my own comfort?',
    prayer: 'Father, give me the courage to speak truth and the wisdom to know when silence serves love and when it only serves me. Make me a peacemaker, not merely a peace-keeper. Amen.',
    ...randVotes(48),
  },
  {
    date: addDays(today, 2),
    question: 'When someone says "just trust God" about a decision — is that faith or passivity?',
    side_a_label: 'It\'s genuine faith',
    side_a_argument: '"Trust in the Lord with all your heart and do not lean on your own understanding" (Prov 3:5) — Scripture explicitly warns against over-relying on our own analysis. Sometimes "trust God" is the most accurate theological response to a situation where human wisdom has reached its limits. God does work in ways that defy our calculations.',
    side_b_label: 'It\'s often spiritual passivity',
    side_b_argument: 'The same God who says "trust Me" gave us minds, advisors, Scripture, and circumstances as tools for discernment. "Trust God" can be a pious way of avoiding hard thinking, uncomfortable conversations, or taking responsibility for a choice. The parable of the talents warns against burying our gifts in the ground for fear of getting it wrong.',
    scripture_reference: 'Proverbs 3:5–6 & Matthew 25:14–30',
    scripture_text: '"Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths." — Proverbs 3:5–6',
    scripture_lens: 'Proverbs 3:5 does not say "stop thinking" — it says stop trusting your thinking as the final authority. The path runs through both: acknowledging God in the process while also engaging every tool He\'s given you. The parable of the talents suggests that God expects us to invest our judgment, not bury it. True trust looks like informed, prayerful action — not pious inaction dressed up as faith.',
    prayer: 'Lord, I want to trust You with my whole heart — but I also want to steward the mind You gave me. Teach me the difference between surrender and abdication. Let my trust be active, not passive. Amen.',
    ...randVotes(42),
  },
  {
    date: addDays(today, 3),
    question: 'Is your desire for a "sign from God" genuine seeking — or unwillingness to decide?',
    side_a_label: 'Genuine spiritual seeking',
    side_a_argument: 'Gideon asked for a sign and God gave one — twice (Judg 6:36–40). The Israelites watched for the pillar of cloud and fire. Asking for confirmation before a major decision is not a lack of faith; it is a recognition that God is personal and communicative and that we can humbly ask for clarity.',
    side_b_label: 'Avoiding responsibility',
    side_b_argument: 'Jesus rebuked the Pharisees who demanded signs (Matt 12:39), and Paul writes that "we walk by faith, not by sight" (2 Cor 5:7). Often the desire for a sign is a desire for certainty in a world where God has purposely called us to trust. We keep asking for signs because we already know the answer and don\'t want to be accountable for it.',
    scripture_reference: 'Judges 6:36–40 & Matthew 12:38–39',
    scripture_text: '"An evil and adulterous generation seeks for a sign, but no sign will be given to it except the sign of the prophet Jonah." — Matthew 12:39',
    scripture_lens: 'God does give signs — but He also rebukes sign-seeking. The difference may be in the posture: Gideon came with humility and acknowledged God\'s prior word; the Pharisees came demanding proof to avoid belief. Asking for confirmation after genuine prayer and discernment may honor God. Asking for signs as a substitute for obedience or a way to delay may be something else entirely. The honest question is: what would I do if no sign came?',
    prayer: 'God, I confess I sometimes want a sign so I don\'t have to own my decision. Give me discernment to know when I\'m genuinely seeking You and when I\'m hiding behind seeking. Help me trust Your prior word. Amen.',
    ...randVotes(38),
  },
  {
    date: addDays(today, 4),
    question: 'Should you forgive someone who hasn\'t asked for forgiveness?',
    side_a_label: 'Yes — forgiveness is for you',
    side_a_argument: 'Jesus forgave from the cross before anyone had repented: "Father, forgive them, for they know not what they do" (Luke 23:34). Forgiveness is not condoning the offense or reconciling the relationship — it is releasing the debt in your own heart. Holding unforgiveness is described as a spiritual prison that harms the one who holds it most.',
    side_b_label: 'Forgiveness requires repentance',
    side_b_argument: '"If your brother sins, rebuke him, and if he repents, forgive him" (Luke 17:3) — Jesus links forgiveness to repentance. Offering full forgiveness without repentance can minimize genuine harm, short-circuit the other person\'s growth, and allow patterns of abuse to continue. Biblical forgiveness includes truth, and truth says the wrong was real.',
    scripture_reference: 'Luke 23:34 & Luke 17:3–4',
    scripture_text: '"Pay attention to yourselves! If your brother sins, rebuke him, and if he repents, forgive him." — Luke 17:3',
    scripture_lens: 'Theologians distinguish between "forgiveness" (releasing the debt in your heart before God) and "reconciliation" (restoring the relationship — which requires repentance). Jesus on the cross demonstrates the first: a heart released from bitterness regardless of the other\'s response. Luke 17:3 addresses the second: relational restoration in community. Both are true, and the tension invites us to ask: what kind of forgiveness is God asking of me right now — the internal release, or the relational restoration?',
    prayer: 'Jesus, You forgave me before I fully understood what You were forgiving. Give me the grace to release this hurt internally — not to excuse the wrong, but to be free. Show me what reconciliation requires, and give me the courage to pursue it honestly. Amen.',
    ...randVotes(63),
  },
  {
    date: addDays(today, 5),
    question: 'Is ambition a gift from God — or a symptom of worldliness?',
    side_a_label: 'Ambition is God-given',
    side_a_argument: 'The parable of the talents (Matt 25) rewards the servants who multiplied what they were given — passivity is what gets rebuked. Nehemiah showed extraordinary ambition in rebuilding Jerusalem\'s walls; Paul wrote, "I press toward the goal for the prize of the upward call" (Phil 3:14). Holy ambition is what drives people to do great things for God\'s kingdom.',
    side_b_label: 'Ambition is worldly striving',
    side_b_argument: '"Selfish ambition" is listed alongside sexual immorality and idolatry in Paul\'s list of works of the flesh (Gal 5:20). The tower of Babel began with the ambition to "make a name for ourselves." Jesus said the greatest in the kingdom is the servant of all — a direct inversion of ambition\'s logic. When we pursue greatness, we often find we are pursuing our own glory.',
    scripture_reference: 'Philippians 3:14 & Galatians 5:19–20',
    scripture_text: '"I press on toward the goal for the prize of the upward call of God in Christ Jesus." — Philippians 3:14',
    scripture_lens: 'Paul uses the word "ambition" in both positive and negative senses. The Greek word for "selfish ambition" (eritheia) carries the idea of self-promotion for personal gain. The holy counterpart is zeal directed toward God\'s purposes rather than one\'s own recognition. The question ambition must answer is not "how far can I go?" but "for whose glory am I going there?" Both the drive and the direction matter.',
    prayer: 'Lord, I have ambitions — some holy, some not. Search them. Purify the ones worth keeping and loosen my grip on the ones that are really just about me. Let my striving be toward You, not above others. Amen.',
    ...randVotes(51),
  },
  {
    date: addDays(today, 6),
    question: 'When God closes a door, does He always open a window — or is that just something we tell ourselves?',
    side_a_label: 'God redirects purposefully',
    side_a_argument: 'Paul was "forbidden by the Holy Spirit to speak the word in Asia" (Acts 16:6) — and then had a vision of the Macedonian man, redirecting him to Europe. God\'s closed doors are often divine redirections toward something better. Joseph\'s path through the pit, the slave market, and prison looks like doors slamming — but each one was movement toward his purpose.',
    side_b_label: 'Sometimes doors just close',
    side_b_argument: 'The "closed door = open window" formula can become a way to avoid grief and the uncomfortable reality of a fallen world where things don\'t always work out as planned. Not every broken relationship is preparation for a better one. Not every failed business is redirection to a calling. Job\'s losses were not explained away — God honored his lament. Sometimes faithful people just lose, and making meaning too quickly dishonors the loss.',
    scripture_reference: 'Acts 16:6–10 & Job 3:1–3',
    scripture_text: '"And they went through the region of Phrygia and Galatia, having been forbidden by the Holy Spirit to speak the word in Asia." — Acts 16:6',
    scripture_lens: 'Scripture holds both narratives. Acts 16 shows a redirect with a reason; Job shows grief without an immediate explanation. The danger of the "open window" formula is that it can pressure people to find meaning prematurely, before they\'ve processed loss honestly. God can bring good from closed doors — but He doesn\'t always announce it immediately, and He doesn\'t require us to spin disappointment into testimony before we\'ve wept.',
    prayer: 'God, I believe You can redeem anything. But right now I\'m standing in front of a closed door and I don\'t see a window yet. Give me the faith to trust You in the dark without forcing a silver lining I can\'t honestly see. Amen.',
    ...randVotes(44),
  },
  {
    date: addDays(today, 7),
    question: 'Is it wise to "guard your heart" — or does that just mean avoiding vulnerability?',
    side_a_label: 'Guarding is wisdom',
    side_a_argument: '"Above all else, guard your heart, for everything you do flows from it" (Prov 4:23). The heart is the wellspring of our life — our desires, thoughts, and will. Not everything deserves access to it. Guarding means being intentional about what influences, relationships, and media we let shape us at the core level. This is spiritual discipline, not fear.',
    side_b_label: 'Guarding becomes hiding',
    side_b_argument: 'The command to guard your heart is often used to justify emotional unavailability, refusing to love again after hurt, or keeping people at arm\'s length indefinitely. Jesus did not guard His heart from disappointment — He wept, He was moved with compassion, He loved Lazarus knowing he would die. Vulnerability before the right people is not weakness; it\'s the cost of real love.',
    scripture_reference: 'Proverbs 4:23 & John 11:35–36',
    scripture_text: '"Keep your heart with all vigilance, for from it flow the springs of life." — Proverbs 4:23',
    scripture_lens: 'Proverbs 4:23 is addressing what we allow to shape us — not whether we allow people to know us. Guarding the heart is about protecting the core of who you are from corruption, not sealing it from relationship. Jesus guarded His identity and mission with fierce clarity — and yet He wept openly, touched lepers, ate with sinners, and loved disciples who would betray Him. The call is to be rooted deeply enough that you can risk openly.',
    prayer: 'Father, show me where I\'m guarding wisely and where I\'m just protecting myself from the risk of love. Give me the security in You that lets me be both rooted and open. Amen.',
    ...randVotes(53),
  },
  {
    date: addDays(today, 8),
    question: 'When you pray for something and don\'t receive it, was the answer "no" — or "not yet"?',
    side_a_label: 'It was a no',
    side_a_argument: 'Paul prayed three times for his "thorn in the flesh" to be removed — and God said no (2 Cor 12:8–9). The answer was clear, purposeful, and permanent. "Not yet" thinking can be a way of refusing to accept a divine no, leading us to keep petitioning for something God has already graciously declined. Sometimes accepting a no is the mature, faithful response.',
    side_b_label: 'It may be not yet',
    side_b_argument: 'Jesus tells the parable of the persistent widow specifically to teach that we "ought always to pray and not lose heart" (Luke 18:1). Abraham waited 25 years for Isaac. Hannah prayed for years before Samuel was born. The disciples waited in the upper room. God\'s timing is not our timing, and premature acceptance of a "no" can be a failure of perseverance.',
    scripture_reference: '2 Corinthians 12:8–9 & Luke 18:1–8',
    scripture_text: '"Three times I pleaded with the Lord about this, that it should leave me. But he said to me, \'My grace is sufficient for you, for my power is made perfect in weakness.\'" — 2 Corinthians 12:8–9',
    scripture_lens: 'Both realities exist in Scripture simultaneously. Paul received a clear no and was given grace to receive it. The persistent widow received a yes through perseverance. The difference may not be knowable from the outside — it lies in the quality of the prayer conversation with God over time. Discernment here is less about calculating odds and more about honestly asking: has God given me a word in this? Am I persisting from faith, or from an inability to accept His answer?',
    prayer: 'Lord, I have been asking and waiting. I don\'t know yet if this is Your no or Your not yet. Give me perseverance that is rooted in trust, not stubbornness — and the peace to receive whatever Your answer is. Amen.',
    ...randVotes(47),
  },
  {
    date: addDays(today, 9),
    question: 'Is it more faithful to stay in a difficult situation — or to recognize when God is calling you out of it?',
    side_a_label: 'Faithfulness means staying',
    side_a_argument: 'Scripture is full of people called to remain: Jeremiah preaching to an unresponsive nation, Paul staying in Corinth despite opposition (Acts 18:9–10), Ruth refusing to leave Naomi. "Let each person remain in the condition in which he was called" (1 Cor 7:20) — Paul\'s general principle is that God often works transformation through staying rather than leaving.',
    side_b_label: 'Sometimes God calls you out',
    side_b_argument: 'Abraham left Ur. Moses left the palace. Jesus himself said "shake the dust off your feet" when a place refused to receive the gospel. Not every difficult situation is a crucible for growth — some are simply wrong fits, spiritually dangerous environments, or situations where continued presence enables harm. Faithfulness to God can mean faithful departure.',
    scripture_reference: '1 Corinthians 7:20 & Acts 18:9–10',
    scripture_text: '"Each one should remain in the condition in which he was called." — 1 Corinthians 7:20',
    scripture_lens: 'Paul\'s principle in 1 Corinthians 7 is not a prohibition on ever leaving — he is addressing the anxiety to escape one\'s circumstances as a first solution. The same Paul left cities when his life was threatened and moved when the Spirit redirected him. The question is not "should I stay or go?" in the abstract, but "what is God calling me to in this particular situation?" Difficulty is not itself a sign to stay — nor is it a sign to leave. It is a prompt to listen harder.',
    prayer: 'God, I don\'t want to run from what You have for me here — but I also don\'t want to stay out of fear of change. Give me clarity. Let my staying or going be Your answer, not just my default. Amen.',
    ...randVotes(50),
  },
  {
    date: addDays(today, 10),
    question: 'Should you follow your heart — or is the heart "deceitful above all things"?',
    side_a_label: 'Follow the renewed heart',
    side_a_argument: 'God promises, "I will give them a heart to know that I am the Lord" (Jer 24:7) and "I will put my law within them and write it on their hearts" (Jer 31:33). The Spirit-renewed heart is not the same as the unregenerate heart Jeremiah warns about. Christians are people whose desires are being transformed — learning to want what God wants.',
    side_b_label: 'The heart deceives us',
    side_b_argument: '"The heart is deceitful above all things and desperately sick — who can understand it?" (Jer 17:9). Even Paul laments, "I do not do what I want, but I do the very thing I hate" (Rom 7:15). Our desires, even after conversion, remain mixed, influenced by wounds, ego, and culture. "Following your heart" without rigorous examination has led many sincere Christians into serious error.',
    scripture_reference: 'Jeremiah 17:9 & Jeremiah 31:33',
    scripture_text: '"The heart is deceitful above all things, and desperately sick; who can understand it?" — Jeremiah 17:9 | "I will put my law within them, and I will write it on their hearts." — Jeremiah 31:33',
    scripture_lens: 'These two verses come from the same prophet in the same book — and they\'re both true. Jeremiah 17 describes the unregenerate heart; Jeremiah 31 describes the new covenant promise. The Christian life is one of ongoing transformation between these two realities. The question "should I follow my heart?" depends entirely on which heart is speaking. Regular examination — through prayer, Scripture, community, and honest self-inquiry — helps discern the difference.',
    prayer: 'Lord, I want to follow You, and I want my heart to want You. Show me the places where my heart is still deceiving me, and strengthen the places where Your Spirit has been at work. Amen.',
    ...randVotes(34),
  },
  {
    date: addDays(today, 11),
    question: 'Is suffering always purposeful — or is it sometimes just broken-world pain?',
    side_a_label: 'All suffering has purpose',
    side_a_argument: 'Romans 8:28 promises that "all things work together for good for those who love God." Paul says suffering produces endurance, character, and hope (Rom 5:3–4). Joseph\'s suffering was profound and purposeful: "You meant it for evil, but God meant it for good" (Gen 50:20). Nothing is wasted in God\'s economy — even the deepest pain can become the ground of ministry.',
    side_b_label: 'Some suffering is just brokenness',
    side_b_argument: 'Jesus did not explain Lazarus\'s death before He raised him — He wept. The book of Lamentations exists. The Psalms are full of unanswered "why?" questions. Demanding purpose from every pain can be a form of spiritual bypassing that dishonors the genuine horror of loss, abuse, illness, and injustice. Not everything has a tidy theological explanation, and that\'s okay.',
    scripture_reference: 'Romans 8:28 & Lamentations 3:1–3',
    scripture_text: '"And we know that for those who love God all things work together for good, for those who are called according to his purpose." — Romans 8:28',
    scripture_lens: 'Romans 8:28 is a promise, not an explanation. It does not say we will see the purpose, understand the purpose, or be required to manufacture the purpose. It says God is working — even when we cannot see how. Lamentations and the Psalms give us permission to sit in the "why?" without forcing an answer. God can hold both realities: the active redemption of suffering and our honest inability to see it yet. Sometimes the most faithful response to pain is lament, not lesson.',
    prayer: 'God, I believe You are working in this. But I don\'t see how yet, and I don\'t want to pretend I do. Hold me in the tension between trust and grief. Let my lament be prayer. Amen.',
    ...randVotes(57),
  },
  {
    date: addDays(today, 12),
    question: 'When you feel called to something scary, is that God stretching you — or your ego pushing you?',
    side_a_label: 'It\'s God\'s call',
    side_a_argument: 'Every major call in Scripture came with fear: Moses said "I am slow of speech," Jeremiah said "I am only a youth," Gideon hid in a winepress. The pattern of God\'s calls includes the recipient\'s inadequacy as a feature, not a bug. Fear of a calling is not evidence against it — it is often the signature of a call that is truly bigger than you.',
    side_b_label: 'It might be ego',
    side_b_argument: 'The same fear-mixed-with-excitement that marks a genuine calling also marks ego-driven ambition. We can construct elaborate spiritual narratives around what is really just our desire for recognition, adventure, or significance. James warns that "where jealousy and selfish ambition exist, there will be disorder" (James 3:16). The ego is an excellent storyteller, and it has memorized the language of calling.',
    scripture_reference: 'Exodus 3:11–12 & James 3:14–16',
    scripture_text: '"But Moses said to God, \'Who am I that I should go to Pharaoh and bring the children of Israel out of Egypt?\' He said, \'But I will be with you.\'" — Exodus 3:11–12',
    scripture_lens: 'One test Scripture offers is the direction of the fruit: does this calling lead toward service and sacrifice, or toward platform and recognition? Moses\'s call required him to give up his wilderness life and confront his deepest fears — there was nothing glamorous about it. Ego-driven ambition tends to seek admiration; God-driven calling tends to demand cost. The question is not "am I afraid?" but "who benefits if this works out?"',
    prayer: 'Lord, I feel pulled toward something, and I don\'t know if it\'s You or me. Strip away the parts that are about my reputation. If this is Your call, make it clearer. If it\'s my ego, show me that too — gently, but clearly. Amen.',
    ...randVotes(46),
  },
  {
    date: addDays(today, 13),
    question: 'Is tithing during financial hardship obedience — or irresponsibility?',
    side_a_label: 'It\'s obedience and trust',
    side_a_argument: 'The widow of Zarephath gave Elijah her last meal (1 Kings 17:12–16) and experienced miraculous provision. Malachi 3:10 records God\'s explicit challenge: "Bring the full tithe... and see if I will not open the windows of heaven." Tithing during hardship is one of the rare places Scripture explicitly invites us to test God\'s faithfulness. Many Christians testify that giving during lean seasons has preceded breakthrough.',
    side_b_label: 'It may be irresponsible',
    side_b_argument: 'Paul writes that those who don\'t provide for their households "have denied the faith and are worse than an unbeliever" (1 Tim 5:8). Scripture also commands wise stewardship: Joseph stored grain for seven years before the famine. Giving 10% when you cannot pay rent, feed your children, or meet medical needs may not be faith — it may be placing spiritual obligation above basic human responsibility in a way the Bible does not actually require.',
    scripture_reference: 'Malachi 3:10 & 1 Timothy 5:8',
    scripture_text: '"Bring the full tithe into the storehouse... and thereby put me to the test, says the Lord of hosts, if I will not open the windows of heaven for you." — Malachi 3:10',
    scripture_lens: 'Malachi 3:10 is one of Scripture\'s most remarkable passages — God literally inviting a test. And yet 1 Timothy 5:8 makes household provision a matter of faithfulness, not a secondary concern. The tension may resolve differently at different levels of hardship: the discipline of giving during belt-tightening seasons may indeed exercise faith; giving when basic necessities for dependents are at risk raises legitimate stewardship questions. Neither legalism nor pragmatism alone serves us here — prayerful discernment about one\'s specific situation matters.',
    prayer: 'Lord, You own everything I have. Give me wisdom to be both generous and responsible, both trusting and realistic. Show me what faithfulness looks like in my specific situation right now. Amen.',
    ...randVotes(39),
  },
  {
    date: addDays(today, 14),
    question: 'Should Christians prioritize evangelism — or social justice?',
    side_a_label: 'Evangelism is primary',
    side_a_argument: 'Jesus\'s final command was the Great Commission: "Go and make disciples of all nations" (Matt 28:19). The eternal condition of the soul outweighs temporary material conditions. Paul\'s primary strategy everywhere he went was to preach the gospel — he preached in the synagogues and marketplaces before he organized relief efforts. Saving souls is the most radical social justice possible.',
    side_b_label: 'Justice is inseparable',
    side_b_argument: 'Isaiah 58 rebukes Israel for religious fasting while neglecting the hungry and oppressed. Micah 6:8 defines what God requires as "doing justice, loving kindness, and walking humbly with your God." James 2:14–17 asks what good faith is without deeds. Jesus inaugurated his ministry by quoting Isaiah 61: releasing captives, proclaiming good news to the poor. The gospel itself is social.',
    scripture_reference: 'Matthew 28:19–20 & Micah 6:8',
    scripture_text: '"He has told you, O man, what is good; and what does the Lord require of you but to do justice, and to love kindness, and to walk humbly with your God?" — Micah 6:8',
    scripture_lens: 'Most theologians who have sat with this tension conclude that the "either/or" framing is itself the problem. The whole gospel addresses the whole person. Jesus healed before He preached, fed before He taught, touched the unclean alongside forgiving sin. The danger on one side is a social gospel that forgets eternity; the danger on the other is a spiritual gospel that ignores the neighbor bleeding on the road. Both errors produce a truncated Christianity.',
    prayer: 'Lord, You came to seek and save the lost, and You also came to bring good news to the poor. Don\'t let me use one truth to avoid the other. Show me what faithful wholeness looks like in my community today. Amen.',
    ...randVotes(49),
  },
  {
    date: addDays(today, 15),
    question: 'Is doubt the enemy of faith — or the beginning of deeper faith?',
    side_a_label: 'Doubt undermines faith',
    side_a_argument: 'James warns that the doubter is "like a wave of the sea driven and tossed by the wind" and "must not expect to receive anything from the Lord" (James 1:6–7). Jesus rebuked Peter for his little faith as he sank (Matt 14:31). Doubt left to fester can become a self-fulfilling prophecy — gradually eroding the very ground on which we stand.',
    side_b_label: 'Doubt can deepen faith',
    side_b_argument: 'Thomas doubted and Jesus didn\'t reject him — He invited him to touch His wounds (John 20:27). The Psalms are saturated with doubt: "Has God forgotten to be gracious?" (Ps 77:9). Abraham doubted enough to try to fulfill the promise himself. Doubt that drives us toward God rather than away from Him is not the enemy of faith — it is one of faith\'s most serious forms.',
    scripture_reference: 'James 1:6–7 & John 20:27–28',
    scripture_text: '"Then he said to Thomas, \'Put your finger here, and see my hands... Do not disbelieve, but believe.\' Thomas answered him, \'My Lord and my God!\'" — John 20:27–28',
    scripture_lens: 'The distinction may be between doubt as paralysis and doubt as honest engagement. James addresses the person who prays while simultaneously disbelieving God is even listening — a posture of divided heart. Jesus addresses Thomas with an invitation to investigate, and Thomas\'s encounter with evidence produces one of Scripture\'s most profound confessions. The question is not whether we doubt, but what we do with our doubts: suppress them (dangerous), wallow in them (destructive), or bring them honestly to God (potentially transformative).',
    prayer: 'Lord, I have doubts I\'m afraid to say out loud. I don\'t want my questions to become distance. Meet me in them like You met Thomas — not with rebuke, but with Yourself. Amen.',
    ...randVotes(61),
  },
  {
    date: addDays(today, 16),
    question: 'When you feel angry at injustice, is that righteous anger — or personal offense?',
    side_a_label: 'It\'s righteous anger',
    side_a_argument: 'Jesus turned over tables in the temple (Matt 21:12–13) — not because He was personally slighted, but because the Father\'s house had become a marketplace that excluded the poor. God is described as angry at injustice throughout the Psalms and prophets. Anger in the presence of genuine wrong is a moral reflex — its absence would be the greater concern.',
    side_b_label: 'It\'s probably personal',
    side_b_argument: 'Jonah was furious at God\'s mercy toward Nineveh — and he described it as righteous indignation (Jon 4:1). We are remarkably skilled at clothing personal grievance in the language of justice. James says, "the anger of man does not produce the righteousness of God" (James 1:20). If we are honest, most of our anger involves our preferences, our comfort, or our identity — not a disinterested commitment to the good.',
    scripture_reference: 'Matthew 21:12–13 & James 1:20',
    scripture_text: '"Know this, my beloved brothers: let every person be quick to hear, slow to speak, slow to anger; for the anger of man does not produce the righteousness of God." — James 1:19–20',
    scripture_lens: 'Both realities are true, and they often coexist. Jesus\'s temple anger was directed outward toward an injustice affecting others; Jonah\'s anger was directed inward at an outcome that offended his sense of fairness. One test: does this anger move me to sacrifice for others, or does it move me to protect myself? Righteous anger tends to cost the angry person something; personal offense tends to seek vindication. Neither precludes the other — both can operate at once.',
    prayer: 'Father, I am angry. Help me examine this honestly — how much of this is about others and how much is about me? Sanctify what is right in this anger, and show me where I need to repent of what isn\'t. Amen.',
    ...randVotes(44),
  },
  {
    date: addDays(today, 17),
    question: 'Should you plan your future carefully — or hold it loosely because "man plans, God laughs"?',
    side_a_label: 'Plan with diligence',
    side_a_argument: 'Proverbs praises the ant who "prepares her food in summer" (Prov 6:8) and warns that lack of planning leads to poverty (Prov 21:5). Joseph\'s meticulous planning during the years of plenty saved Egypt. Luke 14:28 uses the image of a builder calculating costs before construction as a picture of wise discipleship. God consistently works through prepared, thoughtful people.',
    side_b_label: 'Hold plans loosely',
    side_b_argument: '"You do not know what tomorrow will bring" — James explicitly rebukes those who say "today or tomorrow we will go into such and such a town and trade and make a profit" without adding "if the Lord wills" (James 4:13–15). Paul\'s own plans were repeatedly interrupted by the Spirit. The plan you make with confidence may be the very thing God redirects to serve a greater purpose.',
    scripture_reference: 'Proverbs 21:5 & James 4:13–15',
    scripture_text: '"Come now, you who say, \'Today or tomorrow we will go into such and such a town and spend a year there...\' Yet you do not know what tomorrow will bring." — James 4:13–14',
    scripture_lens: 'These two texts together suggest a third way: plan with care and hold with open hands. The ant plans — but the ant doesn\'t control the harvest. Joseph stored grain — but it was Pharaoh\'s dream, not Joseph\'s initiative, that set it all in motion. James isn\'t forbidding planning; he\'s forbidding planning that forgets God\'s sovereignty over outcomes. Plan as if it matters; hold as if God holds more than you.',
    prayer: 'Lord, I want to be both wise and surrendered. Help me plan with diligence and release with trust. Let my plans be offered to You, not substituted for You. Amen.',
    ...randVotes(53),
  },
  {
    date: addDays(today, 18),
    question: 'Is saying "no" to a ministry opportunity selfish — or wise stewardship of your energy?',
    side_a_label: 'Saying no is selfish',
    side_a_argument: '"Each one should use whatever gift he has received to serve others" (1 Pet 4:10). The fields are ripe but the workers are few (Matt 9:37). If we wait for a perfect moment when our energy is abundant and our calendar is clear, the ministry moment will pass. Many of the most impactful people in God\'s kingdom said yes when they didn\'t feel ready.',
    side_b_label: 'No can be good stewardship',
    side_b_argument: 'Jesus himself withdrew from the crowds to pray (Luke 5:16) — He didn\'t say yes to every need. Elijah needed rest before the journey was too great for him (1 Kings 19:7). Jethro\'s advice to Moses was to stop doing everything himself before he burned out entirely (Exod 18:17–18). A depleted servant helps no one; boundaries serve the mission.',
    scripture_reference: '1 Peter 4:10 & Luke 5:16',
    scripture_text: '"But he would withdraw to desolate places and pray." — Luke 5:16',
    scripture_lens: 'Jesus\'s pattern is telling: He said yes to many things and no to others, and His yeses were defined by His sense of divine call rather than the loudness of the need. Every ministry opportunity is genuinely good; not every opportunity is yours to take. The question is not whether the need is real, but whether you are the right person for it in this season. Saying no to one thing is always saying yes to another — and what that other is matters.',
    prayer: 'Lord, I want to be generous with what You\'ve given me. Show me what You\'ve actually called me to in this season, and give me the courage to say no to good things so I can say yes to the right things. Amen.',
    ...randVotes(58),
  },
  {
    date: addDays(today, 19),
    question: 'When you outgrow a church community, should you stay and serve — or leave and grow?',
    side_a_label: 'Stay and invest',
    side_a_argument: 'Hebrews 10:25 commands us not to forsake gathering together — and the context is one of mutual encouragement and accountability, not individual spiritual optimization. We often leave when relationships get hard, worship styles feel stale, or we feel like the "mature" ones. Paul didn\'t plant churches by leaving them when they failed to meet his needs. Growth often happens through service, not through seeking greener pastures.',
    side_b_label: 'Leaving can be faithful',
    side_b_argument: 'Paul himself moved on from places when the Spirit redirected him. Luther\'s reform began with a decision that conformity to the institution was no longer possible. Not all growth can happen within every context — some churches are genuinely unhealthy, theologically drifting, or structured in ways that prevent discipleship. Staying out of institutional loyalty rather than spiritual calling can itself be a failure of discernment.',
    scripture_reference: 'Hebrews 10:24–25 & Acts 18:1–3',
    scripture_text: '"And let us consider how to stir up one another to love and good works, not neglecting to meet together, as is the habit of some, but encouraging one another." — Hebrews 10:24–25',
    scripture_lens: 'Hebrews 10:25 is a warning against neglecting community — not a command against ever changing communities. The question of staying or leaving a church should be tested by: Am I leaving to serve the kingdom elsewhere, or to serve my comfort? Am I staying because God has called me to this community, or because leaving is uncomfortable? Dissatisfaction is not itself a reason to leave; nor is loyalty itself a reason to stay. The discernment is about calling, not preference.',
    prayer: 'Lord, this community has shaped me and I don\'t want to leave lightly. Show me if You\'re calling me to stay and invest, or to go and grow somewhere new. Let my decision be about faithfulness, not convenience. Amen.',
    ...randVotes(46),
  },
  {
    date: addDays(today, 20),
    question: 'Is it more loving to speak a hard truth — or to let someone discover it in their own time?',
    side_a_label: 'Speak the truth in love',
    side_a_argument: 'Proverbs 27:6 says "faithful are the wounds of a friend." Paul instructs us to "speak truth in love" (Eph 4:15) — not truth without love, but not love without truth either. Withholding a hard truth from someone we love is sometimes more about our own comfort than their good. Nathan didn\'t wait for David to figure it out on his own.',
    side_b_label: 'Timing and readiness matter',
    side_b_argument: 'Jesus told His disciples, "I still have many things to say to you, but you cannot bear them now" (John 16:12). Truth spoken before someone is ready to receive it can harden rather than open, wound rather than heal. The Proverbs themselves warn about giving correction to a mocker (Prov 9:8). Waiting until the Spirit prepares the ground is not cowardice — it is sometimes wisdom.',
    scripture_reference: 'Ephesians 4:15 & John 16:12',
    scripture_text: '"Rather, speaking the truth in love, we are to grow up in every way into him who is the head, into Christ." — Ephesians 4:15',
    scripture_lens: 'The instruction is to speak truth in love — and love is the controlling principle. Love includes asking: is this the right time? Is this the right relationship from which to speak? Am I the right person to say it? A truth that is technically correct but delivered without relationship, readiness, or care may do more harm than good. And yet: love that protects the relationship by withholding truth it should speak isn\'t love — it\'s self-preservation. This is a question for prayer, relationship, and honest self-examination.',
    prayer: 'Lord, give me the courage to speak and the wisdom to know when. Let my words be as true as they are kind, and as kind as they are true. Don\'t let me confuse protecting myself with protecting someone else. Amen.',
    ...randVotes(55),
  },
  {
    date: addDays(today, 21),
    question: 'When you succeed, is that God\'s blessing — or just the result of privilege and effort?',
    side_a_label: 'It\'s God\'s blessing',
    side_a_argument: '"The blessing of the Lord makes rich, and he adds no sorrow with it" (Prov 10:22). Deuteronomy repeatedly connects obedience with blessing and fruitfulness. Joseph attributed his success entirely to God (Gen 45:8). Gratitude for success is not naive — it is theologically appropriate to recognize God as the source of every good gift, including the abilities, opportunities, and timing that made success possible.',
    side_b_label: 'It\'s largely circumstance and work',
    side_b_argument: 'Saying "God blessed me" with a business success or a promotion can unconsciously imply that those who didn\'t succeed weren\'t blessed — or worse, weren\'t faithful. Deuteronomy 8:17 explicitly warns against thinking "my power and the strength of my hand produced this wealth." Success is also shaped by the family we were born into, the education we received, the timing of markets, and a thousand unearned advantages. Honest stewardship requires acknowledging those.',
    scripture_reference: 'Proverbs 10:22 & Deuteronomy 8:17–18',
    scripture_text: '"Beware lest you say in your heart, \'My power and the might of my hand have gotten me this wealth.\' You shall remember the Lord your God, for it is he who gives you power to get wealth." — Deuteronomy 8:17–18',
    scripture_lens: 'Deuteronomy 8 holds both: it warns against claiming full credit AND it affirms that God is the ultimate source of the capacity to produce wealth. The error on one side is individualistic pride ("I earned this"); the error on the other is a prosperity theology that implies suffering people didn\'t have enough faith. The mature posture is gratitude for gifts neither earned nor deserved — without using that gratitude as a way to avoid examining what advantages shaped the outcome.',
    prayer: 'Lord, what I have is Yours, and I know I didn\'t earn it alone. Guard me from pride. Guard me also from denying Your hand in my life. Teach me to hold success with gratitude and humility together. Amen.',
    ...randVotes(43),
  },
  {
    date: addDays(today, 22),
    question: 'Should you "be anxious for nothing" — or is acknowledging anxiety more honest than suppressing it?',
    side_a_label: 'Anxiety is to be surrendered',
    side_a_argument: 'Philippians 4:6 is a command: "Do not be anxious about anything." Peter says to "cast all your anxieties on him, because he cares for you" (1 Pet 5:7). The Christian is not to carry what God has invited them to hand over. Anxiety, left unaddressed, can become a spiritual posture of distrust — as if prayer and God\'s sovereignty were insufficient.',
    side_b_label: 'Acknowledge what you actually feel',
    side_b_argument: 'Jesus was "deeply distressed and troubled" in Gethsemane and said "My soul is very sorrowful, even to death" (Mark 14:33–34). The Psalms are saturated with anxiety, fear, and lament — and they\'re Scripture. Naming our anxiety before God is not the opposite of faith; it is honest prayer. Suppressing what we actually feel in the name of "not being anxious" can prevent genuine encounter with God.',
    scripture_reference: 'Philippians 4:6–7 & Mark 14:33–36',
    scripture_text: '"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God." — Philippians 4:6',
    scripture_lens: 'Philippians 4:6 does not say "do not feel anxiety" — it says "do not be anxious about anything" and then tells us what to do instead: bring everything to God. The "do not be anxious" is resolved through prayer and supplication, not suppression. Jesus in Gethsemane models exactly this: He expressed His distress fully and honestly, then submitted to His Father\'s will. The problem Paul addresses is anxiety carried alone, in silence, without God — not the initial feeling of anxiety itself.',
    prayer: 'Father, I am anxious, and I don\'t want to pretend otherwise. I bring this to You now — not to perform peace I don\'t have, but to find the peace that comes when I stop carrying this alone. Amen.',
    ...randVotes(66),
  },
  {
    date: addDays(today, 23),
    question: 'Is contentment the goal — or does holy discontent drive us toward God\'s bigger plans?',
    side_a_label: 'Contentment is the goal',
    side_a_argument: 'Paul writes, "I have learned in whatever situation I am to be content" (Phil 4:11) — this is a trained spiritual discipline, not a passive resignation. The tenth commandment addresses coveting directly. Discontentment with what God has provided is a form of ingratitude. Contentment frees us from the endless striving that the world calls ambition and the Spirit calls restlessness.',
    side_b_label: 'Holy discontent propels growth',
    side_b_argument: 'Nehemiah was "very sad" (Neh 2:3) about Jerusalem\'s state — his discontent became the catalyst for one of Scripture\'s greatest rebuilding projects. The prophets were divinely discontent with Israel\'s idolatry. Paul himself was "hard pressed" between his desire to depart and live with Christ and his sense that he was needed here (Phil 1:23). Not all restlessness is worldliness — some of it is the Spirit\'s prompting.',
    scripture_reference: 'Philippians 4:11 & Nehemiah 2:3',
    scripture_text: '"Not that I am speaking of being in need, for I have learned in whatever situation I am to be content." — Philippians 4:11',
    scripture_lens: 'Paul learned contentment — and he also pressed toward the goal. He held both. The key distinction may be the object of the discontent: contentment with God\'s provision and timing; holy discontent with the gap between what is and what could be for His kingdom. The person who is content with injustice may simply be comfortable. The person who is never content with anything may be driven by ego. The Spirit-filled person can be deeply at peace and deeply stirred at the same time.',
    prayer: 'Lord, I want to be content without being complacent, and stirred without being anxious. Let my peace come from You, and let my movement also come from You. Teach me the difference. Amen.',
    ...randVotes(52),
  },
  {
    date: addDays(today, 24),
    question: 'When someone wrongs you repeatedly, is maintaining the relationship grace — or enabling?',
    side_a_label: 'It\'s grace and patience',
    side_a_argument: '"Love bears all things, believes all things, hopes all things, endures all things" (1 Cor 13:7). Jesus told Peter to forgive not seven times but seventy-seven times (Matt 18:22). The cross was God maintaining relationship with humanity despite endless repeated rebellion. Long-suffering in the face of repeated offense is one of the most Christlike things a person can do.',
    side_b_label: 'It can be enabling harm',
    side_b_argument: 'Matthew 18:15–17 provides a process for repeated sin that ends with treating someone as "a Gentile and a tax collector" — Jesus himself describes boundaries in relationships. Proverbs repeatedly warns about the fool who does not receive correction. Absorbing repeated harm without naming it can enable an abusive pattern, protect the other person from the natural consequences of their behavior, and destroy the relationship more slowly rather than saving it.',
    scripture_reference: 'Matthew 18:21–22 & Matthew 18:15–17',
    scripture_text: '"Then Peter came up and said to him, \'Lord, how often will my brother sin against me, and I forgive him? As many as seven times?\' Jesus said to him, \'I do not say to you seven times, but seventy-seven times.\'" — Matthew 18:21–22',
    scripture_lens: 'Both passages come from the same chapter — in the same conversation. Jesus\'s "seventy-seven times" is not a theological formula for unlimited tolerance of ongoing harm; it is a statement about the posture of the heart. The same chapter provides a process for addressing repeated sin, with escalating accountability. Grace is not the absence of truth. Forgiveness does not require the continuation of a harmful relationship pattern. The two can coexist: forgiveness in the heart, and honesty about what the relationship requires.',
    prayer: 'Lord, I want to be long-suffering like You. But I also want to be honest about what I\'m enabling. Show me the difference between grace that hopes and enables more harm. Give me the wisdom and courage to love well. Amen.',
    ...randVotes(57),
  },
  {
    date: addDays(today, 25),
    question: 'Is seeking therapy a sign of weak faith — or wisdom in stewarding your mental health?',
    side_a_label: 'Faith should be sufficient',
    side_a_argument: '"Cast all your anxiety on him because he cares for you" (1 Pet 5:7). Paul writes, "I can do all things through him who strengthens me" (Phil 4:13). God is described as the "God of all comfort" (2 Cor 1:3). There is a concern that therapy can become a substitute for genuine spiritual transformation — addressing symptoms while missing the soul-level work that only God can do.',
    side_b_label: 'Therapy is good stewardship',
    side_b_argument: 'God healed people through physical means: He used mud and a pool for blindness, physicians were not condemned. Luke — the author of Acts — was a physician. "The Lord God took the man and put him in the garden of Eden to work it and keep it" (Gen 2:15) — we are stewards of all aspects of our created nature, including our minds. Mental illness is not a spiritual failing, and seeking skilled care for it is not a lack of faith.',
    scripture_reference: '2 Corinthians 1:3–4 & Colossians 4:14',
    scripture_text: '"Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, who comforts us in all our affliction." — 2 Corinthians 1:3–4',
    scripture_lens: 'The same God who is the source of all comfort works through human means of comfort: community, wisdom, physicians, and therapists. 2 Corinthians 1:3–4 describes comfort flowing through people to people — it doesn\'t restrict the channels. The question "is therapy lack of faith?" applies equally to taking antibiotics for an infection. Christians may have different convictions about specific therapeutic modalities, but stewardship of the mind God gave us — including seeking skilled help — is consistent with trust in the One who gave it.',
    prayer: 'Lord, You are the God of all comfort. I believe You work through many means. Show me what care and help looks like for me right now — and release me from shame about needing it. Amen.',
    ...randVotes(71),
  },
  {
    date: addDays(today, 26),
    question: 'Should you take the safe path that provides for your family — or the risky calling that excites your soul?',
    side_a_label: 'Take the safe path',
    side_a_argument: '"Whoever does not provide for his relatives, and especially for members of his household, has denied the faith" (1 Tim 5:8). The steady, faithful worker who provides stability and security for their family is doing something deeply important. Not every calling requires dramatic risk — most kingdom work happens in ordinary, sustainable faithfulness.',
    side_b_label: 'Risk the calling',
    side_b_argument: 'Peter stepped out of the boat (Matt 14:29). Paul "suffered the loss of all things" for the sake of Christ (Phil 3:8). Abraham left without knowing where he was going (Heb 11:8). God consistently calls people to risk more than their circumstances suggested was wise. The parable of the talents rebukes the servant who buried his gift out of fear — the same fear that calls itself "providing for my family."',
    scripture_reference: '1 Timothy 5:8 & Hebrews 11:8',
    scripture_text: '"By faith Abraham obeyed when he was called to go out to a place that he was to receive as an inheritance. And he went out, not knowing where he was going." — Hebrews 11:8',
    scripture_lens: 'Both obligations are real and both have a claim on the faithful Christian. The resolution isn\'t "which one wins?" but "what does obedience look like in my specific situation?" Many people use "family provision" as a legitimate-sounding way to avoid a risky calling. Others use "spiritual calling" as a way to pursue their own excitement at family expense. The question is not safe vs. risky — it is: what is God specifically asking of me, and have I honestly brought my fear to Him?',
    prayer: 'Lord, I want to be responsible and I want to be obedient. Show me if these are in conflict, or if I\'m creating the conflict by listening to my fear. Give me the faith to take the step You\'re actually asking for. Amen.',
    ...randVotes(48),
  },
  {
    date: addDays(today, 27),
    question: 'Is loneliness a season to endure — or a signal that something needs to change?',
    side_a_label: 'A season to endure',
    side_a_argument: 'Jesus himself cried from the cross, "My God, my God, why have you forsaken me?" (Matt 27:46) — even the Son of God experienced profound loneliness, and it served a redemptive purpose. Paul wrote Philippians from prison, without companions (Phil 2:20). Loneliness can be a crucible that deepens our intimacy with God and our capacity for compassion toward others who suffer.',
    side_b_label: 'A signal to respond',
    side_b_argument: '"It is not good for man to be alone" (Gen 2:18) — God himself said this. Loneliness is one of the most reliably harmful experiences in human health, linked to depression, physical illness, and shortened life. The early church was characterized by "breaking bread in their homes and eating together with glad and sincere hearts" (Acts 2:46). God designed us for community, and persistent loneliness may indicate barriers to connection that deserve honest attention.',
    scripture_reference: 'Genesis 2:18 & Acts 2:44–46',
    scripture_text: '"Then the Lord God said, \'It is not good that the man should be alone; I will make him a helper fit for him.\'" — Genesis 2:18',
    scripture_lens: 'Loneliness can be both a season and a signal — and discernment requires asking which it is. Is this the loneliness of a transition that will resolve as new roots form? Or is this a persistent isolation that reflects something structural — a pattern of relational avoidance, an unhealthy community, or an unwillingness to be known? God works in both: through the endurance of a hard season and through the courage to pursue change when the situation calls for it.',
    prayer: 'Father, You said it is not good for us to be alone. I bring this loneliness to You — not to suppress it but to understand it. Show me what You\'re growing in this season, and what You\'re calling me to change. Amen.',
    ...randVotes(62),
  },
  {
    date: addDays(today, 28),
    question: 'When two good options both seem right, does it matter which one you choose — or is either one God\'s will?',
    side_a_label: 'Only one is truly right',
    side_a_argument: 'God has a specific plan for each person (Jer 29:11; Ps 139:16). The casting of lots in Scripture reflects a belief that there is a "right" answer God knows even when we don\'t (Prov 16:33). Discernment assumes that God\'s will is specific and discoverable — otherwise the entire practice is meaningless. Making peace with "either is fine" can be a way of avoiding the harder work of listening.',
    side_b_label: 'Either can be God\'s will',
    side_b_argument: 'Paul writes, "All things are lawful for me, but not all things are helpful" (1 Cor 6:12) — suggesting many options exist within God\'s general will. The Reformers spoke of God\'s decreed will (what happens) and His desired will (what He calls us to) — and within the space of His desired will, there is often genuine freedom. God may be less interested in which city you live in than in how you love the people around you.',
    scripture_reference: 'Jeremiah 29:11 & 1 Corinthians 6:12',
    scripture_text: '"For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope." — Jeremiah 29:11',
    scripture_lens: 'Both positions have Scriptural support and serious theologians who hold them. The practical wisdom may be this: God can redeem either choice, so the anxiety about picking the "right" option may itself be a distraction from the more important question — which option will I pursue wholeheartedly, with the people and gifts God has given me? Jeremiah 29:11 promises a future and a hope — it doesn\'t promise a single path to get there.',
    prayer: 'Lord, I\'m weighing two good things and I don\'t want to miss You in either of them. Free me from the anxiety of "what if I choose wrong" and give me the wisdom to choose well and the faith to walk it out with You. Amen.',
    ...randVotes(45),
  },
  {
    date: addDays(today, 29),
    question: 'Is the "still small voice" you\'re hearing God — or your own desires echoing back at you?',
    side_a_label: 'It\'s God\'s voice',
    side_a_argument: 'Elijah heard God not in the wind or earthquake or fire, but in "a still, small voice" (1 Kings 19:12, KJV). Jesus says, "My sheep hear my voice, and I know them, and they follow me" (John 10:27). The Spirit prays within us with "groanings too deep for words" (Rom 8:26). God genuinely speaks, and the quiet inner sense of leading is one of the primary ways He does.',
    side_b_label: 'It may be your own desires',
    side_b_argument: 'Jeremiah 17:9 warns that the heart is deceitful. We have a remarkable ability to hear "divine confirmation" for the things we already want to do. Surveys of Christians who felt "called" to marriages, business ventures, and ministry roles that later failed show that the feeling of divine confirmation is not a reliable indicator on its own. The desire for God\'s voice can become the desire for permission.',
    scripture_reference: '1 Kings 19:12 & Jeremiah 23:16',
    scripture_text: '"Thus says the Lord of hosts: \'Do not listen to the words of the prophets who prophesy to you... They speak visions of their own minds, not from the mouth of the Lord.\'" — Jeremiah 23:16',
    scripture_lens: 'Scripture takes seriously both God\'s willingness to speak and humanity\'s capacity for self-deception. The tests that Scripture itself provides for distinguishing God\'s voice: Does it align with Scripture? Does it bear the fruit of the Spirit over time? Is it confirmed by wise counsel from trusted believers? Does it lead toward love, sacrifice, and holiness — or primarily toward my own comfort and validation? The still, small voice is real; so is the echo chamber of our own desires. Testing takes time and humility.',
    prayer: 'Lord, I want to hear You clearly. I know I\'m capable of hearing what I want to hear. Confirm what is really from You through Your Word, through trusted people, and through the fruit it produces over time. Give me patience to wait for that confirmation. Amen.',
    ...randVotes(54),
  },
];

// Slug matches migration 005 + web/lib/slug.ts: slugified question + ISO date
function scaleSlug(question: string, date: string): string {
  const base = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return `${base}-${date}`;
}

async function seed() {
  console.log(`Seeding ${scales.length} daily scales...`);

  // v2 lifecycle: past/today -> published, future -> scheduled (pinned to date).
  // Territory is left null here; run scripts/classify-territories.ts to tag on a
  // fresh re-seed (the live DB already has confirmed tags from migration 006).
  const todayIso = new Date().toISOString().split('T')[0];
  const nowIso = new Date().toISOString();
  const rows = scales.map((s) => {
    const { date, ...rest } = s;
    return {
      ...rest,
      published_date: date,
      status: date <= todayIso ? 'published' : 'scheduled',
      source: 'seeded',
      approved_at: nowIso,
      slug: scaleSlug(rest.question, date),
    };
  });
  const { error } = await supabase
    .from('daily_scales')
    .upsert(rows, { onConflict: 'published_date' });

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`✓ ${scales.length} daily scales seeded successfully.`);
  console.log('Run: cd web && npm run seed:scale');
}

seed();
