require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// You can keep your real API key logic if needed
const NUMVERIFY_API_KEY = process.env.NUMVERIFY_API_KEY || 'NUMVERIFY_API_KEY';
const WHITEPAGES_API_KEY = process.env.WHITEPAGES_API_KEY || 'WHITEPAGES_API_KEY';

// Simulated API responses
const mockNumVerifyResponse = {
  international_format: '+18132964717',
  carrier: 'Verizon Wireless',
  location: 'Tampa, FL',
  line_type: 'mobile',
};

const mockWhitepagesResponse = {
  current_carrier: { name: 'Verizon Wireless' },
  original_carrier: { name: 'AT&T' },
};

// Simulated Third API Response (Spam Risk/Blocked)
const mockThirdApiResponse = {
  spamScore: Math.random() < 0.5 ? 'low' : 'high', // Random spam risk
  blocked: Math.random() < 0.5, // Random blocked status
};

// POST endpoint for phone verification
app.post('/verify', async (req, res) => {
  const phoneNumber = req.body.number;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  try {
    // Simulating NumVerify API call
    const numverifyResponse = mockNumVerifyResponse;

    // Simulating Whitepages API call
    const whitepagesResponse = mockWhitepagesResponse;

    // Simulating Third API response (e.g., Spam API)
    const thirdApiResponse = mockThirdApiResponse;

    // Aggregate Results
    const result = {
      phoneNumber: numverifyResponse.international_format || phoneNumber,
      carriers: [numverifyResponse.carrier || 'Unknown'],
      location: numverifyResponse.location || 'Unknown',
      lineType: numverifyResponse.line_type || 'Unknown',
      spamRisk: thirdApiResponse.spamScore,
      blocked: thirdApiResponse.blocked,
    };

    // Add carriers from Whitepages to the result (if available)
    if (whitepagesResponse.current_carrier) {
      result.carriers.push(whitepagesResponse.current_carrier.name);
    }
    if (whitepagesResponse.original_carrier) {
      result.carriers.push(whitepagesResponse.original_carrier.name);
    }

    // Remove duplicate carriers
    result.carriers = [...new Set(result.carriers)];

    // Send the simulated result as the response
    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error fetching data from APIs.' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
