import { NextApiRequest, NextApiResponse } from 'next';
import { fetchCustomerData } from '../getCustomerProfile';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { customerId } = req.query;

  try {
    const customer = await fetchCustomerData(customerId as string);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer data.' });
  }
};
