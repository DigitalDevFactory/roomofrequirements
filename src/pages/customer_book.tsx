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
};



const CustomerBook = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [openUploadWidget, setOpenUploadWidget] = useState(false);




    const handleImageUpload = (image) => {
        console.log("Uploaded image:", image); // You can inspect the full image object if needed
        setNewContact(prev => ({ ...prev, image_url: image.secure_url }));
        setOpenUploadWidget(false);
    };


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
    const [newContact, setNewContact] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        image_url: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewContact(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    async function handleSubmit() {
        try {
            const response = await fetch("/api/addContact", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newContact)
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
                image_url: ""
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
        visible: (i: any) => ({ y: 0, opacity: 1, transition: { delay: i * 0.1 } }), // i is the index
        hover: { scale: 1.1, transition: { duration: 0.2 } }
    };


    return (
        <motion.div style={{
            background: '#f9f9f9',
        }}>
            <Navbar />
            <Container sx={
                {
                    mt: 5,
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
                        variant="contained"
                        // color="primary"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setOpen(true)}
                        sx={{
                            color: '#17226d',
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
                    {/* <CldUploadWidget
                        uploadPreset="kgewihl7"
                        onComplete={handleImageUpload}
                        open={openUploadWidget}
                        onClose={() => setOpenUploadWidget(false)}
                    >
                        {({ open }) => (
                            <Button onClick={() => setOpenUploadWidget(true)}>
                                Upload an Image
                            </Button>
                        )}
                    </CldUploadWidget> */}


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
                            <Grid item xs={12} sm={6} md={3} key={contact.id}>
                                <motion.div variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
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
                                                // padding: '16px 4px 16px'
                                            }}>
                                            <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                                                <Avatar src={contact.image_url} sx={{ marginBottom: '8px', mx: "auto" }}>
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