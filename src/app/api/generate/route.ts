export async function POST(request: Request) {
  try {
    const { mood, genre } = await request.json();

    if (!mood || typeof mood !== "string" || mood.trim().length === 0) {
      return Response.json(
        { error: "Please describe your mood or vibe." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const genreInstruction =
      genre && genre !== "Any"
        ? `Focus on the ${genre} genre.`
        : "Mix genres as appropriate for the mood.";

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.9,
          max_tokens: 2048,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are a music curator with encyclopedic knowledge of music across all genres and eras. Generate a themed playlist based on the user's mood. ${genreInstruction} Return JSON: { "playlistName": string, "description": string, "coverGradient": { "from": string, "to": string }, "songs": [{ "title": string, "artist": string, "year": number, "reason": string }] }. Include exactly 15 real, well-known songs that actually exist. The coverGradient should be two hex colors that match the mood aesthetically.`,
            },
            {
              role: "user",
              content: mood.trim(),
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Groq API error:", res.status, errBody);
      return Response.json(
        { error: "Failed to generate playlist. Please try again." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "No response from AI. Please try again." },
        { status: 502 }
      );
    }

    const playlist = JSON.parse(content);
    return Response.json(playlist);
  } catch (err) {
    console.error("Generate error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
