import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { validateFirebaseToken, requireRole, type AuthenticatedRequest } from "./auth-middleware";
import { openai } from "./openaiClient";

async function downloadImageAsBuffer(imageUrl: string): Promise<{ buffer: Buffer; contentType: string }> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("No se pudo descargar la imagen");
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  return { buffer, contentType };
}

function bufferToBase64DataUrl(buffer: Buffer, contentType: string): string {
  const base64 = buffer.toString('base64');
  return `data:${contentType};base64,${base64}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/vision-detect-teeth", async (req, res) => {
    try {
      const { imageUrl, targetFdi } = req.body as {
        imageUrl: string;
        targetFdi: number;
      };

      if (!imageUrl) {
        return res.status(400).json({ error: "imageUrl requerido" });
      }

      console.log("🦷 Verificando diente FDI:", targetFdi);

      let imageData: string;
      try {
        const { buffer, contentType } = await downloadImageAsBuffer(imageUrl);
        imageData = bufferToBase64DataUrl(buffer, contentType);
        console.log("✅ Imagen descargada, tamaño:", buffer.length, "bytes");
      } catch (fetchErr) {
        console.error("❌ Error descargando imagen:", fetchErr);
        return res.status(500).json({ error: "Error descargando imagen" });
      }

      const detectPrompt = `You are a dental radiograph verification system using FDI (ISO 3950) notation.

Your task: Check if tooth FDI ${targetFdi} is visible in this periapical radiograph.
DO NOT crop or modify the image. Just verify presence.

**FDI NUMBERING SYSTEM:**

First digit = QUADRANT (1=upper right, 2=upper left, 3=lower left, 4=lower right)
Second digit = TOOTH POSITION (1-8 from midline outward):
1=Central incisor, 2=Lateral incisor, 3=Canine, 4=1st premolar, 5=2nd premolar, 6=1st molar, 7=2nd molar, 8=3rd molar

**Reference:**
Q1 (upper right): 11-18 | Q2 (upper left): 21-28 | Q3 (lower left): 31-38 | Q4 (lower right): 41-48

For FDI ${targetFdi}: Quadrant ${Math.floor(targetFdi / 10)} (${['', 'upper right', 'upper left', 'lower left', 'lower right'][Math.floor(targetFdi / 10)]}), Tooth ${targetFdi % 10} (${['', 'central incisor', 'lateral incisor', 'canine', '1st premolar', '2nd premolar', '1st molar', '2nd molar', '3rd molar'][targetFdi % 10]})

Return ONLY valid JSON:

{
  "detected": true | false,
  "fdi": ${targetFdi},
  "toothName": "name of tooth ${targetFdi}",
  "confidence": 0.0-1.0,
  "notes": "brief explanation"
}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: detectPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Is tooth FDI ${targetFdi} visible in this radiograph? Return JSON only.`,
              },
              {
                type: "image_url",
                image_url: { url: imageData },
              },
            ],
          },
        ],
        max_tokens: 200,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Respuesta vacía del modelo" });
      }

      let text = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      console.log("🦷 Respuesta verificación:", text);

      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) {
        return res.json({
          detected: false,
          fdi: targetFdi,
          confidence: 0,
          notes: "No se pudo verificar el diente"
        });
      }

      const parsed = JSON.parse(text.slice(firstBrace, lastBrace + 1));

      return res.json({
        detected: Boolean(parsed.detected),
        fdi: parsed.fdi || targetFdi,
        toothName: parsed.toothName || "",
        confidence: parsed.confidence || 0,
        notes: parsed.notes || ""
      });

    } catch (err) {
      console.error("Error en /api/vision-detect-teeth:", err);
      return res.json({
        detected: false,
        fdi: req.body.targetFdi,
        confidence: 0,
        notes: "Error verificando diente"
      });
    }
  });

  app.post("/api/vision-analyze", async (req, res) => {
    try {
      const { imageUrl, tipo, momento } = req.body as {
        imageUrl: string;
        tipo: "periapical" | "cbct";
        momento: string;
      };

      if (!imageUrl) {
        return res.status(400).json({ error: "imageUrl requerido" });
      }

      console.log("🔗 URL de imagen recibida:", imageUrl);

      // Descargar imagen y convertir a base64
      let imageData: string;
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          return res.status(400).json({ error: "No se pudo descargar la imagen" });
        }
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        imageData = `data:${contentType};base64,${base64}`;
        console.log("✅ Imagen convertida a base64, tamaño:", base64.length, "chars");
      } catch (fetchErr) {
        console.error("❌ Error descargando imagen:", fetchErr);
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
              {
                type: "image_url",
                image_url: { url: imageData, detail: "high" },
              },
            ],
          },
        ],
        max_tokens: 400,
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        return res.status(500).json({ error: "Respuesta vacía del modelo de visión" });
      }

      let text: string = typeof content === "string" ? content : String(content);
      
      console.log("📸 Respuesta raw de GPT-4o Vision:", text);

      // Eliminar bloques de código markdown si existen
      text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) {
        console.error("❌ No se encontró JSON en respuesta:", text);
        
        // Si la IA no puede analizar la imagen, devolver valores por defecto
        // en lugar de fallar completamente
        if (text.toLowerCase().includes("unable to") || 
            text.toLowerCase().includes("cannot") ||
            text.toLowerCase().includes("can't")) {
          console.log("⚠️ IA rechazó análisis, usando valores por defecto");
          return res.json({
            pai: null,
            radiolucencyDetected: false,
            lesionDiameterMm: null,
            laminaDuraIntact: null,
            pdlWidening: null,
            borders: null,
            comments: "Análisis automático no disponible - verificar imagen manualmente"
          });
        }
        
        return res.status(500).json({
          error: "La IA no devolvió un JSON reconocible",
          raw: text,
        });
      }

      const jsonText = text.slice(firstBrace, lastBrace + 1);
      let parsed: any;

      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        console.error("Error parseando JSON de OpenAI:", err, jsonText);
        return res.status(500).json({
          error: "No se pudo parsear el JSON devuelto por la IA",
          raw: jsonText,
        });
      }

      const result = {
        pai: typeof parsed.pai === "number" ? parsed.pai : null,
        radiolucencyDetected: Boolean(parsed.radiolucencyDetected),
        lesionDiameterMm:
          typeof parsed.lesionDiameterMm === "number"
            ? parsed.lesionDiameterMm
            : null,
        laminaDuraIntact:
          typeof parsed.laminaDuraIntact === "boolean" ||
          parsed.laminaDuraIntact === null
            ? parsed.laminaDuraIntact
            : null,
        pdlWidening: parsed.pdlWidening ?? null,
        borders: parsed.borders ?? null,
        comments: typeof parsed.comments === "string" ? parsed.comments : "",
      };

      return res.json(result);
    } catch (err) {
      console.error("Error en /api/vision-analyze:", err);
      return res.status(500).json({ error: "Error interno en análisis IA" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
