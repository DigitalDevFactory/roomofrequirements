import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const Navbar = () => {
    const router = useRouter();

    return (
        <AppBar position="static">
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.back()}>
                    <ArrowBackIcon />
                </IconButton>
                <Stack sx={{
                    cursor: 'pointer',
                    userSelect: 'none',
                }}>
                <Typography
                    variant="h1"
                    component="div"
                    sx={{
                        mt: 5,
                        display: 'flex',
                        fontWeight: 600,
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontFamily: "'PT Serif', serif",
                        // color: '#17226d',
                        color:"white",
                        mx: 'auto',
                        mt: 2,
                    }}
                >
                    Fitwell </Typography>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 300,
                        // color: '#17226d',
                        color:"white",
                        mb: 3
                    }}
                >
                    Haute Couture</Typography>

                    </Stack>


                <div>
                    {/* <Button color="inherit" onClick={() => router.push('/customer_book')}>
                       < 
                        Customer Book
                    </Button> */}
                 <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push('/customer_book')}>
                    <GroupsRoundedIcon />
                </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
