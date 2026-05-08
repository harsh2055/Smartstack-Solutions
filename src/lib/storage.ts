import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export async function uploadFile(file: File, path: string) {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase.storage
    .from('crm-files')
    .upload(`${path}/${Date.now()}_${file.name}`, file);

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('crm-files')
    .getPublicUrl(data.path);

  return { url: publicUrl, name: file.name, size: file.size, type: file.type };
}
