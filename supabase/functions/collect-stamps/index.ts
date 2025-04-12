// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // Using service key to bypass RLS
    )

    // Parse request body
    const { transaction_id, phone_number } = await req.json()

    // Validate input
    if (!transaction_id || !phone_number) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Check if customer exist
    const { data: customer, error: customerError } = await supabase
      .from("customer")
      .select("id")
      .eq("phone", phone_number)
      .maybeSingle()

    if (customerError) {
      return new Response(JSON.stringify({ error: customerError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!customer) {
      return new Response(
        JSON.stringify({ error: "Phone number not found." }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Check if transaction exist
    const { data: transaction, error: transactionError } = await supabase
      .from("stamp_transaction")
      .select("id, campaign_id, stamp_amount, is_used")
      .eq("id", transaction_id)
      .maybeSingle()

    if (!transaction) {
      return new Response(JSON.stringify({ error: "Transaction not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    } else {
      if (!transaction.stamp_amount) {
        return new Response(
          JSON.stringify({ error: "Transaction is invalid." }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      } else if (transaction.is_used) {
        return new Response(
          JSON.stringify({ error: "Transaction is already used." }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }
    }

    if (transactionError) {
      return new Response(JSON.stringify({ error: transactionError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Check campaign stamp validity
    var currentStamp = null
    const { data: stampData, error: stampError } = await supabase
      .from("customer_stamp")
      .select("*, campaign (expiry_date)")
      .eq("campaign_id", transaction.campaign_id)
      .eq("customer_id", customer.id)
      .maybeSingle()

    if (stampError) {
      return new Response(JSON.stringify({ error: stampError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Insert new customer stamp record if doesn't exist yet.
    if (!stampData) {
      const { data: insertData, error: insertError } = await supabase
        .from("customer_stamp")
        .insert({
          customer_id: customer.id,
          campaign_id: campaign.id,
          total_stamps: 0,
        })
        .select("*, campaign (expiry_date)")

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      currentStamp = insertData[0]
    } else {
      currentStamp = stampData
    }

    // Check campaign expiry status
    const currentDate = new Date()
    const expiryDate = new Date(currentStamp.campaign.expiry_date)

    if (expiryDate < currentDate) {
      return new Response(
        JSON.stringify({
          error: "Campaign expired",
          is_expired: true,
          expiry_date: expiryDate.toISOString(),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Update only if not expired
    const { data: updateData, error: updateError } = await supabase
      .from("customer_stamp")
      .update({
        total_stamps: currentStamp.total_stamps + transaction.stamp_amount,
      })
      .eq("id", currentStamp.id)
      .select()
      .single()

    if (updateError) throw updateError

    // Update the transaction's is_used to true
    const { data: updateTransactionData, error: updateTransactionError } =
      await supabase
        .from("stamp_transaction")
        .update({ is_used: true })
        .eq("id", transaction_id)
        .select()
        .single()

    if (updateTransactionError) throw updateTransactionError

    return new Response(
      JSON.stringify({
        success: true,
        new_total_stamps: updateData.total_stamps,
        is_expired: false,
        expiry_date: expiryDate.toISOString(),
        message: `You have collected ${transaction.stamp_amount} new stamp(s). Your current total is now ${updateData.total_stamps} stamp(s).`,
        customer_stamp_id: updateData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/collect-stamps' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
