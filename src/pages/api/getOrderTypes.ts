import type { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '../../xata';  // Adjust path accordingly

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const xata = getXataClient();

        try {
            const orderTypes = await xata.db.order_type.getAll(); // Adjust as necessary if there's more specific fetching logic
            res.status(200).json(orderTypes);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch order types.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
};
