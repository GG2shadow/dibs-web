// app/api/listings/route.ts
import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const { data: businesses, error: businessError } = await supabase
    .from('business')
    .select('id')
    .eq('user_id', userId)
    .limit(1);

  if (businessError || !businesses?.length) {
    return NextResponse.json(
      { error: 'No business found for user' },
      { status: 404 },
    );
  }

  const businessId = businesses[0].id;

  const { data: listingsData, error: listingError } = await supabase
    .from('listing')
    .select(`*, listing_image ( id, image_url )`)
    .eq('business_id', businessId)
    .order('id', { ascending: false });

  if (listingError) {
    return NextResponse.json({ error: listingError.message }, { status: 500 });
  }

  return NextResponse.json({ listings: listingsData });
}
