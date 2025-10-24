import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvelcwhosgphompkeiho.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZWxjd2hvc2dwaG9tcGtlaWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjQzOTUsImV4cCI6MjA3NjkwMDM5NX0.5GQgEbj6r9jj-ITi9IkfRZkKZuNEMZ5kHqFl40Cw3i0';

export const supabase = createClient(supabaseUrl, supabaseKey);
