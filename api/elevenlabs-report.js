export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const conversationId = req.query.id || req.query.conversationId;
  if (!conversationId) {
    return res.status(400).json({ error: "Missing conversation ID" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ElevenLabs API key not configured" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs report error:", errText);
      return res
        .status(response.status)
        .json({ error: "Failed to get conversation data" });
    }

    const data = await response.json();

    // Return structured report data
    return res.status(200).json({
      status: data.status || "unknown",
      transcript: data.transcript || [],
      analysis: {
        evaluation_criteria_results:
          data.analysis?.evaluation_criteria_results || {},
        data_collection_results:
          data.analysis?.data_collection_results || {},
        call_successful:
          data.analysis?.call_successful ?? null,
        transcript_summary:
          data.analysis?.transcript_summary || "",
      },
      metadata: {
        call_duration_secs: data.metadata?.call_duration_secs || 0,
        start_time_unix_secs: data.metadata?.start_time_unix_secs || 0,
        end_time_unix_secs: data.metadata?.end_time_unix_secs || 0,
      },
    });
  } catch (err) {
    console.error("ElevenLabs report API error:", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
}
