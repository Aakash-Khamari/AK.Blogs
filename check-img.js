const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:AakashKhamari@db.rlxaaegcljkixrxacmmx.supabase.co:5432/postgres' });
async function check() {
  await client.connect();
  const res = await client.query("SELECT title, cover_image_url FROM posts WHERE title ILIKE '%ATM%'");
  console.log(res.rows);
  await client.end();
}
check();
