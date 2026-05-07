const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * CONFIGURATION
 * 
 * In a real-world enterprise environment, detecting spoofed senders (Typosquatting)
 * would typically involve calculating the distance (e.g., Levenshtein distance)
 * against a list of top domains (like the Alexa Top 1M list) to detect minor variations.
 * 
 * For the purpose of this targeted system and to optimize performance,
 * we are checking against a predefined list of high-value targeted brands
 * using regular expressions to detect common character substitutions.
 */
const TARGETED_BRANDS = ['paypal', 'google', 'amazon', 'apple', 'microsoft', 'bank'];

// Common substitutions: 1 for l/i, 0 for o, vv for w, rn for m
const SUBSTITUTIONS = {
    'l': '[l1i!]',
    'i': '[i1l!]',
    'o': '[o0]',
    'w': '(?:w|vv)',
    'm': '(?:m|rn)',
    'a': '[a@4]',
    'e': '[e3]',
    's': '[s5\\$]',
    't': '[t7]'
};

// Function to dynamically build regex for a brand to detect typosquatting
const buildBrandRegex = (brand) => {
    let regexStr = '';
    for (let char of brand.toLowerCase()) {
        if (SUBSTITUTIONS[char]) {
            regexStr += SUBSTITUTIONS[char];
        } else {
            regexStr += char;
        }
    }
    // We want to detect if the string matches the regex, but is NOT the exact brand itself.
    // However, for simplicity here, we'll build the regex to match variations
    // and we'll check later if it equals the exact brand (which would mean it's legitimate).
    return new RegExp(`\\b${regexStr}\\b`, 'i');
};

const brandPatterns = TARGETED_BRANDS.map(brand => ({
    name: brand,
    regex: buildBrandRegex(brand)
}));

app.post('/api/scan', (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text content is required' });
    }

    const indicators = [];

    // 1. Suspicious Links: Detect IP addresses in URLs
    const ipLinkRegex = /https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/g;
    const foundIps = text.match(ipLinkRegex);
    if (foundIps) {
        indicators.push(`Suspicious links containing IP addresses found: ${foundIps.join(', ')}`);
    }

    // 2. Spoofed Senders / Typosquatting
    // Extract potential email domains or domain parts
    // Simple extraction of words that look like they could be in an email or url
    const words = text.split(/[\s@\.]+/);
    
    brandPatterns.forEach(pattern => {
        // Look for matches in the text
        const matches = text.match(new RegExp(pattern.regex.source, 'gi'));
        if (matches) {
            matches.forEach(match => {
                // If it matches the regex but is NOT exactly the brand name, it's highly suspicious.
                if (match.toLowerCase() !== pattern.name.toLowerCase()) {
                    // Check if we haven't already added this exact warning
                    const warning = `Possible spoofed domain detected: '${match}' looks like '${pattern.name}'`;
                    if (!indicators.includes(warning)) {
                        indicators.push(warning);
                    }
                }
            });
        }
    });

    // 3. Urgent Language
    const urgentWordsRegex = /\b(urgent|immediately|action required|account suspended|verify your account|password expiration|security alert)\b/gi;
    const urgentMatches = text.match(urgentWordsRegex);
    if (urgentMatches) {
        const uniqueMatches = [...new Set(urgentMatches.map(m => m.toLowerCase()))];
        indicators.push(`Urgent language detected: ${uniqueMatches.join(', ')}`);
    }

    // Determine Result
    const isPhishing = indicators.length > 0;

    res.json({
        isPhishing,
        indicators
    });
});

app.listen(PORT, () => {
    console.log(`Email Phishing Detector API running on http://localhost:${PORT}`);
});
