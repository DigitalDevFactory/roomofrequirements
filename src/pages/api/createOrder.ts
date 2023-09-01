import type { NextApiRequest, NextApiResponse } from 'next';
import { createOrder } from '../api/orders';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const orderInput = req.body;
            const order = await createOrder(orderInput);
            res.status(200).json(order);
        } catch (error : any) {
            console.error("Error in createOrder API route:", error); // Added for better debugging
            res.status(500).json({ error: 'Unable to create order.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
};

