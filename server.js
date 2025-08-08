const express = require('express');
const cors = require('cors');
const scraper = require('./scrape');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 });
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/products', async (req, res) => {
    const cached = cache.get('products');
    if (cached) return res.json(cached);
    try {
        const data = await scraper.scrapeSample();
        cache.set('products', data);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/refresh', async (req, res) => {
    try {
        const data = await scraper.scrapeSample();
        cache.set('products', data);
        res.json({ ok: true, count: data.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('API listening on', port));
