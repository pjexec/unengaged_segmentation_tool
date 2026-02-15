const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from this directory
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// ActiveCampaign proxy endpoint
app.post('/api/activecampaign/contact', async (req, res) => {
    const AC_API_URL = process.env.AC_API_URL || 'https://reengage22324.api-us1.com';
    const AC_API_KEY = process.env.AC_API_KEY || '58daa6821ced8e466105c1dbe3704c7613f82ed0cf9df94b674c423ebddea1dab6ce16ac';
    const AC_LIST_ID = process.env.AC_LIST_ID || 9;

    if (!AC_API_URL || !AC_API_KEY) {
        return res.status(500).json({ error: 'ActiveCampaign not configured' });
    }

    try {
        const { email, firstName } = req.body;

        // Create or update contact
        const contactRes = await fetch(`${AC_API_URL}/api/3/contact/sync`, {
            method: 'POST',
            headers: {
                'Api-Token': AC_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact: {
                    email,
                    firstName: firstName || '',
                }
            })
        });

        const contactData = await contactRes.json();
        const contactId = contactData?.contact?.id;

        // Add to list if configured
        if (contactId && AC_LIST_ID) {
            await fetch(`${AC_API_URL}/api/3/contactLists`, {
                method: 'POST',
                headers: {
                    'Api-Token': AC_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contactList: {
                        list: AC_LIST_ID,
                        contact: contactId,
                        status: 1
                    }
                })
            });
        }

        res.json({ success: true, contactId });
    } catch (err) {
        console.error('AC API error:', err);
        res.status(500).json({ error: 'Failed to process contact' });
    }
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Cold traffic tool running on port ${PORT}`);
});
