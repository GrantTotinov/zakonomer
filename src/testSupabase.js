import 'dotenv/config' // зарежда всички променливи от .env

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
)

async function testConnection() {
  const { data, error } = await supabase.from('test_table').select('*')
  console.log('data:', data)
  console.log('error:', error)
}

testConnection()
