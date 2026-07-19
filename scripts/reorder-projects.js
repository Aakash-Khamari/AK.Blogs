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
  // 1. Add AakashKhamari.com
  const akProject = {
    title: "AakashKhamari.com - A Digital Magazine",
    slug: "aakashkhamari-com",
    tech: "Next.js 16, Supabase, Tailwind",
    problem: "A traditional portfolio or blog didn't fit the vision of an 'intellectual operating system.' I needed a space that felt like a curated digital magazine to house observations, projects, and reflections.",
    why_built: "To preserve ideas beyond the short lifespan of social media while encouraging thoughtful discussion, and to serve as the definitive home for my ideas.",
    process: "Architected a custom full-stack platform using Next.js 16 App Router and Supabase. Implemented a unique content structure separating internal writing (Observations) from external curations (Reading Room). Designed a custom CMS.",
    lessons: "Content architecture is just as important as the UI. Treating a personal website as a dynamic product rather than a static resume fundamentally changes how you write and build for it.",
    outcome: "Launched a fully custom, highly performant digital destination with bespoke typography, smooth theme switching, and a rich reading experience."
  };

  await supabase.from('projects').delete().eq('slug', akProject.slug);
  await supabase.from('projects').insert([akProject]);

  // 2. Define the desired order (top to bottom)
  const orderedSlugs = [
    "settle-x",                     // 1st (Best)
    "bazaar-odisha",                // 2nd (Best)
    "aakashkhamari-com",            // 3rd
    "royal-unique",                 // 4th
    "i-said-yes-before-i-knew-how", // 5th
    "nexus",                        // 6th (End)
    "heritage-yatri"                // 7th (End)
  ];

  // 3. Update created_at so they sort descending correctly
  // The first item should have the newest date, the last should have the oldest date.
  const baseTime = Date.now();
  
  for (let i = 0; i < orderedSlugs.length; i++) {
    const slug = orderedSlugs[i];
    // Subtract i days from the base time
    const newDate = new Date(baseTime - (i * 24 * 60 * 60 * 1000)).toISOString();
    
    const { data, error } = await supabase
      .from('projects')
      .update({ created_at: newDate })
      .eq('slug', slug);
      
    if (error) {
      console.error(`Error updating ${slug}:`, error);
    } else {
      console.log(`Updated ${slug} with date ${newDate}`);
    }
  }
}

main();
