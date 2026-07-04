import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import url from 'url';
import path from 'path';

dotenv.config();

// We need to dynamically import the backend API because the project uses "type": "module"
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// Load Vercel handler
const chatPath = path.join(__dirname, 'api', 'chat.js');
let chatHandler = await import(url.pathToFileURL(chatPath).href).then(m => m.default);

app.post('/api/chat', async (req, res) => {
    try {
        await chatHandler(req, res);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Development API server running on http://localhost:${PORT}`);
});
