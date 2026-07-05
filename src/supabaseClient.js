import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mdeqnimucizmeoqzzdas.supabase.co';
const supabaseKey = 'sb_publishable_fffbE4i_BORkBZISv6dI_A_6y6vwPVG';

export const supabase = createClient(supabaseUrl, supabaseKey);
