export default async function handler(req, res) {
    const turboApiUrl = 'https://turbosmm.site/api/v2';
    const apiToken = '024bfcbaa69424012bbf368cf30c285e';
    try {
        const response = await fetch(`${turboApiUrl}?action=services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ key: apiToken })
        });
        if (!response.ok) throw new Error("Fetch failed");
        const originalServices = await response.json();
        const modifiedServices = originalServices.map(service => {
            let originalRate = parseFloat(service.rate);
            let newRate = originalRate * 1.20; 
            return { ...service, rate: newRate.toFixed(2) };
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(200).json(modifiedServices);
    } catch (error) { return res.status(500).json({ error: "Backend fetch error", detail: error.message }); }
}
