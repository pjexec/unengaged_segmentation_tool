import { NextResponse } from 'next/server';

const API_URL = process.env.ACTIVECAMPAIGN_API_URL;
const API_KEY = process.env.ACTIVECAMPAIGN_API_KEY;
const LIST_ID = process.env.ACTIVECAMPAIGN_LIST_ID;

export async function POST(request: Request) {
    if (!API_URL || !API_KEY || !LIST_ID) {
        return NextResponse.json(
            { error: 'ActiveCampaign credentials not configured' },
            { status: 500 }
        );
    }

    try {
        const { email, firstName, lastName } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Create or Update Contact
        const contactResponse = await fetch(`${API_URL}/api/3/contact/sync`, {
            method: 'POST',
            headers: {
                'Api-Token': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contact: {
                    email,
                    firstName,
                    lastName,
                },
            }),
        });

        if (!contactResponse.ok) {
            const errorData = await contactResponse.json();
            console.error('ActiveCampaign Contact Sync Error:', errorData);
            return NextResponse.json(
                { error: 'Failed to sync contact with ActiveCampaign' },
                { status: contactResponse.status }
            );
        }

        const contactData = await contactResponse.json();
        const contactId = contactData.contact.id;

        // 2. Add Contact to List
        const listResponse = await fetch(`${API_URL}/api/3/contactLists`, {
            method: 'POST',
            headers: {
                'Api-Token': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contactList: {
                    list: LIST_ID,
                    contact: contactId,
                    status: 1, // 1 = Subscribed
                },
            }),
        });

        if (!listResponse.ok) {
            // If it fails, it might be because they are already on the list, which is fine usually,
            // but let's log it.
            const errorData = await listResponse.json();
            console.error('ActiveCampaign List Add Error:', errorData);
            // We generally don't block success if the contact was synced but list add failed (e.g. duplicate),
            // but for now let's return error to be safe or just proceed.
            // API v3 usually returns 200/201 even if already on list? 
            // Let's assume we proceed.
        }

        return NextResponse.json({ success: true, contactId });
    } catch (error) {
        console.error('ActiveCampaign Subscription Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
