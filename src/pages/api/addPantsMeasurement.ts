// pages/api/addCustomerData.ts

import { getXataClient } from "../../xata";
import type { NextApiRequest, NextApiResponse } from 'next';

const xata = getXataClient();
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { customerId, measurement } = req.body;

    try {
        const record = await xata.db.customers_pants_measurements.create({
            customer_id: customerId,
            ...measurement,
            date_added: new Date().toISOString(),
        });

        res.status(200).json(record);
    } catch (error :any ) {
        console.error("API Error:", error);  // log the error for more detail
        res.status(500).json({ error: error.message || 'Failed to add data' });
    }
}