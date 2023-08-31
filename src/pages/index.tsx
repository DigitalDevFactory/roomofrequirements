import CustomerBook from './customer_book'
import Container from '@mui/material/Container';
import Navbar from '@/components/navbar';

export default function Home() {
  return (
    <Container sx={{
      width: '100%',
      minWidth: '100%',
      maxWidth: '100%'
    }} >
      <CustomerBook />
    </Container>
  )
}
