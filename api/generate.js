import OpenAI from "openai";

const client = new OpenAI();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { model, max_tokens, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages" });
  }

  try {
    const response = await client.chat.completions.create({
      model: model || "gpt-5.2",
      max_tokens: max_tokens || 4096,
      messages,
    });

    return res.status(200).json(response);
  } catch (err) {
    console.error("OpenAI API error:", err.message);
    return res
      .status(err.status || 500)
      .json({ error: err.message || "Internal server error" });
  }
}
