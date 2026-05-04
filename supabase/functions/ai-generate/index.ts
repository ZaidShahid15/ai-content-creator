// Edge function: AI generation (ideas + scripts) using user's OpenAI key
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Body = {
  type: "ideas" | "script";
  niche?: string;
  topic?: string;
  tone?: "educational" | "viral" | "storytelling";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: Body = await req.json();
    let systemPrompt = "";
    let userPrompt = "";
    let tools: any[] | undefined;
    let tool_choice: any | undefined;

    if (body.type === "ideas") {
      systemPrompt = "You are a viral YouTube growth strategist. Produce SEO-optimized, high-CTR ideas.";
      userPrompt = `Generate 6 viral YouTube video ideas for the niche: "${body.niche ?? "general"}". For each idea include a punchy SEO title, a 1-sentence hook, and 5 relevant hashtags.`;
      tools = [{
        type: "function",
        function: {
          name: "return_ideas",
          description: "Return structured viral ideas",
          parameters: {
            type: "object",
            properties: {
              ideas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    hook: { type: "string" },
                    hashtags: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "hook", "hashtags"],
                  additionalProperties: false,
                },
              },
            },
            required: ["ideas"],
            additionalProperties: false,
          },
        },
      }];
      tool_choice = { type: "function", function: { name: "return_ideas" } };
    } else if (body.type === "script") {
      const tone = body.tone ?? "viral";
      systemPrompt = `You are an expert YouTube scriptwriter. Tone: ${tone}. Write tight, retention-optimized scripts.`;
      userPrompt = `Write a YouTube script for the topic: "${body.topic ?? "untitled"}". Structure it clearly with three labeled sections: HOOK (first 10 seconds, attention-grabbing), BODY (main content, ~400-600 words, with mini-cliffhangers), and CTA (subscribe + next video). Use natural spoken language.`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: any = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };
    if (tools) { payload.tools = tools; payload.tool_choice = tool_choice; }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("OpenAI error", r.status, t);
      return new Response(JSON.stringify({ error: "OpenAI request failed", details: t }), {
        status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await r.json();

    if (body.type === "ideas") {
      const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
      const parsed = args ? JSON.parse(args) : { ideas: [] };
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const script = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ script }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
