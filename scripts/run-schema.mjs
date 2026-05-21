import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET);

// Test connection
const { data, error } = await supabase.from('products').select('id').limit(1);

if (error?.code === '42P01') {
  console.log('Tables not created yet — please run supabase-schema.sql in the Supabase SQL editor.');
} else if (error) {
  console.log('Connection error:', error.message);
} else {
  console.log('✓ Connected to Supabase! products table exists.');
}
