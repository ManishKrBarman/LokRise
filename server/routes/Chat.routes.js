// routes/Chat.routes.js
import express from 'express';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

router.post('/', async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Valid message is required' });
    }

    try {
        const websiteKnowledge = `
            LokRise is an e-commerce platform that offers:
            - Online shopping with multiple categories
            - Seller marketplace for vendors
            - Educational courses and learning paths
            - Customer support and community forums`;

        const response = await groq.chat.completions.create({
            model: 'mistral-saba-24b',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful AI chatbot for LokRise e-commerce platform. Respond naturally and helpfully using the following context: ${websiteKnowledge}. If you don't know something specific, you can say so.`
                },
                { role: 'user', content: message },
            ],
            temperature: 0.8,
            max_tokens: 150,
            top_p: 1,
        });

        const reply = response.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            return res.status(500).json({ error: 'No response from chatbot' });
        }

        res.json({ reply });
    } catch (error) {
        console.error('Chat Error:', error?.message || error);
        res.status(500).json({ error: 'Unable to process your request at the moment' });
    }
});

export default router;