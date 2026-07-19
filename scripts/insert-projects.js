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
  const projects = [
    {
      title: "Settle X",
      slug: "settle-x",
      tech: "Python, SQL, React, AI",
      problem: "NUS-AIDF Capstone with Razorpay. Top 10 Finalist Team. SMEs needed a way to decouple settlement from compliance and reduce cross-border transaction costs.",
      why_built: "Built for the NUS-AIDF Capstone project to explore RegTech solutions and 'Treasury-as-a-Service'.",
      process: "Leveraged AI-driven data modeling and prompt engineering to develop a 'Treasury-as-a-Service' RegTech engine. Built LRS Validator and TCS Auto-Calculator APIs to automate cross-border checks.",
      lessons: "Complex regulatory frameworks can be abstracted through intelligent APIs, allowing SMEs to focus on growth rather than compliance.",
      outcome: "Ranked 3rd in NUS-AIDF Capstone. Engineered to reduce transaction costs by 90% via wholesale arbitrage and compress settlement time from T+5 to T+1."
    },
    {
      title: "Bazaar Odisha",
      slug: "bazaar-odisha",
      tech: "HTML, Tailwind CSS, JavaScript, Firebase",
      problem: "Rural MSMEs and Self-Help Groups (SHGs) in Odisha lacked a digital presence due to low-bandwidth constraints and language barriers.",
      why_built: "Winner of Govt. of Odisha Innovation Competition. Secured INR 1 Lakh Funding to build a statewide e-commerce directory connecting MSMEs and SHGs.",
      process: "Designed a statewide e-commerce directory with a responsive UI using Tailwind CSS and Bootstrap. Implemented multilingual support (Odia/Hindi/English) and voice-based navigation (Odia-first AI assistant Mo Sahayak) to ensure accessibility for rural users.",
      lessons: "Designing for the next billion users requires prioritizing offline-ready structures, low-bandwidth optimization, and vernacular first approaches.",
      outcome: "Built an architecture scalable to 20L+ MSMEs. The feasibility pilot successfully mapped 68,451 units in the Balangir district."
    },
    {
      title: "Nexus",
      slug: "nexus",
      tech: "Kotlin, Firebase, Google Maps API",
      problem: "Manual entry errors and spoofing in attendance tracking needed to be eliminated using a reliable geolocation-based system. Selected for Smart India Hackathon 2024.",
      why_built: "To build a tamper-proof attendance solution for organizations that rely on remote or distributed workforces.",
      process: "Engineered a location-based attendance system using Google Maps API. Integrated geofencing, secure authentication, and anti-spoofing measures. Built admin dashboards for real-time monitoring and authenticated attendance capture.",
      lessons: "Relying on naive GPS polling is insufficient for high-security tracking; implementing anti-spoofing logic drastically improves data integrity.",
      outcome: "Achieved 95% geofence validation accuracy. Reduced location spoofing risks by 90% vs. naive GPS polling, validated through 200+ simulated attendance check-ins."
    },
    {
      title: "Royal Unique.in",
      slug: "royal-unique",
      tech: "React, Node.js, Tailwind, Razorpay API",
      problem: "A fashion retailer required a secure full-stack e-commerce platform with a high-conversion checkout flow.",
      why_built: "To modernize a retail client's digital storefront and handle real-time transactions securely.",
      process: "Engineered a full-stack platform. Gathered technical requirements from stakeholders. Integrated Razorpay payment gateways and AES-256 encryption for real-time transactions, alongside automated order management workflows.",
      lessons: "Streamlining the checkout process directly impacts conversion rates, and handling transaction state cleanly is critical for e-commerce reliability.",
      outcome: "Deployed a secure, high-conversion platform that fully automated the client's order management."
    },
    {
      title: "Heritage Yatri",
      slug: "heritage-yatri",
      tech: "HTML, CSS, JS, Tailwind CSS, Firebase",
      problem: "Tourists in low-network areas needed a comprehensive platform for booking, navigation, and local assistance.",
      why_built: "To promote lesser-known destinations and support local tourism businesses in Odisha.",
      process: "Built a tourism platform integrating hotel booking, transport services, and cuisine recommendations. Implemented a tourist spot explorer with historical details, accommodation finder, and AR-based navigation. Developed the AI-based travel assistant 'Yatri Buddy'.",
      lessons: "Offline-first accessibility and multilingual support are non-negotiable for regional tourism apps.",
      outcome: "Created a robust prototype with 100+ simulated journey flows, modeling offline-first capabilities for future state-level rollout."
    }
  ];

  for (const project of projects) {
    // Delete existing if any (by slug) to avoid unique constraint errors
    await supabase.from('projects').delete().eq('slug', project.slug);
    
    const { data, error } = await supabase.from('projects').insert([project]);
    if (error) {
      console.error("Error inserting project:", error);
    } else {
      console.log("Successfully inserted project:", project.title);
    }
  }
}

main();
