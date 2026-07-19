const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const posts = [
    {
      title: "Knock—I Knock on My Soul's Door",
      slug: "knock-i-knock-on-my-souls-door",
      category: "Poetry",
      content: `The quiet of the night sells the solace I seek.
Hidden in its cold embrace lies the warmth I yearn.
In a land of friends, I stand estranged,
Longing for bonds, seeming strong yet fragile as twine.

A smile that brightens the day cries in the solace of night.
A praised back bears the weight; while a scarred chest weathers the storm.
Legs that lead on through pathless roads,
beg tired feet to drag on.

Hope and ambitions—dreams of the past,
Responsibility and duty shackle my eyes.
The colourful soul now burns grey,
Hidden deep within burdened lids.

Knock—I knock on my soul's door,
seeking answers, yet fearing none.
The bed calls, but sleep has fled these eyes.
Music weaves a mask, a fleeting disguise.

**Author's Note:**
This poem explores the distance between the person the world sees and the person who remains awake after the applause has ended. It is about ambition, responsibility, exhaustion, and the quiet search for oneself beneath them all.`,
      cover_image_url: "/images/poem_cover.jpg",
      type: "notebook",
      published: true
    },
    {
      title: "My Handwriting Almost Broke a System Architecture Lesson",
      slug: "my-handwriting-almost-broke-system-architecture",
      category: "Technology",
      content_story: `A friend asked me, over chai, how Zomato actually works behind the scenes — not the app he opens every evening, but the machinery underneath it. It's the kind of question that sounds simple until you try to answer it properly.

I grabbed a piece of paper and started drawing. The API Gateway routing every request. The order service talking to the restaurant service. The backend acting as a kind of traffic conductor between customer, restaurant, and delivery partner, none of whom ever see each other's systems directly. I sketched all of it — the logic was sound, I was sure of that. But somewhere between the boxes and arrows, my handwriting collapsed into something closer to a seismograph reading than a diagram.

My friend squinted at it, then at me, then back at the page. The explanation in my head was clean. The explanation on the page looked like a crime scene.

So I did what felt like cheating: I photographed the mess and fed it into a generative AI tool, half expecting it to ask me to start over. Instead, within seconds, it handed back a clean, production-style architecture diagram — properly labeled boxes, sensible arrows, the API Gateway sitting exactly where it should. It hadn't just cleaned up my drawing. It had understood what my drawing was trying to say, and said it better than I had.

What struck me wasn't the speed. It was that nothing about the underlying idea had changed. The AI didn't correct my understanding of how Zomato's systems talk to each other — that part was already right. It removed the layer of friction between having the idea and being able to hand it to someone else.`,
      content_reflection: `I keep coming back to one distinction: AI didn't replace my understanding. It replaced the part of the job that had nothing to do with understanding — the translation from "clear in my head" to "clear on paper."

That's a smaller claim than "AI can teach," but it's also a stranger one, because it means the bottleneck in a lot of learning and explaining was never really comprehension. It was communication. And communication, it turns out, is far more automatable than we've been telling ourselves.`,
      content_picture: `Two days before this happened, I was volunteering at a GFTN Cohort 2 session, watching a practice group discussion Akanksha Tripathi ma'am had set up around a deliberately polarizing prompt: "Can AI replace teachers?"

The room reached consensus almost instantly — a comfortable "no," built on the usual arguments about human warmth, empathy, and the irreplaceable texture of a real classroom. One student held out. She said yes, and held her ground against the entire room.

Watching my own messy diagram get turned into something teachable in seconds, I found myself agreeing with her more than I expected to. Not because empathy doesn't matter — it does, and no model has it. But because a large share of what we call "teaching" isn't empathy at all. It's information delivery: taking something correct but poorly formed and making it legible. That part is already being automated, quietly, in tools like the one that fixed my diagram.

The honest answer to "can AI replace teachers" isn't a clean yes or no. It's: not the whole job, but more of it than the room was comfortable admitting. The mechanical heavy lifting of explaining things clearly is shifting to machines whether we've agreed to it or not. What's left for the humans in the room is the part no diagram can fix — judgment, encouragement, knowing which student needs a harder question and which one needs a gentler one.

It takes a specific kind of nerve to say "yes" when an entire room has already settled on "no." I think she was right to.`,
      content_questions: [
        "Is teaching mostly information delivery, or mostly something else — and how much of 'something else' is actually left?",
        "If AI can clean up your explanation instantly, does that change what's worth learning to do by hand?",
        "Where is the line between AI removing friction and AI removing understanding?",
        "Would you have taken the 'yes' side in that room, or the 'no' side?"
      ],
      content_behind: `Written the same day the Zomato sketch happened — the GD memory from GFTN Cohort 2 came back almost involuntarily once I saw what the AI diagram looked like next to my own.`,
      cover_image_url: "/images/tech_explainer_cover.jpg",
      type: "observation",
      published: true
    },
    {
      title: "I Said Yes Before I Knew How I Would Build It",
      slug: "i-said-yes-before-i-knew-how",
      category: "Entrepreneurship",
      content_story: `I said yes to building a full-scale commercial digital platform before I understood how I was going to pull it off.

The client's pitch sounded reasonable in the room. I nodded along, confident, the way you do when a problem is still an abstraction. It was only later that evening, sketching out the actual requirements — the backend architecture, the database structure, the UI demands stacked on top of each other — that the shape of what I'd agreed to came into focus. This wasn't a website. It was a system, with all the coordination and failure points a real system carries.

Backing out crossed my mind. I didn't take it seriously, for two reasons. The first was practical: I wanted to build my own financial independence from something I'd actually made, not inherited. The second was more personal, and honestly the heavier of the two — I was tired of introducing myself as "a student" and nothing else. I wanted a title earned through something built and shipped, not assigned.

So I put my head down. Weeks went into researching architectures that would actually hold up under real usage, writing code that I'd rewrite twice more before it was right, and slowly admitting to myself that the scope was bigger than one person's evenings. Delivering this at the level the client deserved meant I couldn't do it alone — a realization that felt like a small defeat before it became the actual turning point.

I brought in two developers whose judgment I trusted more than my own optimism. What had been a solo scramble became a team making real engineering trade-offs together — which parts of the architecture to build custom, which to lean on existing tooling for, where to accept technical debt now in exchange for shipping on time, and where that debt would cost us later if we didn't pay it down immediately. We got some of those calls wrong. Parts of the build were rebuilt more than once because the first version solved the problem we thought we had, not the one that showed up in practice.

We delivered it. Not on the timeline I'd have chosen, and not without scar tissue, but it worked, and the client's platform was real. Somewhere in the process of getting there, "the project" quietly became "the practice" — and the practice became Stillform Labs: a digital agency built for high-performance, scalable ecosystems across web, mobile, and internal tooling.

We're not just announcing the name. Right now, the team is on the final stretch of our latest build — a fully custom e-commerce platform for a growing retail client — stress-testing the architecture and polishing the UI before handover.`,
      content_reflection: `Saying yes was the easy part. It always is — confidence is cheap in the moment before you've mapped the actual work. What I underestimated wasn't the technical difficulty, which I'd braced for. It was how much the project would ask of me as a person, not just as a developer: the willingness to admit I needed a team before my ego wanted to, the discipline to rebuild something I was proud of because it was quietly wrong, the patience to let "I want independence" turn into "I'm responsible for other people's work now too."

Confidence starts the journey. It doesn't finish it. Execution is what reveals who you actually have to become to keep the promise you made before you understood its size.`,
      content_picture: `There's a pattern in early-stage building that doesn't get talked about enough: the gap between agreeing to a scope and understanding it is where most projects quietly die, either because the founder backs out once the real size becomes visible, or because they push forward without ever adjusting the plan to match the new information.

The projects that survive that gap tend to share one trait — the willingness to bring in help at the exact moment pride would rather not. Recognizing "I need a team" is often mistaken for a failure of self-sufficiency, when it's closer to the opposite: it's the first accurate read of the actual scope of the work.

Stillform Labs exists because that recognition happened early enough to matter, not because the original plan survived contact with reality unchanged.`,
      content_questions: [
        "Have you ever said yes to something before understanding its real scope — and how did that gap resolve?",
        "Is confidence at the start of a project a strength or a liability once the real complexity appears?",
        "At what point does 'I can do this alone' stop being self-reliance and start being a bottleneck?",
        "What's a project you'd handle differently today, knowing what you know now?"
      ],
      content_behind: `Written as Stillform Labs' first public account of how it started — while the latest client build is still in its final stress-testing phase. Supporting material (early architecture sketches, team decision points, before/after diagrams) can be added as inline images once available.`,
      cover_image_url: "/images/case_study_cover.jpg",
      type: "observation",
      published: true
    }
  ];

  for (const post of posts) {
    const { data, error } = await supabase.from('posts').insert([post]);
    if (error) {
      console.error("Error inserting post:", error);
    } else {
      console.log("Successfully inserted:", post.title);
    }
  }

  const { data: projData, error: projError } = await supabase.from('projects').insert([{
    title: "I Said Yes Before I Knew How I Would Build It",
    slug: "i-said-yes-before-i-knew-how",
    tech: "Entrepreneurship",
    problem: "I said yes to building a full-scale commercial digital platform before I understood how I was going to pull it off. The backend architecture, the database structure, the UI demands stacked on top of each other... This wasn't a website. It was a system.",
    why_built: "The first was practical: I wanted to build my own financial independence from something I'd actually made. The second was more personal—I was tired of introducing myself as 'a student'. I wanted a title earned through something built and shipped.",
    process: "What had been a solo scramble became a team making real engineering trade-offs together—which parts of the architecture to build custom, which to lean on existing tooling for. We got some of those calls wrong. Parts of the build were rebuilt more than once.",
    lessons: "Confidence starts the journey. It doesn't finish it. Recognizing 'I need a team' is often mistaken for a failure of self-sufficiency, when it's closer to the opposite: it's the first accurate read of the actual scope of the work.",
    outcome: "We delivered it. Somewhere in the process of getting there, 'the project' quietly became 'the practice'—and the practice became Stillform Labs: a digital agency built for high-performance, scalable ecosystems."
  }]);
  
  if (projError) {
     console.error("Error inserting project:", projError);
  } else {
     console.log("Successfully inserted project version");
  }
}

main();
