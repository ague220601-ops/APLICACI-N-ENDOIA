import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: { sizeLimit: "2mb" },
  },
};

async function downloadImageAsDataUrl(imageUrl: string): Promise<string> {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error("No se pudo descargar la imagen");

  const arrayBuffer = await imageResponse.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
  return `data:${contentType};base64,${base64}`;
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { imageUrl, tipo, momento } = req.body as {
      imageUrl: string;
      tipo?: "periapical" | "cbct";
      momento?: string;
    };

    if (!imageUrl) return res.status(400).json({ error: "imageUrl requerido" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Falta OPENAI_API_KEY en Vercel" });

    // Descargar imagen -> base64 data url (igual que tu server)
    let imageData: string;
    try {
      imageData = await downloadImageAsDataUrl(imageUrl);
    } catch (e) {
      return res.status(500).json({ error: "Error descargando imagen para análisis" });
    }

    const systemPrompt = `You are ENDOIA Vision, an AI radiographic assistant designed for endodontists.

Your job is to analyze periapical radiographs and extract objective findings ONLY.
Your output must ALWAYS be a valid JSON object with no code block delimiters.

Before analyzing, apply these core rules:

1. **Immature teeth rule (CRITICAL):**
   If the tooth shows open apices due to root development (wide apical foramen, funnel-shaped apex, incomplete root formation), this is NORMAL anatomy.
   - Do NOT classify this as periapical pathology.
   - Do NOT mark radiolucency.
   - Do NOT mark PDL widening.
   - Do NOT say the lamina dura is lost if the tooth is immature.
   - **PAI MUST be 1** unless there is a clear, discrete, well-demarcated periapical lesion beyond the area of normal root development.

2. **PAI scoring rules (Ørstavik Index):**
   Use ONLY these definitions:
   - PAI 1: Normal periapical structures.
   - PAI 2: Small changes in bone structure.
   - PAI 3: Changes in bone structure with some mineral loss.
   - PAI 4: Well-defined radiolucent area.
   - PAI 5: Severe radiolucency with exacerbating features.

   A tooth with an **open apex** CANNOT be assigned PAI > 1 unless the radiolucency is **separate from** the developing apex.

3. **Report ONLY objective findings:**
   - pai (integer 1–5)
   - radiolucencyDetected (true/false)
   - lesionDiameterMm (number or null)
   - laminaDuraIntact (true/false/null)
   - pdlWidening ("normal" | "mild" | "moderate" | "severe")
   - borders ("well-defined" | "ill-defined" | null)
   - comments (short explanation)

If immature root development is present:
→ pai = 1
→ radiolucencyDetected = false
→ lesionDiameterMm = 0
→ laminaDuraIntact = true
→ pdlWidening = "normal"

Return ONLY valid JSON with no markdown:

{
  "pai": ...,
  "radiolucencyDetected": ...,
  "lesionDiameterMm": ...,
  "laminaDuraIntact": ...,
  "pdlWidening": "...",
  "borders": "...",
  "comments": "..."
}`;

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "This is a dental periapical radiograph. Analyze the visible teeth and periapical structures. You MUST respond with ONLY a valid JSON object containing the analysis fields (pai, radiolucencyDetected, lesionDiameterMm, laminaDuraIntact, pdlWidening, borders, comments). No other text allowed.",
            },
            { type: "image_url", image_url: { url: imageData, detail: "high" } },
          ],
        },
      ],
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return res.status(500).json({ error: "Respuesta vacía del modelo de visión" });

    let text = String(content).replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
      // mismo fallback que tu server
      if (
        text.toLowerCase().includes("unable to") ||
        text.toLowerCase().includes("cannot") ||
        text.toLowerCase().includes("can't")
      ) {
        return res.json({
          pai: null,
          radiolucencyDetected: false,
          lesionDiameterMm: null,
          laminaDuraIntact: null,
          pdlWidening: null,
          borders: null,
          comments: "Análisis automático no disponible - verificar imagen manualmente",
        });
      }
      return res.status(500).json({ error: "La IA no devolvió un JSON reconocible", raw: text });
    }

    const jsonText = text.slice(firstBrace, lastBrace + 1);
    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return res.status(500).json({ error: "No se pudo parsear el JSON devuelto por la IA", raw: jsonText });
    }

    const result = {
      pai: typeof parsed.pai === "number" ? parsed.pai : null,
      radiolucencyDetected: Boolean(parsed.radiolucencyDetected),
      lesionDiameterMm: typeof parsed.lesionDiameterMm === "number" ? parsed.lesionDiameterMm : null,
      laminaDuraIntact:
        typeof parsed.laminaDuraIntact === "boolean" || parsed.laminaDuraIntact === null ? parsed.laminaDuraIntact : null,
      pdlWidening: parsed.pdlWidening ?? null,
      borders: parsed.borders ?? null,
      comments: typeof parsed.comments === "string" ? parsed.comments : "",
    };

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Error interno en análisis IA" });
  }
}
