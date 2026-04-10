import { analyzeImage as analyzeImageOpenRouter } from "@/integrations/openrouter";
import { ImageAnalysisResult } from "@/components/ui/image-analysis";

export class VisionAI {
  private apiKey: string;

  constructor(apiKey: string) {
    // Allow initialization without API key - will handle missing key gracefully
    if (!apiKey) {
      console.warn('Vision AI initialized without API key. Image analysis will not work until key is provided.');
      this.apiKey = '';
    } else {
      console.log('Vision AI initialized with API key');
      this.apiKey = apiKey;
    }
  }

  async analyzeImage(imageFile: File): Promise<ImageAnalysisResult> {
    try {
      console.log("Analyzing image:", imageFile.name);
      // Convert file to base64
      const base64Image = await this.fileToBase64(imageFile);
      console.log("Image converted to base64, length:", base64Image.length);

      console.log("🔄 Sending request to OpenRouter AI model...");
      const result = await analyzeImageOpenRouter(base64Image, imageFile.type);
      console.log("✅ AI model generated content");
      console.log("✅ Received response from AI");

      console.log("Raw AI Response:", result);
      console.log(
        "Image file analyzed:",
        imageFile.name,
        "Type:",
        imageFile.type,
      );

      return result;
    } catch (error) {
      console.error("Vision AI analysis failed:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      return {
        isFarmRelated: false,
        isSunRelated: false,
        confidence: 0,
        description: `Analysis failed due to technical error: ${error instanceof Error ? error.message : String(error)}`,
        category: "other",
        issues: [`Technical error during analysis: ${error instanceof Error ? error.message : String(error)}`],
        formData: {
          location: null,
          currentCrops: null,
          soilType: null,
          waterSource: null,
          currentIrrigationMethod: null,
          soilMoisture: null,
          cropRotationPattern: null,
          majorChallenges: null,
          harvestSeason: null,
          fertilizerType: null,
        },
      };
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  async generateReport(analysisResult: ImageAnalysisResult): Promise<string> {
    const prompt = `Based on the following image analysis, generate a brief report for water management:

Analysis Results:
- Farm Related: ${analysisResult.isFarmRelated}
- Sun Related: ${analysisResult.isSunRelated}
- Description: ${analysisResult.description}
- Category: ${analysisResult.category}
- Issues: ${analysisResult.issues?.join(", ") || "None"}

Generate a concise report (2-3 paragraphs) about the water management implications of this image, considering farming and sun exposure factors.`;

    try {
      // Import OpenAI client for this one-off request
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: 'https://openrouter.ai/api/v1',
        dangerouslyAllowBrowser: true
      });

      const result = await client.chat.completions.create({
        model: "mistralai/ministral-14b-2512",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      });

      return result.choices[0]?.message?.content || "Unable to generate report at this time.";
    } catch (error) {
      console.error("Report generation failed:", error);
      return "Unable to generate report at this time.";
    }
  }
}

// Initialize with API key from environment or localStorage
const getVisionApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const userKey = localStorage.getItem('openrouter_api_key');
    if (userKey) return userKey;
  }
  return import.meta.env.VITE_OPENROUTER_API_KEY || '';
};

export const visionAI = new VisionAI(getVisionApiKey());
