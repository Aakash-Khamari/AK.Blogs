const { Client } = require('pg');
const fs = require('fs');

const client = new Client({ connectionString: 'postgresql://postgres:AakashKhamari@db.rlxaaegcljkixrxacmmx.supabase.co:5432/postgres' });

async function migrate() {
  await client.connect();
  
  // 1. Backup all posts
  console.log('Fetching all posts for backup...');
  const res = await client.query('SELECT * FROM posts');
  fs.writeFileSync('posts_backup.json', JSON.stringify(res.rows, null, 2));
  console.log(`Backup saved to posts_backup.json (${res.rows.length} posts)`);
  
  // 2. Migrate types
  console.log('Migrating types...');
  await client.query("UPDATE posts SET type = 'observation' WHERE type = 'story'");
  await client.query("UPDATE posts SET type = 'notebook' WHERE type = 'idea'");
  
  console.log('Migration complete!');
  await client.end();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
