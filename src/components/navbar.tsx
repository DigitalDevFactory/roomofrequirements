import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import zIndex from '@mui/material/styles/zIndex';

const Navbar = () => {
    const router = useRouter();

    return (
        <AppBar position="static" sx={{
            // background:"none",
            backgroundColor: "transparent",
            // backgroundImage:,
            // backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(255,255,255,0.1)), url(/assets/bg2.png)`,
            width: "100%",
            minWidth: "100%",
            backgroundSize: 'cover',
            borderBottom: "1px solid rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.1)"
        }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.back()} sx={{}}>
                    <ArrowBackIcon style={{ fontSize: '41px' }} />
                </IconButton>
                <Stack sx={{
                    cursor: 'pointer',
                    userSelect: 'none',
                }}>
                    <Typography
                        variant="h1"
                        component="div"
                        sx={{
                            mt: 2,
                            display: 'flex',
                            fontWeight: 400,
                            flexDirection: 'column',
                            alignItems: 'center',
                            fontFamily: "'PT Serif', serif",
                            color: "white",
                            mx: 'auto',
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
                            color: "white",
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
                        <GroupsRoundedIcon style={{ fontSize: '41px' }} />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
