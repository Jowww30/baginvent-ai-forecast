import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting profile migration...");

    // External Supabase client (source)
    const externalUrl = Deno.env.get('EXTERNAL_SUPABASE_URL');
    const externalKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_ROLE_KEY');

    if (!externalUrl || !externalKey) {
      throw new Error("External Supabase credentials not configured");
    }

    const externalSupabase = createClient(externalUrl, externalKey);

    // Current Supabase client (destination)
    const currentUrl = Deno.env.get('SUPABASE_URL');
    const currentKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!currentUrl || !currentKey) {
      throw new Error("Current Supabase credentials not configured");
    }

    const currentSupabase = createClient(currentUrl, currentKey);

    // Fetch profiles from external project
    console.log("Fetching profiles from external project...");
    const { data: externalProfiles, error: fetchError } = await externalSupabase
      .from('profiles')
      .select('*');

    if (fetchError) {
      console.error("Error fetching external profiles:", fetchError);
      throw new Error(`Failed to fetch profiles: ${fetchError.message}`);
    }

    if (!externalProfiles || externalProfiles.length === 0) {
      console.log("No profiles found in external project");
      return new Response(
        JSON.stringify({ success: true, message: "No profiles to migrate", count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${externalProfiles.length} profiles to migrate`);

    // Insert profiles into current project
    const migratedProfiles = [];
    const errors = [];

    for (const profile of externalProfiles) {
      // Map fields - adjust based on your external schema
      const mappedProfile = {
        user_id: profile.user_id || profile.id,
        email: profile.email,
        // Add more field mappings as needed
      };

      const { data, error } = await currentSupabase
        .from('profiles')
        .upsert(mappedProfile, { onConflict: 'user_id' })
        .select();

      if (error) {
        console.error(`Error migrating profile ${profile.id}:`, error);
        errors.push({ profile_id: profile.id, error: error.message });
      } else {
        migratedProfiles.push(data);
      }
    }

    console.log(`Migration complete. Migrated: ${migratedProfiles.length}, Errors: ${errors.length}`);

    return new Response(
      JSON.stringify({
        success: true,
        migrated: migratedProfiles.length,
        errors: errors.length,
        errorDetails: errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Migration error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
