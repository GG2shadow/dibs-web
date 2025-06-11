import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, formData, listingId } = body;

  if (!userId || !formData) {
    return NextResponse.json(
      { error: 'Missing userId or formData' },
      { status: 400 },
    );
  }

  // Step 1: Fetch business ID
  const { data: businessData, error: businessError } = await supabase
    .from('business')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (businessError || !businessData) {
    return NextResponse.json(
      { error: 'User has no business profile' },
      { status: 404 },
    );
  }

  const businessId = businessData.id;

  // Shared data for insert or update
  const listingPayload = {
    title: formData.title,
    description: formData.description,
    price: parseFloat(formData.price),
    is_active: formData.is_active,
    slug: formData.slug,
  };

  if (!listingId) {
    // Step 2a: Create new listing
    const { data: newListing, error: insertError } = await supabase
      .from('listing')
      .insert([
        {
          ...listingPayload,
          business_id: businessId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to create listing: ${insertError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ listingId: newListing.id });
  } else {
    // Step 2b: Update existing listing
    const { error: updateError } = await supabase
      .from('listing')
      .update(listingPayload)
      .eq('id', listingId);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update listing: ${updateError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ listingId });
  }
}
