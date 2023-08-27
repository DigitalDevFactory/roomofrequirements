import { getXataClient } from "../../../xata"  // Adjust the import path accordingly
const xata = getXataClient();

export interface OrderInput {
    contact: string;
    order_name: string;
    cloth_reference: string;
    notes: string;
    quantity: number;
    color: string;
    price: number;
}

export const createOrder = async (orderInput: OrderInput) => {
    try {
        const record = await xata.db.orders.create(orderInput);
        return record;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Add other functions like getOrders, updateOrder, deleteOrder as needed.
