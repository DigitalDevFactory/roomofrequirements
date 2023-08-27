// Generated with CLI
import { NextApiRequest, NextApiResponse } from 'next';
import { getXataClient } from "@/xata";

const xata = getXataClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { first_name, last_name, phone_number, email, image_url } = req.body;
      console.log("Received in API route:", { first_name, last_name, phone_number, email, image_url });
      
      if (!first_name || !last_name || !phone_number || !email) {
        return res.status(400).json({ error: 'Required fields are missing.' });
      }

      const record = await xata.db.contacts.create({
        first_name,
        last_name,
        phone_number,
        email,
        image_url,
      });

      return res.status(201).json(record);

    } catch (error) {
      return res.status(500).json({ error: 'Failed to add contact.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' }); // Only POST method is allowed
  }
}
