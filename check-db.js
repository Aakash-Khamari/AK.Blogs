const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:AakashKhamari@db.rlxaaegcljkixrxacmmx.supabase.co:5432/postgres' });
async function check() {
  await client.connect();
  const res = await client.query("SELECT cover_image_url, content_picture FROM posts WHERE title ILIKE '%ATM%'");
  console.log('COVER IMAGE:', res.rows[0].cover_image_url);
  console.log('BIGGER PICTURE:', JSON.stringify(res.rows[0].content_picture));
  await client.end();
}
check();
