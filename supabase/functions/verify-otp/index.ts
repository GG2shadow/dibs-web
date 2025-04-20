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
    const { phone_number, otp_code } = await req.json();

    // Validate input
    if (!phone_number) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }
    if (!otp_code) {
      return new Response(JSON.stringify({ error: 'OTP code is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Retrieve the customer using the phone column from the "customer" table
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

    const customer_id = customer.id;

    // Retrieve the OTP record for this customer from the "customer_otp" table
    const { data: otpRecord, error: otpError } = await supabase
      .from('customer_otp')
      .select('*')
      .eq('customer_id', customer_id)
      .maybeSingle();

    if (otpError) {
      return new Response(JSON.stringify({ error: otpError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!otpRecord) {
      return new Response(JSON.stringify({ error: 'OTP record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if the OTP has expired
    const now = new Date();
    const expiredAt = new Date(otpRecord.expired_at);
    if (now > expiredAt) {
      return new Response(JSON.stringify({ error: 'OTP code is expired' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify that the provided OTP matches the stored otp_code
    if (otpRecord.otp_code !== otp_code) {
      return new Response(JSON.stringify({ error: 'Invalid OTP code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // OTP is valid so delete the record from "customer_otp"
    const { error: deleteError } = await supabase
      .from('customer_otp')
      .delete()
      .eq('customer_id', customer_id);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return a success message
    return new Response(
      JSON.stringify({ message: 'OTP verified successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/verify-otp' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
