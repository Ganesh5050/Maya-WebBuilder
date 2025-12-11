// Simple test to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://simngjnepjayqkwmkau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbW5nanluZXBqYXlxa3dta2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MTkyOTcsImV4cCI6MjA3OTk5NTI5N30.2aY4lq6Y3ijUx0GUpvaqSFB6l2UJXpOPGzd5_UU8U_Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing NEW Supabase connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    // Test auth endpoints
    console.log('\n1. Testing auth endpoint...');
    const { data, error } = await supabase.auth.getSession();
    console.log('Auth test result:', { data, error });
    
    if (!error) {
      console.log('✅ Supabase connection successful!');
    } else {
      console.log('❌ Supabase connection failed:', error);
    }
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testConnection();
