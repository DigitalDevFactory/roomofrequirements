// Path: src\pages\addMeasurementForm\[customerId]\[item].tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { getXataClient } from '@/xata';
import { Input, InputLabel, Container, Card, CardContent, Button, Grid, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { useEffect } from 'react';
import { fetchCustomerData } from '@/pages/api/getCustomerProfile';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar';
import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter';
import { MeasurementField, MeasurementFields, CustomerData } from './../../types';  // Adjust the path as needed
import NavigationBar from '@/components/navbar';



const AddMeasurementForm = () => {
  type ItemType = keyof MeasurementFields;

  const router = useRouter();
  const { customerId, item } = router.query;
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const measurementFields = {
    pants: {
      Waist: '',
      Hip: '',
      Length: '',
      Knee: '',
      Bottom: '',
      Genou: '',
      FR: '',
      Jambe: '',
      Mollet: '',
      Plis: false,
      Revers: false,
      Buckle: false,
    },
    shirts: {
      Collar: '',
      XB: '',
      Chest: '',
      Waist: '',
      Length: '',
      Sleeve_length: '',
      Around_arm: ''
    },
    // ... other item types if needed
  };

  let initialMeasurement: MeasurementField = {};

  if (typeof item === 'string' && item in measurementFields) {
    initialMeasurement = measurementFields[item as ItemType];
  }

  const [measurement, setMeasurement] = useState<MeasurementField>(initialMeasurement);


  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${customerId}`);
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error('Error fetching customer:', error);
      }
    };
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);



  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (typeof item === 'string') {

      try {
        const response = await fetch(`/api/add${capitalizeFirstLetter(item)}Measurement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId as string,
            measurement: measurement,
          }),
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    };
  }

  return (
    <>
      <NavigationBar open={false} setOpen={function (open: boolean): void {
        throw new Error('Function not implemented.');
      }} />
      <Card sx={{
        p: 3,
        borderRadius: 2,
        my: 4,
        mx: 2,
      }}>
        <form onSubmit={handleSubmit}>
          <Typography variant='h2' className="text-center text-xl mx-4 mt-4 mb-8 font-bold">
            {customer ? `Add ${item} measurements for ${customer.first_name} ${customer.last_name}` : 'Loading customer...'}
          </Typography>
          <Grid container spacing={3}>
            {Object.keys(measurement).map((key) => {
              if (typeof measurement[key] === 'boolean') {
                return (
                  <Grid item xs={4} key={key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={measurement[key]}
                          onChange={(e) => setMeasurement({ ...measurement, [key]: e.target.checked })}
                        />
                      }
                      label={key}
                    />
                  </Grid>
                );
              }
              return (
                <Grid item xs={4} key={key}>
                  <TextField
                    fullWidth
                    label={key}
                    type="number"
                    value={measurement[key]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setMeasurement({ ...measurement, [key]: isNaN(value) ? '' : value });
                    }}
                    variant="outlined"
                  />
                </Grid>
              );
            })}
          </Grid>

          <Container sx={{
            borderRadius: 2,
            my: 4,
            px: 4,
            py: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            // position: "relative",
            mx: "auto",
          }}>
            <motion.div
              style={{ display: 'inline-block', overflow: 'hidden', borderRadius: 4 }} // Using inline-block to wrap content
              initial={{ opacity: 0, y: -10 }}   // Slightly moved up for a slide-in effect
              animate={{ opacity: 1, y: 0 }}     // Return to its original position
              exit={{ opacity: 0 }}              // Fade out on exit (if you are using page transitions)
              whileHover={{ scale: 1.1, boxShadow: "0 5px 10px rgba(0, 0, 0, 0.3)" }}  // Slightly larger scale and shadow for a lift effect
              whileTap={{ scale: 0.95 }}         // Slightly reduce in size when tapped/clicked for a press effect
              transition={{ duration: 0.3 }}     // Smooth transition
              onClick={() => router.push(`/customer_profile/${customerId}`)}
            >
              <Button type="submit" className="p-2 bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50">
                Submit
              </Button>
            </motion.div>
          </Container>
        </form>
      </Card>
    </>
  );
};
export default AddMeasurementForm;
