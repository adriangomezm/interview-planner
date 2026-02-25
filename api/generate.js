import OpenAI from "openai";

const client = new OpenAI();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { model, max_tokens, max_completion_tokens, messages, temperature } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages" });
  }

  try {
    const params = {
      model: model || "gpt-5.2",
      max_completion_tokens: max_completion_tokens || max_tokens || 4096,
      messages,
    };
    if (typeof temperature === "number") params.temperature = temperature;
    const response = await client.chat.completions.create(params);

    return res.status(200).json(response);
  } catch (err) {
    console.error("OpenAI API error:", err.message);
    return res
      .status(err.status || 500)
      .json({ error: err.message || "Internal server error" });
  }
}
