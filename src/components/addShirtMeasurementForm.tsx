// components/AddShirtMeasurementForm.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Container } from '@mui/material';

const AddShirtMeasurementForm = () => {
  const router = useRouter();
  const { customerId } = router.query;

  const [measurement, setMeasurement] = useState({
    Collar: '',
    XB: '',
    Chest: '',
    Waist: '',
    Length: '',
    SleeveLength: '',
    AroundArm: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addShirtMeasurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, measurement })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Navigate to user profile or show a success message
      } else {
        console.error('Failed to add measurement.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {Object.keys(measurement).map((key) => (
          <div key={key}>
            <label htmlFor={key}>{key}</label>
            <Input
              id={key}
              value={measurement[key]}
              onChange={(e) => setMeasurement({ ...measurement, [key]: e.target.value })}
            />
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
};

export default AddShirtMeasurementForm;
