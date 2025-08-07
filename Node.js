// server.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const BOT_TOKEN = '8058938968:AAE0GqiZWvsjdaYMHJAu3k3w-ciz_euUEMw';
const CHAT_ID = '595984491';

app.post('/api/notify', async (req, res) => {
    try {
        const { animeTitle, episodeTitle } = req.body;
        
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: `🎬 Новый просмотр:\nАниме: ${animeTitle}\nСерия: ${episodeTitle}`,
            parse_mode: 'HTML'
        });
        
        res.status(200).send('Уведомление отправлено');
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Ошибка отправки');
    }
});

app.listen(3000, () => console.log('Сервер запущен'));
