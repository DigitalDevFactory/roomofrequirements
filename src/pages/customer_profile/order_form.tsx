import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FormControl, InputLabel, Select, MenuItem, TextField, Collapse, Button } from '@mui/material';
import { Order } from './order_table';
import { on } from 'events';

interface OrderFormProps {
    onOrderSaved: (order: Order) => void;
    toggleView: () => void;
    refreshOrders: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ toggleView, refreshOrders }) => {
    const [orderType, setOrderType] = useState('');
    const [orderName, setOrderName] = useState('');
    const [availableOrderTypes, setAvailableOrderTypes] = useState([]);

    useEffect(() => {
        const fetchOrderTypes = async () => {
            try {
                const response = await fetch('/api/getOrderTypes');
                const data = await response.json();
                setAvailableOrderTypes(data);
            } catch (error) {
                console.error('Error fetching order types:', error);
            }
        };

        fetchOrderTypes();
    }, []);

    const router = useRouter();
    const customerId = router.query.id;


    const handleSaveOrder = async () => {
        // Collect data from the form fields
        const orderData = {
            order_name: orderName,
            contact: customerId,
            // order_type: orderType,
            // ... other fields
        };

        try {
            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Order saved:', result);
            await refreshOrders();
            toggleView();


        } catch (error) {
            console.error('Error saving order:', error);
        }
    };


    console.log('Saving order...');



    return (
        <div>
            <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                    value={orderType}
                    onChange={(event) => setOrderType(event.target.value)}
                    label="Type"
                >
                    {availableOrderTypes.map(type => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.type_name}  {/* or whatever the field is called */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth margin="normal" variant="outlined"
                label="Order Name"
                value={orderName}
                onChange={(event) => setOrderName(event.target.value)}
            />
            {/* ... Other TextFields for Cloth Reference, Quantity, etc ... */}

            <Collapse in={orderType === 'pants'}>
                {/* Specific options for Pants go here */}
            </Collapse>

            <Collapse in={orderType === 'shirts'}>
                {/* Specific options for Shirts go here */}
            </Collapse>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveOrder}

                style={{ marginTop: '20px' }}
            >
                Save Order
            </Button>
        </div>
    );
}



export default OrderForm;

