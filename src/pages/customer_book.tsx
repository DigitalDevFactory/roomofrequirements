// roomofrequirements/src/pages/customer_book.tsx

import { useEffect, useState } from 'react';
import { getXataClient } from "../xata";
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from "next/link";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { motion } from "framer-motion";
import { CldUploadWidget } from 'next-cloudinary';
import Navbar from '@/components/navbar';






import Head from "next/head";

type Contact = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image_url: string;
    image: File | null;
};


type ContactForm = {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image_url: string;
    image: File | null;
};


const CustomerBook = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [openUploadWidget, setOpenUploadWidget] = useState(false);

    const [fileToUpload, setFileToUpload] = useState(null);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }



    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setFileToUpload(file);
        }
    }

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/getContacts');
            if (response.ok) {
                const data: Contact[] = await response.json();
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

    const filteredContacts = contacts.filter(contact =>
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

        } catch (error) {
            console.error("Error while adding contact:", error.message);
        }
    }



    async function handleSubmit_old() {
        try {
            // Now send the contact data, with the image URL, to the server.
            const response = await fetch("/api/addContact", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...newContact })
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

        } catch (error) {
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
            <Navbar />
            <Container sx={
                {
                    mt: 7,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                }
            }>

                <TextField
                    label="Search Contacts"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{
                        flexGrow: 1,
                        // mt:5,
                        // my: 3,
                        mr: 2,
                        background: '#f9f9f9',
                        borderRadius: '5px'
                    }}
                />

                <motion.div
                    initial={{ scale: 1, opacity: 1 }}
                    transition={{ ease: "easeOut", duration: 2 }}
                >
                    <Button
                        className='px-6 text-base font-bold hover:font-normal text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br 
                            focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg
                             shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80
                            rounded-lg  text-center mr-2'
                        variant="contained"
                        // color="primary"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setOpen(true)}
                        sx={{
                            //  color: '#17226d',
                            fontFamily: "'PT Serif', serif",
                            fontSize: '24px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '12%',
                            transition: 'width 0.5s', // Specifically target the width for transition
                            '&:hover': {
                                fontFamily: "'PT Serif', serif",
                                width: '140px', // Set a fixed width on hover
                                fontSize: '16px',
                                color: "white",
                                background: '#17226d',
                            }
                        }}
                    >
                        {isHovered ? 'Add a Contact' : '+'}
                    </Button>
                </motion.div>
            </Container>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="first_name"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={newContact.first_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="last_name"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={newContact.last_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="phone_number"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        value={newContact.phone_number}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={newContact.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="image_url"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={newContact.image_url}
                        onChange={handleChange}
                    />
                    {/* Let's add an input field to upload an image */}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target?.files?.[0];
                            if (file) {
                                setNewContact(prev => ({ ...prev, image: file }));
                            }
                        }}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Grid container spacing={3} sx={{ padding: '20px', justifyContent: 'center', maxWidth: '90%', margin: '0 auto' }}>
                    {filteredContacts
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
                                        <Card variant="outlined"
                                            sx={{
                                                boxShadow: '0 0 1px 0 #17226d',
                                                borderRadius: '8px',
                                                height: '200px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                background: "linear-gradient(127deg, rgba(255,255,255,1) 1%, rgba(255,255,255,0.5) 50%)",
                                                // boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                                                // padding: '16px 4px 16px'
                                            }}>
                                            <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                                                <Avatar src={!contact.image ? contact.image_url : contact.image.url} sx={{ marginBottom: '8px', mx: "auto" }}>
                                                    {(!contact.image_url && contact.first_name) ? contact.first_name[0] + contact.last_name[0] : ''}
                                                </Avatar>
                                                <Typography variant="h6">
                                                    {contact.first_name.charAt(0).toUpperCase() + contact.first_name.slice(1).toLowerCase()} <br></br>
                                                    {contact.last_name.toUpperCase()}
                                                </Typography>
                                                <Typography variant="subtitle1" noWrap>{contact.phone_number}</Typography>
                                                <Typography variant="body2" noWrap>{contact.email}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            </Grid>
                        ))}
                </Grid>
            </motion.div>
        </motion.div>
    );
};

export default CustomerBook;