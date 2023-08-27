// pages/api/addShirtMeasurement.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '@/xata';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { customerId, measurement } = req.body;
        const xata = getXataClient();

        try {
            const newMeasurement = await xata.db.customers_shirts_measurements.create({
                customer_id: customerId,
                ...measurement,
                date_added: new Date().toISOString()
            });
            res.status(200).json(newMeasurement);
        } catch (error) {
            //   res.status(500).json({ error: 'Failed to add measurement.' });
            res.status(500).json({ error: error.message || 'Failed to add data' });

        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}
