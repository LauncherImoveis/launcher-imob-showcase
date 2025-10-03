import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VALIDATE-PROPERTY-LIMIT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("plan_type, credits")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;
    logStep("Profile loaded", { plan_type: profile.plan_type, credits: profile.credits });

    // Count active properties
    const { count: activeCount, error: countError } = await supabaseClient
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (countError) throw countError;
    logStep("Active properties counted", { count: activeCount });

    // Determine limit based on plan
    let limit = 2; // default free plan
    if (profile.plan_type === "pro") {
      limit = 15;
    } else if (profile.plan_type === "credits") {
      limit = profile.credits;
    }

    const canCreate = (activeCount || 0) < limit;
    const remaining = limit - (activeCount || 0);

    logStep("Limit check result", { canCreate, remaining, limit, activeCount });

    return new Response(JSON.stringify({
      canCreate,
      remaining,
      limit,
      currentCount: activeCount || 0,
      plan_type: profile.plan_type
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
