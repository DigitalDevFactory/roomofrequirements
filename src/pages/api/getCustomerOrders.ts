import type { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '../../xata';  // Adjust path accordingly

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        const customerId = req.query.customerId as string;  // Extract customer ID from query
        const xata = getXataClient();

        try {
            const records = await xata.db.orders
                .select([
                    "id",
                    "order_name",
                    "notes",
                    "quantity",
                    "color",
                    "price",
                    "contact.id",
                    "contact.first_name",
                    "contact.last_name",
                    "contact.phone_number",
                    "contact.email",
                    "contact.image_url",
                    "cloth_reference.id",
                ])
                .getAll();

            // Filter orders by customer ID
            const customerOrders = records.filter(order => order.contact && order.contact.id === customerId);

            res.status(200).json(customerOrders);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch orders.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
};
