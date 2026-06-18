export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const turboApiUrl = 'https://turbosmm.site/api/v2';
    const apiToken = '024bfcbaa69424012bbf368cf30c285e';
    const { serviceId, link, quantity } = req.body;
    try {
        const response = await fetch(turboApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ key: apiToken, action: 'add', service: serviceId, link: link, quantity: quantity })
        });
        const orderResult = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(orderResult);
    } catch (error) { return res.status(500).json({ error: "Order process crash", detail: error.message }); }
}
