import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  identifier: string; // email or phone
  otp: string;
  type: "email" | "phone";
}

// Hash OTP using SHA-256
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { identifier, otp, type }: VerifyOTPRequest = await req.json();

    if (!identifier || !otp || !type) {
      throw new Error("Missing required fields");
    }

    if (!/^\d{6}$/.test(otp)) {
      throw new Error("Invalid OTP format");
    }

    console.log("Verifying OTP for:", identifier, "type:", type);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Hash the provided OTP
    const otpHash = await hashOTP(otp);
    const normalizedIdentifier = type === "email" ? identifier.toLowerCase() : identifier;

    // Find matching OTP
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("identifier", normalizedIdentifier)
      .eq("type", type)
      .eq("otp_hash", otpHash)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching OTP:", fetchError);
      throw new Error("Verification failed");
    }

    if (!otpRecord) {
      console.log("OTP not found or expired");
      throw new Error("Invalid or expired verification code");
    }

    // Mark OTP as verified
    await supabase
      .from("otp_codes")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    // Check if user exists, if not create them
    let userId: string;
    
    if (type === "email") {
      // Try to find existing user by email
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === normalizedIdentifier);
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: normalizedIdentifier,
          email_confirm: true,
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          throw new Error("Failed to create account");
        }
        userId = newUser.user.id;
      }
    } else {
      // Phone auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.phone === normalizedIdentifier);
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user with phone
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          phone: normalizedIdentifier,
          phone_confirm: true,
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          throw new Error("Failed to create account");
        }
        userId = newUser.user.id;
      }
    }

    // Generate a session token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: type === "email" ? normalizedIdentifier : `${normalizedIdentifier.replace(/\+/g, "")}@phone.local`,
    });

    if (sessionError) {
      console.error("Error generating session:", sessionError);
      // Fallback: just return success and let frontend handle session
    }

    // Clean up used OTP
    await supabase
      .from("otp_codes")
      .delete()
      .eq("id", otpRecord.id);

    console.log("OTP verified successfully for user:", userId);

    return new Response(JSON.stringify({ 
      success: true, 
      userId,
      // Return a magic link token if available
      token: sessionData?.properties?.hashed_token,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
