export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { serviceId, link, quantity } = req.body;

        if (!serviceId || !link || !quantity) {
            return res.status(400).json({ error: "Fields missing: serviceId, link, or quantity" });
        }

        const response = await fetch('https://turbosmm.site/api/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                key: '024bfcbaa69424012bbf368cf30c285e',
                action: 'add',
                service: serviceId.toString(),
                link: link.toString(),
                quantity: quantity.toString()
            })
        });

        // Response text check karne ke liye taaki crash na ho
        const responseText = await response.text();
        
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            return res.status(400).json({ error: `Server sent non-JSON response: ${responseText.substring(0, 100)}` });
        }

        // Agar response mein error hai toh wahi frontend par dikhao
        if (result && result.error) {
            return res.status(400).json({ error: result.error });
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ error: "Order process crash", message: err.message });
    }
}
