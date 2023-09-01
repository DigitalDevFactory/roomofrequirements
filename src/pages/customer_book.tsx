// roomofrequirements/src/pages/customer_book.tsx

import { useEffect, useState, useContext, useRef } from 'react';
import { getXataClient } from "../xata";
import * as React from 'react';
import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
import { Card, CardHeader, CardBody, CardFooter, Modal, ModalContent, ModalBody, Checkbox, Input, Button, ModalFooter, ModalHeader } from '@nextui-org/react';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from "next/link";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { motion } from "framer-motion";
import { CldUploadWidget } from 'next-cloudinary';
import NavigationBar from '@/components/navbar';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneEnabledOutlinedIcon from '@mui/icons-material/PhoneEnabledOutlined';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { ThemeContext } from '@/styles/ThemeContext';
import CameraEnhanceRoundedIcon from '@mui/icons-material/CameraEnhanceRounded';



import Head from "next/head";
import { GridRow } from '@mui/x-data-grid';
import { CustomerData } from '../types/types';



type ContactForm = {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image_url: string;
    image: File | undefined;
};


const CustomerBook = () => {
    const [contacts, setContacts] = useState<CustomerData[]>([]);
    const [openUploadWidget, setOpenUploadWidget] = useState(false);


    const theme = useContext(ThemeContext);
    const primary = theme.palette.primary.main;



    const [fileToUpload, setFileToUpload] = useState(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }



    function handleFileChange(event : any) {
        const file = event.target.files[0];
        if (file) {
            setFileToUpload(file);
        }
    }

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/getContacts');
            if (response.ok) {
                const data: CustomerData[] = await response.json();
                setContacts(data);
            } else {
                console.error('Failed to fetch contacts.');
            }
        } catch (error) {
            console.error('An error occurred while fetching contacts.', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);



    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredContacts : CustomerData[] = contacts.filter(contact =>
        contact &&
        contact.first_name && contact.last_name &&
        (`${contact.first_name} ${contact.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const [isHovered, setIsHovered] = useState(false);

    const [open, setOpen] = useState(false);
    const [newContact, setNewContact] = useState<ContactForm>({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        image_url: "",
        image: undefined
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewContact(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function handleSubmit() {
        try {
            const formData = new FormData();
            formData.append("first_name", newContact.first_name);
            formData.append("last_name", newContact.last_name);
            formData.append("phone_number", newContact.phone_number);
            formData.append("email", newContact.email);
            formData.append("image_url", newContact.image_url);
            if (newContact.image) {
                formData.append("image", newContact.image);
                console.log("Image:", newContact.image);
            }

            const response = await fetch("/api/addContact", {
                method: "POST",
                body: formData // No need to set the 'Content-Type', browser will handle it due to FormData
            });

            const responseData = await response.json();
            console.log("Response from /api/addContact:", responseData);

            if (!response.ok) {
                throw new Error(responseData.error || "Failed to add contact.");
            }

            setContacts(prev => [...prev, responseData.data]);
            setOpen(false);
            setNewContact({
                first_name: "",
                last_name: "",
                phone_number: "",
                email: "",
                image_url: "",
                image: undefined
            });

            console.log("Successfully added contact!");
            fetchContacts();

        } catch (error : any) {
            console.error("Error while adding contact:", error.message);
        }
    }





    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.6
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: (i: any) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.4, // You can adjust the duration as needed
                ease: "easeInOut" // You can use different easing options
            }
        }),
        hover: {
            scale: "1.01",
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
            borderRadius: '8px',
            transition: {
                duration: 0.3,
                ease: "easeInOut" // You can use different easing options
            }
        }
    };


    return (
        <motion.div style={{
            background: 'transparent',
            overflow: 'auto',
        }}>
            <NavigationBar
                handleMouseEnter={() => setIsHovered(true)}
                handleMouseLeave={() => setIsHovered(false)}
                isHovered={isHovered}
                open={open}
                setOpen={setOpen}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                filteredContacts={filteredContacts} />
            <Container sx={
                {
                    // mt: 7,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }
            }>
            </Container>

            <Modal className='text-black' isOpen={open} onOpenChange={() => setOpen(false)} placement="top-center">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-black">Add New Contact</ModalHeader>
                    <ModalBody>
                        <Input
                            autoFocus
                            label="First Name"
                            // placeholder="Enter your first name"
                            name="first_name"
                            value={newContact.first_name}
                            onChange={handleChange}
                            variant="bordered"
                            endContent={<AccountCircleOutlinedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        />
                        <Input
                            label="Last Name"
                            // placeholder="Enter your last name"
                            name="last_name"
                            value={newContact.last_name}
                            onChange={handleChange}
                            variant="bordered"
                            endContent={<BadgeOutlinedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        />
                        <Input
                            label="Phone Number"
                            // placeholder="Enter your phone number"
                            name="phone_number"
                            value={newContact.phone_number}
                            onChange={handleChange}
                            variant="bordered"
                            endContent={<PhoneEnabledOutlinedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}

                        />
                        <Input
                            label="Email"
                            // placeholder="Enter your email"
                            name="email"
                            value={newContact.email}
                            onChange={handleChange}
                            variant="bordered"
                            endContent={<MailOutlineIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        />
                        {/* <Input
                            label="Image URL"
                            // placeholder="Enter image URL"
                            name="image_url"
                            value={newContact.image_url}
                            onChange={handleChange}
                            variant="bordered"
                            endContent={<AddAPhotoOutlinedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        /> */}

                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',

                        }}>
                        <CameraEnhanceRoundedIcon sx={{marginLeft:4, marginRight:3}}/>
                        <input
                        className='block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-blue-700
                        hover:file:bg-blue-100'
                            type="file"
                            src="/images/fitwell_logo.png"
                            // className='button rounded-md'
                            // ref={fileInputRef}
                            // style={{ display: 'none' }}
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target?.files?.[0];
                                if (file) {
                                    setNewContact(prev => ({ ...prev, image: file }));
                                }
                            }}
                        />
                        </div>
                        {/* <Button isIconOnly color="warning" variant="faded" aria-label="Take a photo" onPress={handleFileInputClick}>
                            <CameraEnhanceRoundedIcon />
                        </Button> */}
                        {/* {File.name && <div>Uploaded: {File.name}</div>} */}
                        {/* {filePreview && <img src={filePreview} alt="File preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />} */}


                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={() => setOpen(false)}>
                            Close
                        </Button>
                        <Button color="primary" onPress={handleSubmit}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Grid container spacing={3} sx={{ padding: '20px', justifyContent: 'center', maxWidth: '90%', margin: '0 auto' }}>
                    {filteredContacts
                        .sort((a, b) => a.first_name.localeCompare(b.first_name))
                        .sort((a, b) => a.last_name.localeCompare(b.last_name))
                        .map((contact, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={contact.id}>
                                <motion.div variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap={{ scale: 0.98 }}
                                    custom={index}>
                                    <Link href={`/customer_profile/${contact.id}`}>
                                        <Card
                                            isBlurred={true}
                                            isPressable={true}
                                            className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
                                            shadow="sm"
                                            style={{
                                                boxShadow: '0 0 1px 0 #17226d',
                                                borderRadius: '8px',
                                                width: '100%',
                                                height: '250px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                                padding: '20px',
                                                background: "linear-gradient(127deg, rgba(255,255,255,1) 1%, rgba(255,255,255,0.5) 50%)",
                                            }}
                                        >
                                            <CardHeader
                                                style={{
                                                    marginTop: '8px',
                                                }}>
                                                {
                                                    (contact.image) ? (
                                                        <Avatar
                                                            src={contact.image.url}
                                                            alt="Contact"
                                                            sx={{ width: 92, height: 92, objectFit: 'cover', mx: "auto" }}  // Fixed size and object-fit
                                                        />
                                                    ) : (contact.image_url) ? (
                                                        <Avatar
                                                            src={contact.image_url}
                                                            alt="Contact"
                                                            sx={{ width: 92, height: 92, objectFit: 'cover', mx: "auto" }}  // Fixed size and object-fit
                                                        />
                                                    ) : (
                                                        <Avatar sx={{ width: 92, height: 92, marginBottom: '8px', mx: "auto" }}>  {/* Fixed size */}
                                                            {`${contact.first_name[0]}${contact?.last_name[0]}`}
                                                        </Avatar>
                                                    )
                                                }
                                            </CardHeader>

                                            <CardContent
                                                style={{
                                                    marginTop: '-7px',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}>
                                                    {`${contact.first_name.charAt(0).toUpperCase()}${contact.first_name.slice(1).toLowerCase()}`} <br />
                                                    {contact.last_name.toUpperCase()}<br />
                                                    {contact.phone_number}<br />
                                                    {contact.email}
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                    </Link>
                                </motion.div>
                            </Grid>
                        ))}
                </Grid>
            </motion.div>
        </motion.div >
    );
};

export default CustomerBook;


// // old card style : 
// style={{
//     boxShadow: '0 0 1px 0 #17226d',
//     borderRadius: '8px',
//     height: '200px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     background: "linear-gradient(127deg, rgba(255,255,255,1) 1%, rgba(255,255,255,0.5) 50%)",
//     // boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
//     // padding: '16px 4px 16px'
// }}