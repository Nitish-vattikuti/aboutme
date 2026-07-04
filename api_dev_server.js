import express from 'express';
import cors from 'cors';
import chatHandler from './api/chat.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        await chatHandler(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('API Dev Server running on port 3000'));
