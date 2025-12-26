const supabase = require('../config/database');
const axios = require('axios');

exports.triggerScraping = async (req, res) => {
    try {
        const { query, location } = req.body;

        // This would normally trigger an n8n webhook
        res.json({ success: true, message: 'Scraping triggered', query, location });
    } catch (err) {
        console.error('Trigger scraping error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.receiveScrapedData = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Items array required' });
        }

        for (const item of items) {
            await supabase.from('scraped_data').insert({
                title: item.title,
                content: item.content || item.description,
                source_url: item.url || item.source_url,
                category: item.category || 'general'
            });
        }

        res.json({ success: true, message: `Saved ${items.length} items` });
    } catch (err) {
        console.error('Receive scraped error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getScrapedData = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('scraped_data')
            .select('*')
            .order('scraped_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        res.json({ success: true, data: data || [] });
    } catch (err) {
        console.error('Get scraped error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyScrapedData = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('scraped_data')
            .select('*')
            .eq('user_id', req.user.id)
            .order('scraped_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data: data || [] });
    } catch (err) {
        console.error('Get my scraped error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteScrapedData = async (req, res) => {
    try {
        const { error } = await supabase
            .from('scraped_data')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        console.error('Delete scraped error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.scrapeGoogleMaps = async (req, res) => {
    try {
        const { query, location } = req.body;
        const apiKey = process.env.SERP_API_KEY;

        if (!apiKey) {
            return res.status(400).json({ success: false, message: 'SERP API key not configured' });
        }

        const response = await axios.get('https://serpapi.com/search', {
            params: {
                engine: 'google_maps',
                q: query,
                ll: location,
                type: 'search',
                api_key: apiKey
            }
        });

        const results = response.data.local_results || [];
        res.json({ success: true, results });
    } catch (err) {
        console.error('Scrape error:', err);
        res.status(500).json({ success: false, message: 'Scraping failed' });
    }
};

exports.saveScrapedData = async (req, res) => {
    try {
        const { title, content, source_url, category } = req.body;

        const { data, error } = await supabase
            .from('scraped_data')
            .insert({ title, content, source_url, category, user_id: req.user.id })
            .select('id')
            .single();

        if (error) throw error;
        res.json({ success: true, message: 'Data saved', id: data.id });
    } catch (err) {
        console.error('Save scraped error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
