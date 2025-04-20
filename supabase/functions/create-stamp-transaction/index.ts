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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // Using service key to bypass RLS
    );

    // Parse request body
    const { campaign_id, redemption_rule_id, stamp_amount } = await req.json();

    // Validate input
    if (
      !campaign_id ||
      (!redemption_rule_id && !stamp_amount) ||
      (redemption_rule_id && stamp_amount)
    ) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check campaign expiration status first
    const { data: campaign, error: campaignError } = await supabase
      .from('campaign')
      .select('id, expiry_date')
      .eq('id', campaign_id)
      .maybeSingle();

    if (!campaign) {
      return new Response(JSON.stringify({ error: 'Campaign not found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (campaignError) {
      return new Response(JSON.stringify({ error: campaignError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currentDate = new Date();
    const expiryDate = new Date(campaign.expiry_date);

    if (expiryDate < currentDate) {
      return new Response(
        JSON.stringify({
          error: 'Campaign expired',
          is_expired: true,
          expiry_date: expiryDate.toISOString(),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Check redemption rule
    if (redemption_rule_id) {
      const { data: ruleData, error: ruleError } = await supabase
        .from('redemption_rule')
        .select('id, campaign_id')
        .eq('id', redemption_rule_id)
        .maybeSingle();

      if (!ruleData) {
        return new Response(
          JSON.stringify({ error: 'Redemption rule not found.' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      } else {
        if (ruleData.campaign_id !== campaign_id) {
          return new Response(
            JSON.stringify({
              error: 'Redemption rule is not valid for this campaign.',
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            },
          );
        }
      }
    }

    // Check stamp amount.
    if (stamp_amount) {
      if (stamp_amount <= 0) {
        return new Response(
          JSON.stringify({ error: 'The stamp amount is invalid.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
    }

    // Create new stamp transaction.
    const { data: inserted, error: insertError } = await supabase
      .from('stamp_transaction')
      .insert({ campaign_id, redemption_rule_id, stamp_amount })
      .select('id');

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const insertedRecord = inserted[0];
    return new Response(
      JSON.stringify({
        success: true,
        message: 'The transaction has been created successfully.',
        transaction_id: insertedRecord.id,
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-stamp-transaction' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
