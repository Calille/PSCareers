// Shared CORS headers for Edge Functions invoked by Supabase database
// webhooks (which sometimes preflight) and any future browser callers.

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
