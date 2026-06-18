export default async function handler(req, res) {
    // CORS Headers taaki frontend bina dikkat request bhej sake
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight request handle karne ke liye
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Sirf POST request allow karni hai order ke liye
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed. Use POST." });
    }

    try {
        // Frontend se aane wala data (link, quantity, service ID)
        const { service, link, quantity } = req.body;

        if (!service || !link || !quantity) {
            return res.status(400).json({ error: "Missing required fields (service, link, quantity)" });
        }

        // TurboSMM ke API ko order bhej rahe hain
        const response = await fetch('https://turbosmm.site/api/v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                key: '024bfcbaa69424012bbf368cf30c285e', // Aapki TurboSMM API Key
                action: 'add',
                service: service.toString(),
                link: link.toString(),
                quantity: quantity.toString()
            })
        });

        const result = await response.json();

        // Agar TurboSMM success response deta hai (jaise order id milna)
        if (result && (result.order || result.status)) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ error: "Provider Error", details: result });
        }

    } catch (err) {
        return res.status(500).json({ error: "Server connection failed", message: err.message });
    }
}
