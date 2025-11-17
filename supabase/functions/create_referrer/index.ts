import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method === "POST") {
      const body = await req.json();
      const { name, email, company_name } = body;

      if (!name || !email || !company_name) {
        return new Response(
          JSON.stringify({
            error: "Missing required fields: name, email, company_name",
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // const supabaseUrl = Deno.env.get("SUPABASE_URL");
      // const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
      // When running in Docker the function container may not resolve
      // `127.0.0.1`/`localhost` back to the host. Use a fallback so local
      // dev can reach the Supabase API via host.docker.internal.
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://host.docker.internal:54321";
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase environment variables");
      }

      const response = await fetch(`${supabaseUrl}/rest/v1/referrers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "apikey": supabaseAnonKey,
        },
        body: JSON.stringify({
          name,
          email,
          company_name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: data.message || "Failed to create referrer",
            details: data,
          }),
          {
            status: response.status,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: data[0] || data,
        }),
        {
          status: 201,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
