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

// Helper function to generate a 6-digit OTP code
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
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

    // Twilio credentials from environment variables
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")!
    const TWILIO_API_KEY_SID = Deno.env.get("TWILIO_API_KEY_SID")!
    const TWILIO_API_KEY_SECRET = Deno.env.get("TWILIO_API_KEY_SECRET")!
    const TWILIO_PHONE_NUMBER = "+15419379750"

    // Parse request body
    const { phone_number } = await req.json()

    // Validate input
    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: "Phone number is required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Retrieve the customer using the phone column from the "customer" table
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

    const customer_id = customer.id
    const now = new Date()
    const created_at = now.toISOString()
    const expired_at = new Date(now.getTime() + 5 * 60 * 1000).toISOString() // 5 minutes from now
    const otp_code = generateOTP()

    // Check for an existing OTP record for this customer
    const { data: existingOTP, error: fetchOtpError } = await supabase
      .from("customer_otp")
      .select("*")
      .eq("customer_id", customer_id)
      .maybeSingle()

    if (fetchOtpError) {
      return new Response(JSON.stringify({ error: fetchOtpError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (existingOTP) {
      // Calculate time difference in seconds between now and the existing record's created_at
      const previousCreatedAt = new Date(existingOTP.created_at)
      const diffSeconds = (now.getTime() - previousCreatedAt.getTime()) / 1000

      // If less than 30 seconds have passed, return an error
      if (diffSeconds < 30) {
        return new Response(
          JSON.stringify({ error: "Please wait before resending OTP." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        )
      }

      // Otherwise, update the existing record with new otp_code, created_at, and expired_at
      const { error: updateError } = await supabase
        .from("customer_otp")
        .update({
          otp_code,
          created_at,
          expired_at,
        })
        .eq("customer_id", customer_id)

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    } else {
      // Insert a new record in "customer_otp"
      const { error: insertError } = await supabase
        .from("customer_otp")
        .insert({
          customer_id,
          otp_code,
          created_at,
          expired_at,
        })

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    }

    // Send the OTP via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    const params = new URLSearchParams()
    params.append("From", TWILIO_PHONE_NUMBER)
    params.append("To", "+" + phone_number)
    params.append("Body", `Your Dibs OTP code is ${otp_code}`)

    // Basic Authentication header for Twilio API
    const auth = btoa(`${TWILIO_API_KEY_SID}:${TWILIO_API_KEY_SECRET}`)

    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text()
      return new Response(
        JSON.stringify({ error: `Failed to send OTP: ${errorText}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    return new Response(JSON.stringify({ message: "OTP sent successfully" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
