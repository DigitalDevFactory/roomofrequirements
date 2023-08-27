// pages/api/getCustomerPants.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '../../xata';

const xata = getXataClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const customerId = req.query.customerId;

    if (req.method === 'GET' && customerId) {
        try {
            const pantsData = await xata.db.customers_pants_measurements.read(customerId as string);
            res.status(200).json(pantsData);
        } catch (error) {
            console.error('Xata error:', error);  // Log the error to the server console
            res.status(500).json({ error: 'Failed to fetch pants data.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed or missing customerId.' });
    }
};
