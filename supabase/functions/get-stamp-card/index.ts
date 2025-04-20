// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Parse query parameters from the URL
    const url = new URL(req.url);
    const customer_stamp_id = url.searchParams.get('customer_stamp_id');

    // Validate the query parameter
    if (!customer_stamp_id) {
      return new Response(
        JSON.stringify({ error: 'customer_stamp_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Check customer stamp
    const { data: stampData, error: stampError } = await supabase
      .from('customer_stamp')
      .select('id, total_stamps, customer (id), campaign (id, expiry_date)')
      .eq('id', customer_stamp_id)
      .maybeSingle();

    if (!stampData) {
      return new Response(
        JSON.stringify({ error: 'Customer stamp not found.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    if (stampError) {
      return new Response(JSON.stringify({ error: stampError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check redemption rule
    const { data: redemptionData, error: redemptionError } = await supabase
      .from('redemption_rule')
      .select(
        `
        id,
        total_stamps,
        reward_title,
        reward_desc,
        redemption: redemption!left(
          id,
          created_at,
          customer_stamp_id,
          redemption_rule_id
        )
      `,
      )
      .eq('campaign_id', stampData.campaign.id);

    if (redemptionError) throw redemptionError;

    // Check expiration
    const currentDate = new Date();
    const expiryDate = new Date(stampData.campaign.expiry_date);
    const isExpired = expiryDate < currentDate;

    return new Response(
      JSON.stringify({
        total_stamps: isExpired ? 0 : stampData.total_stamps,
        is_expired: isExpired,
        redemptions: redemptionData.map((rule) => ({
          id: rule.id,
          total_stamps: rule.total_stamps,
          reward_title: rule.reward_title,
          reward_desc: rule.reward_desc,
          is_redeemed: rule.redemption.some(
            (r) => r.customer_stamp_id === customer_stamp_id,
          ),
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-stamp-card' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
