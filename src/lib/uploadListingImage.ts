// lib/uploadListingImage.ts
import { v4 as uuidv4 } from 'uuid';

import { supabase } from './supabaseClient';

export async function uploadListingImage(
  listingId: string,
  file: File,
): Promise<string> {
  const filePath = `listing-images/${listingId}/${uuidv4()}-${file.name}`;
  const { error } = await supabase.storage
    .from('listing-images')
    .upload(filePath, file);

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from('listing-images')
    .getPublicUrl(filePath);
  return data.publicUrl;
}
