import { AppBar, Toolbar, IconButton, TextField } from '@mui/material';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Input,
    Button
} from "@nextui-org/react";
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '@/styles/ThemeContext';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import zIndex from '@mui/material/styles/zIndex';
import FitwellLogo from './FitwellLogo';
import SearchIcon from '@mui/icons-material/Search';
// import { Contact } from '@/pages/customer_book';
import { CustomerData } from '@/types/types';


export interface NavigationBarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isHovered?: boolean;
    searchTerm?: string;
    handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredContacts?: CustomerData[];
    handleMouseEnter?: () => void;
    handleMouseLeave?: () => void;
}


const NavigationBar: React.FC<NavigationBarProps> = ({ filteredContacts,
    searchTerm,
    handleSearchChange,
    open,
    setOpen, isHovered,
    handleMouseEnter,
    handleMouseLeave, }) => {
    const router = useRouter();
    const isMenuOpen = false;
    const theme = useContext(ThemeContext);
    const primary = theme.palette.primary.main;

    const [isOpen, setIsOpen] = useState(false);


    // const [searchTerm, setSearchTerm] = useState<string>("");
    // const [filteredContacts, setFilteredContacts] = useState(contacts);
    // const [contacts, setContacts] = useState<Contact[]>([]);






    return (

        <Navbar height={14}
            className='w-full min-w-full max-w-full'
        >
            <NavbarBrand
                onClick={() => router.push('/customer_book')}
                className='w-auto'
                style={{
                    cursor: 'pointer',
                }}>
                <FitwellLogo />
            </NavbarBrand>

            {!router.pathname.endsWith("customer_book") ? (
                <IconButton sx={{ color: primary }} aria-label="back" onClick={() => router.push('/customer_book')}>
                    <GroupsRoundedIcon sx={{ color: primary }} style={{ fontSize: '41px' }} />
                </IconButton>

            )
                :
                (
                    <NavbarItem as="div" className="items-center w-full">
                        <Input
                            className='w-1/2 mx-auto'
                            placeholder="Search contacts"
                            size="lg"
                            value={searchTerm}
                            startContent={<SearchIcon />}
                            type="search"
                            onChange={handleSearchChange}
                        />
                    </NavbarItem>



                )
            }
            {router.pathname.endsWith("customer_book") ?
                <NavbarItem
                    style={{
                        display: 'flex', flexDirection: "row-reverse", marginRight: '7%', maxWidth: '8%', minWidth: '8%'
                    }}>


                    <Button
                        isIconOnly
                        className="
                        w-auto 
                        p-4
                        mx-auto
                        bg-gradient-to-tr 
                        from-blue-800 
                        to-blue-500 
                        via-blue-400
                        rounded-full
                        text-white 
                        shadow-lg"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => setOpen(true)}
                    >
                        {isHovered ? "Add a new contact" : "+"}
                    </Button>
                </NavbarItem>
                : null}
        </Navbar >
        // </>
    );
};

export default NavigationBar;
