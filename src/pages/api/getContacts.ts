// pages/api/getContacts.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '../../xata';

const xata = getXataClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const records = await xata.db.contacts
                .select([
                    "id",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "email",
                    "image_url",
                    "image"
                ])
                .getAll();

            res.status(200).json(records);
        } catch (error) {
            console.error('Xata error:', error);  // Log the actual error message to the server console
            res.status(500).json({ error: 'Failed to fetch contacts.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
};
