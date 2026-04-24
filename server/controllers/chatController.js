import { GoogleGenAI } from '@google/genai';

export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // System prompt to set the AI's identity
    const systemPrompt = `You are an intelligent, empathetic, and highly capable medical assistant AI integrated into the Agentic Healthcare Platform. 
Your goal is to help users (patients) navigate the platform, understand their medical options, and assist with general inquiries. 
You can answer questions about finding doctors, booking appointments, the symptom checking process, and travel assistance. 
Keep your answers concise, professional, and friendly. If a user describes a medical emergency, advise them to call emergency services immediately.`;

    // Construct the conversation history for Gemini
    let conversation = systemPrompt + "\n\n";
    if (history && history.length > 0) {
      history.forEach(msg => {
        conversation += `${msg.sender === 'user' ? 'Patient' : 'Assistant'}: ${msg.text}\n`;
      });
    }
    conversation += `Patient: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversation,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
};
