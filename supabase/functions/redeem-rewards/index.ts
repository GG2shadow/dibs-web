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
    const { transaction_id, phone_number } = await req.json();

    // Validate input
    if (!transaction_id || !phone_number) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if customer exist
    const { data: customer, error: customerError } = await supabase
      .from('customer')
      .select('id')
      .eq('phone', phone_number)
      .maybeSingle();

    if (customerError) {
      return new Response(JSON.stringify({ error: customerError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!customer) {
      return new Response(
        JSON.stringify({ error: 'Phone number not found.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Check if transaction exist
    const { data: transaction, error: transactionError } = await supabase
      .from('stamp_transaction')
      .select('id, campaign_id, redemption_rule_id, is_used')
      .eq('id', transaction_id)
      .maybeSingle();

    if (!transaction) {
      return new Response(JSON.stringify({ error: 'Transaction not found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      if (!transaction.redemption_rule_id) {
        return new Response(
          JSON.stringify({ error: 'Transaction is invalid.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      } else if (transaction.is_used) {
        return new Response(
          JSON.stringify({ error: 'Transaction is already used.' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
    }

    if (transactionError) {
      return new Response(JSON.stringify({ error: transactionError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check campaign stamp validity
    const { data: stampData, error: stampError } = await supabase
      .from('customer_stamp')
      .select('id, total_stamps, campaign (id, expiry_date)')
      .eq('campaign_id', transaction.campaign_id)
      .eq('customer_id', customer.id)
      .maybeSingle();

    if (stampError || !stampData?.campaign) {
      return new Response(
        JSON.stringify({ error: 'Customer stamp not found.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // Check campaign expiry status
    const currentDate = new Date();
    const expiryDate = new Date(stampData.campaign.expiry_date);

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
    let redemptionRule = null;
    const { data: ruleData, error: ruleError } = await supabase
      .from('redemption_rule')
      .select('id, total_stamps, reward_title')
      .eq('campaign_id', stampData.campaign.id);

    if (!ruleData && ruleData.length == 0) {
      return new Response(
        JSON.stringify({ error: 'Redemption rule not found.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    } else {
      redemptionRule = ruleData.find(
        (e) => e.id === transaction.redemption_rule_id,
      );
      if (!redemptionRule) {
        return new Response(
          JSON.stringify({
            error: 'Redemption rule is not valid for this campaign.',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      } else if (redemptionRule.total_stamps > stampData.total_stamps) {
        return new Response(
          JSON.stringify({
            error: `You only have ${stampData.total_stamps} stamps, which is not enough to redeem "${redemptionRule.reward_title}". (${redemptionRule.total_stamps} stamps required)`,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
    }

    // Check if already redeemed
    const { data: existing, error: fetchError } = await supabase
      .from('redemption')
      .select('id')
      .eq('customer_stamp_id', stampData.id)
      .eq('redemption_rule_id', transaction.redemption_rule_id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'This reward has already been redeemed.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    // No matching row exists; proceed to insert a new one.
    const { data: inserted, error: insertError } = await supabase
      .from('redemption')
      .insert({
        customer_stamp_id: stampData.id,
        redemption_rule_id: transaction.redemption_rule_id,
      })
      .select('id, redemption_rule (reward_title, reward_desc)');

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update the transaction's is_used to true
    const { data: updateTransactionData, error: updateTransactionError } =
      await supabase
        .from('stamp_transaction')
        .update({ is_used: true })
        .eq('id', transaction_id)
        .select()
        .single();

    if (updateTransactionError) throw updateTransactionError;

    const insertedRecord = inserted[0];
    return new Response(
      JSON.stringify({
        success: true,
        message: `The reward "${redemptionRule.reward_title}" has been redeemed successfully.`,
        redemption_id: insertedRecord.id,
        reward_title: insertedRecord.redemption_rule.reward_title,
        reward_desc: insertedRecord.redemption_rule.reward_desc,
        customer_stamp_id: stampData.id,
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/redeem-rewards' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
