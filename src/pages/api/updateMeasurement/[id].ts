// updateMeasurement/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from '@/xata'; // Adjust the import based on your folder structure

const xata = getXataClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { id } = req.query; // Extract the ID from the request query
    const updatedData = req.body; // This will have the updated data
    const currentDate = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD
    

    const fieldsToExtract = [
        'Waist', 'Hip', 'Length', 'Knee', 'Bottom',
        'Genou', 'FR', 'Jambe', 'Mollet',
        'Plis', 'Revers', 'Buckle', 'date_added'
    ];

    // 2. Extract only those fields from req.body
    const dataToSend = fieldsToExtract.reduce((obj, key) => {
        if (req.body[key]) {
            obj[key] = req.body[key];
        }
        return obj;
    }, {} as Record<string, any>); // <-- type assertion here
    

    try {
        // Update the measurement in the database with the selected fields
        const result = await xata.db.customers_pants_measurements.update(id as string, dataToSend);
        console.log("Incoming data to update:", dataToSend);

        if (!result) {
            return res.status(404).json({ message: 'Measurement not found.' });
        }

        console.log("Updated measurement:", result);
        return res.status(200).json({ message: 'Measurement updated successfully.', record: result });

    } catch (error) {
        console.error("Error updating measurement with Xata:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}
