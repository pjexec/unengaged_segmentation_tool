const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// ActiveCampaign API proxy — keeps API key server-side
app.post('/api/activecampaign/contact', async (req, res) => {
    const AC_API_URL = process.env.AC_API_URL || 'https://reengage22324.api-us1.com';
    const AC_API_KEY = process.env.AC_API_KEY || '58daa6821ced8e466105c1dbe3704c7613f82ed0cf9df94b674c423ebddea1dab6ce16ac';
    const AC_LIST_ID = process.env.AC_LIST_ID || 9;

    const { firstName, email } = req.body;

    if (!firstName || !email) {
        return res.status(400).json({ error: 'firstName and email are required' });
    }

    try {
        // Step 1: Create or update the contact
        const contactRes = await fetch(`${AC_API_URL}/api/3/contact/sync`, {
            method: 'POST',
            headers: {
                'Api-Token': AC_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact: {
                    email: email,
                    firstName: firstName
                }
            })
        });

        if (!contactRes.ok) {
            const errBody = await contactRes.text();
            console.error('AC contact sync failed:', contactRes.status, errBody);
            return res.status(502).json({ error: 'Failed to create contact' });
        }

        const contactData = await contactRes.json();
        const contactId = contactData.contact.id;

        // Step 2: Subscribe contact to list
        const listRes = await fetch(`${AC_API_URL}/api/3/contactLists`, {
            method: 'POST',
            headers: {
                'Api-Token': AC_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contactList: {
                    list: parseInt(AC_LIST_ID),
                    contact: parseInt(contactId),
                    status: 1
                }
            })
        });

        if (!listRes.ok) {
            const errBody = await listRes.text();
            console.error('AC list subscribe failed:', listRes.status, errBody);
            // Contact was created, so still partial success
        }

        res.json({ success: true, contactId: contactId });
    } catch (err) {
        console.error('ActiveCampaign proxy error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve cold-traffic-tool static files (must come before catch-all)
app.use('/cold-traffic-tool', express.static(path.join(__dirname, 'cold-traffic-tool')));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
