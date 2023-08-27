import { getXataClient } from "../../xata"; // adjust the import path if needed
const xata = getXataClient();

// Function to fetch customer data by ID
export async function fetchCustomerData(customerId: string) {
    return await xata.db.contacts.read(customerId);
}

// // Function to fetch pants data for a specific customer
// export async function fetchPantsData(customerId: string) {
//     const customerPantsData = await xata.db.customers_pants_measurements.read(customerId); 
//     return customerPantsData;

// }
