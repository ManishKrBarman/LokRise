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
            MiDiORA offers services in:
            - Web Development (custom websites, frontend/backend)
            - App Development (Android, iOS, PWAs)
            - UI/UX Design (Figma, prototyping, testing)`;
        const response = await groq.chat.completions.create({
            model: 'mistral-saba-24b',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful AI chatbot for a tech website. Respond concisely in one or two complete sentences only and Use the following site context for answering user queries:\n${websiteKnowledge}`,
                },
                { role: 'user', content: message },
            ],
            stop: ['\n'],
            max_tokens: 50,
            temperature: 0.7,
        });

        const reply = response.choices?.[0]?.message?.content?.trim();

        if (!reply) {
            return res.status(500).json({ error: 'No response from Groq API' });
        }

        res.json({ reply });
    } catch (error) {
        console.error('Groq API Error:', error?.message || error);
        res.status(500).json({ error: 'Failed to get response from Groq API' });
    }
});

export default router;