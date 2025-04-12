import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xgidujoanslsfwwtqidj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaWR1am9hbnNsc2Z3d3RxaWRqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzc4NTM4MywiZXhwIjoyMDUzMzYxMzgzfQ.RN_VqNSkN3gHk4JngkIaClgn0tmM-aDCxGtWaELLXDM';

export const supabase = createClient(supabaseUrl, supabaseKey);
