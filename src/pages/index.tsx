import CustomerBook from './customer_book'
import Container from '@mui/material/Container';
import Navbar from '@/components/navbar';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from '@/styles/ThemeProvider';

export default function Home() {
  
  return (
    <>
      <ThemeProvider>
        {/* <NextUIProvider> */}
          <CustomerBook />
        {/* </NextUIProvider> */}
      </ThemeProvider>
    </>
  )
}
