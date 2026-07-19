const { Client } = require('pg');

const client = new Client({ connectionString: 'postgresql://postgres:AakashKhamari@db.rlxaaegcljkixrxacmmx.supabase.co:5432/postgres' });

async function setup() {
  await client.connect();
  
  console.log('Running Phase 1 Database Setup...');

  try {
    // 1. Create themes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS themes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ themes table ready');

    // 2. Create post_themes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS post_themes (
        post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
        theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, theme_id)
      );
    `);
    console.log('✅ post_themes table ready');

    // 3. Create daily_notices table
    await client.query(`
      CREATE TABLE IF NOT EXISTS daily_notices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE UNIQUE NOT NULL,
        sentence TEXT NOT NULL,
        reflection TEXT,
        permalink TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ daily_notices table ready');

    // 4. Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        problem TEXT,
        why_built TEXT,
        process TEXT,
        lessons TEXT,
        tech TEXT,
        outcome TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('✅ projects table ready');

    // 5. Alter posts table
    await client.query(`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS notebook_type TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✅ posts table altered');

    // 6. Create reading_room table and add columns if it already exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS reading_room (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        author TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    await client.query(`
      ALTER TABLE reading_room ADD COLUMN IF NOT EXISTS rating INTEGER;
      ALTER TABLE reading_room ADD COLUMN IF NOT EXISTS why_it_mattered TEXT;
      ALTER TABLE reading_room ADD COLUMN IF NOT EXISTS favourite_quote TEXT;
    `);
    console.log('✅ reading_room table ready');

  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    await client.end();
  }
}

setup();
