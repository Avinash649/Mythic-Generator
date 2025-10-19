
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Myth, MythOptions } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mythSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "An epic title for the myth." },
    characters: {
      type: Type.ARRAY,
      description: "A list of key characters in the myth.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "The character's name." },
          role: { type: Type.STRING, description: "The character's role (e.g., Hero, Deity, Asura, Apsara)." },
          description: { type: Type.STRING, description: "A brief description of the character." },
        },
        required: ["name", "role", "description"]
      }
    },
    plot: { type: Type.STRING, description: "A summary of the myth's plot. Should be a single paragraph for 'short' length or multiple paragraphs for 'full' length." },
    symbolism: { type: Type.STRING, description: "An explanation of the symbolic meanings of key elements, characters, or events in the myth." }
  },
  required: ["title", "characters", "plot", "symbolism"]
};

export async function generateMyth(options: MythOptions): Promise<{ myth: Myth, imageUrl: string }> {
  const { theme, length, tone } = options;

  const textPrompt = `Generate a mini-myth in the style of the Indian Puranas.
    - Theme/Moral: ${theme}
    - Length: ${length === 'short' ? 'A concise short story' : 'A more detailed, full myth'}
    - Tone: ${tone}
    The myth should feature characters like deities, asuras, rishis, and mortals, and involve cosmic symbolism. Provide a title, a list of characters, the plot, and an explanation of the symbolism.`;

  const imagePrompt = `An epic, divine illustration in the style of Indian Puranic art, evoking a sense of ancient mythology. The scene is about the concept of "${theme}". The style is ${tone}.`;

  const textPromise = ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: textPrompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: mythSchema,
    }
  });

  const imagePromise = ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts: [{ text: imagePrompt }] }],
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  const [textResponse, imageResponse] = await Promise.all([textPromise, imagePromise]);

  const myth: Myth = JSON.parse(textResponse.text);

  let imageUrl = 'https://picsum.photos/1024/768'; // Default fallback image
  const imagePart = imageResponse.candidates?.[0]?.content?.parts?.[0];
  if (imagePart && imagePart.inlineData) {
    const base64ImageBytes = imagePart.inlineData.data;
    imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
  }
  
  return { myth, imageUrl };
}

export async function expandMyth(myth: Myth, tone: string): Promise<string> {
    const prompt = `You are a master storyteller in the tradition of the Puranas. Take the following plot summary and characters and expand it into a detailed, multi-paragraph legend. 
    Maintain a ${tone} tone. Embellish the narrative with rich descriptions, dialogues, and divine interventions.
    
    Title: ${myth.title}
    Characters: ${myth.characters.map(c => `${c.name} (${c.role})`).join(', ')}
    Plot Summary to Expand: ${myth.plot}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }]
    });

    return response.text;
}

export async function narrateMyth(text: string): Promise<string> {
    const prompt = `Narrate the following text in a clear, resonant, and epic storytelling voice.`;
    const fullText = `${prompt}\n\n${text}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: fullText }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.[0];
    if (audioPart && audioPart.inlineData?.data) {
        return audioPart.inlineData.data;
    } else {
        throw new Error("Audio data not found in response.");
    }
}
