// pages/api/getCustomerData.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '../../xata';

const xata = getXataClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        // Assuming that the customer ID will be passed as a query parameter, e.g., /api/getCustomerData?id=123
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Customer ID is required.' });
        }

        try {
            // Fetch customer data
            const customer = await xata.db.contacts.read(id as string);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found.' });
            }

            const pantsMeasurements = await xata.db.customers_pants_measurements
                .select(["id", "customer_id", "Waist", "Knee", "FR", "Hip", "Jambe", "Genou", "Length", "Mollet", "Bottom",  "date_added", "xata.createdAt" as any, "xata.updatedAt" as any])
                .filter({ customer_id: id as string })
                .getAll();

            const shirtsMeasurements = await xata.db.customers_shirts_measurements
                .select(["id", "customer_id", "Collar", "XB", "Chest", "Waist", "Length", "Sleeve_length", "Around_arm", "date_added", "xata.createdAt" as any, "xata.updatedAt" as any])
                .filter({ customer_id: id as string })
                .getAll();


            // Return combined data
            console.log('Customer data:', customer);
            console.log('Pants measurements:', pantsMeasurements);
            console.log('Shirts measurements:', shirtsMeasurements);
            res.status(200).json({ customer, pantsMeasurements, shirtsMeasurements});

        } catch (error) {
            console.error('Xata error:', error);
            res.status(500).json({ error: 'Failed to fetch customer data.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
};
