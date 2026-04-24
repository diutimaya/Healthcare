import { GoogleGenAI } from '@google/genai';

let ai;

export const getHotelRecommendations = async (req, res) => {
  try {
    if (!ai) {
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    
    const { hospital, city } = req.body;
    
    if (!hospital || !city) {
      return res.status(400).json({ message: 'Hospital and city are required' });
    }

    const prompt = `
      You are an expert travel assistant. Provide realistic or real hotel accommodations near: ${hospital} in ${city}.
      
      Respond STRICTLY in the following JSON format without markdown code blocks:
      {
        "hotels": [
          {
            "name": "Hotel Name",
            "distance": "1.2 km away",
            "rating": 4,
            "price": 2500,
            "description": "A comfortable stay located very close to the hospital.",
            "amenities": ["Free WiFi", "Hospital Shuttle"],
            "isAIPick": true
          }
        ]
      }
      Provide exactly 4 realistic hotel recommendations. Ensure exactly one of them is marked as isAIPick: true. Prices should be realistic in INR (e.g. between 1000 and 10000). Rating should be an integer between 2 and 5. Amenities should be selected from: "Free WiFi", "Parking", "Restaurant", "Hospital Shuttle".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
    
    let recommendations;
    try {
      const responseText = response.text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Regex failed to find JSON");
      
      // Clean up potential trailing commas that break JSON.parse
      const cleanJson = jsonMatch[0].replace(/,\s*([\]}])/g, '$1');
      recommendations = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr);
      // Fallback
      recommendations = {
        hotels: [
          {
            name: "Grand Comfort Inn",
            distance: "0.5 km away",
            rating: 4,
            price: 2500,
            description: "A comfortable and highly-rated stay located very close to the hospital.",
            amenities: ["Free WiFi", "Parking"],
            isAIPick: true
          },
          {
            name: "City Suites Extended Stay",
            distance: "1.2 km away",
            rating: 3,
            price: 1800,
            description: "Affordable extended stay options for long treatments.",
            amenities: ["Free WiFi", "Hospital Shuttle"],
            isAIPick: false
          }
        ]
      };
    }

    res.json(recommendations);

  } catch (error) {
    console.error('Travel API Error:', error);
    res.status(500).json({ message: error.message });
  }
};
