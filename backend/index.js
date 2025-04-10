const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { name, relationship, interests, occasion, budget } = req.body;

  const prompt = `Suggest a single gift (no links) for the following person. Keep the response short and JSON formatted like this:
{
  "gift": "Gift Name",
  "explanation": "Very short explanation"
}

Details:
Name: ${name}
Relationship: ${relationship}
Interests: ${interests}
Occasion: ${occasion}
Budget: ${budget}
`;

  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.8,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiText = response.data.generations[0].text.trim();

    let giftResponse;
    try {
      giftResponse = JSON.parse(aiText);
    } catch (e) {
      console.error("Parse error:", aiText);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    res.json(giftResponse);
  } catch (error) {
    console.error('Cohere API error:', error.message);
    res.status(500).json({ error: 'Something went wrong with the AI request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
