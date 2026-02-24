export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || !apiKey) {
    return res.status(500).json({ error: "ElevenLabs credentials not configured" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs signed URL error:", errText);
      return res.status(response.status).json({ error: "Failed to get signed URL" });
    }

    const data = await response.json();
    return res.status(200).json({ signedUrl: data.signed_url });
  } catch (err) {
    console.error("ElevenLabs API error:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
