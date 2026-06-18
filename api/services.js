export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const response = await fetch('https://turbosmm.site/api/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                key: '024bfcbaa69424012bbf368cf30c285e',
                action: 'services'
            })
        });

        const data = await response.json();
        if (!Array.isArray(data)) return res.status(400).json({ error: "API Error", data });

        // 20% Profit Margin add karne ke liye
        const modified = data.map(s => ({
            ...s,
            rate: (parseFloat(s.rate) * 1.20).toFixed(2)
        }));

        return res.status(200).json(modified);
    } catch (err) {
        return res.status(500).json({ error: "Connect failed", message: err.message });
    }
}
