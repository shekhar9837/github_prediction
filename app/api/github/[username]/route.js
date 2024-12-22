// app/api/github/[username]/route.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini with API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", // Model to use
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function GET(req, { params }) {
  const { username } = params;
  const apiUrl = `https://api.github.com/users/${username}`;

  // Fetch user data from GitHub API
  const response = await fetch(apiUrl);
  const userData = await response.json();

  // Handle case where user is not found
  if (userData.message === 'Not Found') {
    return new Response('User not found', { status: 404 });
  }

  // Extract relevant user data
  const { followers, following, public_repos, location, hireable, bio, site_admin, login } = userData;

  // Generate the prompt for Google Gemini
  const prompt = generatePrompt(followers, following, public_repos, location, hireable, bio, site_admin, login);

  // Fetch prediction from Google Gemini AI
  const prediction = await getPredictionFromGemini(prompt);

  // Return the prediction as a response
  return new Response(JSON.stringify({ prediction }), { status: 200 });
}

// Function to generate the prompt for the Gemini model based on GitHub data
function generatePrompt(followers, following, public_repos, location, hireable, bio, site_admin, login) {
  return `
    Based on the following GitHub profile data, generate a fun, humorous, savage, and casual prediction for the year 2025 and say like in 2025 he/she will be :
    - GitHub Username: ${login}
    - Followers: ${followers}
    - Following: ${following}
    - Public Repos: ${public_repos}
    - Location: ${location || 'Unknown'}
    - Hireable: ${hireable ? 'Yes' : 'No'}
    - Bio: ${bio || 'No bio provided'}
    - Site Admin: ${site_admin ? 'Yes' : 'No'}

    The prediction should be  fun, casual, and reflect the user's GitHub activity and personality.
  `;
}

// Function to fetch prediction from Google Gemini API
async function getPredictionFromGemini(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text(); // Return the generated prediction text
}
