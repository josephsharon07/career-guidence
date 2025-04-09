const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = 'AIzaSyAW3zTc_tNjvDJBjCNDHviiyf2AcSYoXBQ';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: "The suggested careers suitable for the particular MBTI type need to be explained with content based on their age, YouTube videos with links and thumbnail url, and books from Google Books with links cover url."
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function generateCareerSuggestions(trait: string, age: number) {
  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(`Generate career suggestions for MBTI type ${trait} at age ${age}`);
    const output = result.response.text();
    return output;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}
