import express from 'express';

const router = express.Router();

router.post('/scan', async (req, res) => {
  try {
    const { billImage } = req.body;
    if (!billImage) {
      return res.status(400).json({ error: 'No billImage provided in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Gemini OCR attempted but GEMINI_API_KEY is missing in env configurations.');
      return res.status(501).json({ error: 'Gemini API key is not configured' });
    }

    // Extract the pure base64 content
    let mimeType = 'image/jpeg';
    let base64Data = billImage;

    if (billImage.startsWith('data:')) {
      const parts = billImage.split(';base64,');
      if (parts.length === 2) {
        mimeType = parts[0].substring(5);
        base64Data = parts[1];
      }
    }

    // Call the Gemini REST API directly
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are a professional receipt parser AI. Carefully analyze the attached receipt image and extract the recipient (merchant name), the total amount, and the category. The category MUST be strictly chosen from one of these exact values: 'Groceries', 'Food & Dining', 'Rent & Housing', 'Bills & Utilities', 'Transportation', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Others'. Return the parsed fields strictly in JSON format as follows: {\"recipient\": \"Merchant Name\", \"amount\": 120.50, \"category\": \"Food & Dining\"}."
              },
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error details:', errText);
      return res.status(502).json({ error: 'Failed to communicate with AI model' });
    }

    const result = await response.json();
    
    // Extract candidate text from Gemini response structure
    const candidateText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return res.status(500).json({ error: 'No structured analysis returned from AI' });
    }

    // Parse candidate JSON
    const parsedData = JSON.parse(candidateText.trim());
    
    res.status(200).json({
      recipient: parsedData.recipient || 'Scanned Merchant',
      amount: parsedData.amount || 0,
      category: parsedData.category || 'Others'
    });

  } catch (error) {
    console.error('AI Scan Error:', error);
    res.status(500).json({ error: 'Internal server error during AI scanner execution' });
  }
});

export default router;
