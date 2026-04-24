import { GoogleGenAI } from '@google/genai';
import SymptomRecord from '../models/SymptomRecord.js';
import Specialist from '../models/Specialist.js';

// We will initialize this inside the function so that dotenv has loaded
let ai;

export const analyzeSymptoms = async (req, res) => {
  try {
    if (!ai) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    
    const { symptoms, patientId } = req.body;
    
    if (!symptoms || !patientId) {
      return res.status(400).json({ message: 'Symptoms and patientId are required' });
    }

    const prompt = `
      You are an expert AI medical triage assistant. 
      Analyze the following patient symptoms: "${symptoms}"
      
      Respond STRICTLY in the following JSON format without markdown code blocks:
      {
        "severity": "Low" | "Medium" | "High" | "Critical",
        "conditions": [
          {"name": "Condition 1", "probability": 85},
          {"name": "Condition 2", "probability": 40}
        ],
        "recommendedSpecialistType": "Cardiologist" | "Neurologist" | "General Physician" | "Dermatologist" | "Pediatrician" | "Orthopedic" | "Gynecologist" | "Psychiatrist" | "ENT Specialist" | "Endocrinologist"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
    
    const responseText = response.text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse AI response");
    
    const aiAnalysis = JSON.parse(jsonMatch[0]);
    aiAnalysis.rawResponse = responseText;

    const record = await SymptomRecord.create({
      patient: patientId,
      symptoms,
      aiAnalysis
    });

    // Case insensitive regex search for matching specialists
    const specialists = await Specialist.find({ 
      specialty: new RegExp(aiAnalysis.recommendedSpecialistType, 'i') 
    }).populate('user', 'name email');

    res.json({
      record,
      recommendedSpecialists: specialists
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    if (error.status === 404) {
      return res.status(404).json({ message: 'The AI model specified is not available. Please contact support.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ message: 'API Rate limit exceeded or free tier quota exhausted. Please wait 1 minute and try again.' });
    }
    if (error.status === 503) {
      return res.status(503).json({ message: 'The AI model is currently experiencing high demand. Please wait a few seconds and try again.' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getSymptomHistory = async (req, res) => {
  try {
    const history = await SymptomRecord.find({ patient: req.params.patientId })
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
