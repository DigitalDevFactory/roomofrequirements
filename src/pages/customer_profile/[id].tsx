import { useEffect, useState, useRef } from 'react';
import {
    Card, CardContent, Tabs, Tab, Table,
    TableHead, TableRow, TableCell, TableBody, Container, Avatar, Typography, Select, MenuItem,
    FormControl, InputLabel, Input, FormHelperText, Button, Modal, Menu, IconButton, Collapse, TextField
} from '@mui/material';
import { formatDate } from '@/utils/formatDate';
import { color } from 'framer-motion';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { SelectChangeEvent } from '@mui/material';
import Navbar from '@/components/navbar';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import OrderForm from './order_form';
import OrderTable, { Order } from './order_table';
import AddIcon from '@mui/icons-material/Add';
import TocIcon from '@mui/icons-material/Toc';





export type CustomerData = {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image_url: string;
};
//.select(["id", "customer_id", "Waist", "Knee", "FR", "Hip", "Jambe", "Genou", "Length", "date_added"])

type Xata = {
    createdAt: string;
    // Add any other fields of 'xata' here
};

type shirtsMeasurements = {
    id: string;
    date_added: string;
    Collar: number;
    XB: number;
    Chest: number;
    Waist: number;
    Length: number;
    Sleeve_length: number;
    Around_arm: number;
    xata: Xata;
    // ... other shirt measurement fields
};

type pantsMeasurements = {
    id: string;
    date_added: string;
    Waist: number;
    Hip: number;
    Knee: number;
    FR: number;
    Jambe: number;
    Genou: number;
    Length: number;
    Bottom: number;
    Mollet: number;
    xata: Xata;
    // ... other pants measurement fields
};

type RowStateType = {
    [key: string]: {
        isEditable: boolean;
        isUpdated: boolean;
    };
};

interface CustomerProfileProps {
    customer: CustomerData;
    pantsMeasurements: pantsMeasurements[];
    shirtsMeasurements: shirtsMeasurements[];
}



interface MeasurementsTableProps {
    customer: CustomerData;
    measurements: any[];
    headers: string[];
    formatRow: (row: any) => JSX.Element[];
}



const MeasurementsTable: React.FC<MeasurementsTableProps> = ({ customer, measurements, headers, formatRow }) => {
    const initialRowValues = useRef({});
    const [rowState, setRowState] = useState<{ [key: string]: { isEditable: boolean; }; }>({});
    const [editedRows, setEditedRows] = useState<any>({});
    const [editedCellsState, setEditedCellsState] = useState<{ [key: string]: { [key: string]: any } }>({});

    const router = useRouter();
    // const editedRow = editedRows[row.id] || {};

    const customerid = customer.id;

    // Create columns from headers
    const columns = headers.map((header) => ({
        field: header,
        type: 'number',
        headerName: header,
        // width: 115,
        flex: 1, // Adjust width based on your design requirements
        headerAlign: 'center',
        align: 'center',
        editable: (params) => rowState[params.id]?.isEditable || false

    }));

    columns.push({
        field: 'actions',
        headerName: 'Actions',
        renderCell: (params) => actionButtons(params.row),
        flex: 1, // Adjust width based on your design requirements
        editable: false
    });




    const handleEditClick = (row: any) => {
        console.log("Edit row:", row.id);
        setRowState((prevState) => ({
            ...prevState,
            [row.id]: {
                ...prevState[row.id],
                isEditable: true
            }
        }));
        initialRowValues.current = JSON.parse(JSON.stringify(row));
        console.log("Initial row values:", initialRowValues.current);
    };

    const handleCellEdit = (params: any) => {
        const id = params.id;
        const field = params.field;
        const newValue = params.props.value;

        setEditedCellsState(prevState => ({
            ...prevState,
            [id]: {
                ...(prevState[id] || {}),
                [field]: newValue
            }
        }));
    };

    const handleSaveClick = async (row: any) => {
        const editedRow = editedRows[row.id] || {};

        // Start with the edited values and transform fields that should be numbers
        const updatedRow = Object.keys(editedRow).reduce((acc, field) => {
            const newValue = editedRow[field];
            const oldValue = initialRowValues.current[field];

            // If the original value was a number, attempt to convert the edited value to a number
            if (typeof oldValue === 'number' && !isNaN(Number(newValue))) {
                acc[field] = Number(newValue);
            } // else case is not needed, since the starting value in acc is already the string value from editedRow

            return acc;
        }, { ...editedRow }); // start with a shallow copy of the editedRow as our accumulator

        console.log("Original row:", row);

        try {
            const response = await fetch(`/api/updateMeasurement/${row.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(row)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            console.log("Measurement updated successfully!", "Updated row:", data.record);


            setRowState((prevState) => ({
                ...prevState,
                [row.id]: {
                    ...prevState[row.id],
                    isEditable: false,
                    isUpdated: true
                }
            }));


            setTimeout(() => {
                setRowState((prevState) => ({
                    ...prevState,
                    [row.id]: {
                        ...prevState[row.id],
                        isUpdated: false
                    }
                }));
            }, 3000);

            router.push(`/customer_profile/${customerid}`);



        } catch (error) {
            console.error("Failed to update measurement:", error.message);
        }
    };



    const actionButtons = (row: any) => {

        const isEditable = rowState[row.id]?.isEditable || false;
        const isUpdated = rowState[row.id]?.isUpdated || false;

        return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {

                    isUpdated ? (
                        <span style={{ color: 'green' }}>✔</span>
                    ) :
                        isEditable ? (
                            <IconButton onClick={() => handleSaveClick(row)} size="small">
                                <SaveIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            <IconButton onClick={() => handleEditClick(row)} size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )
                }

                <IconButton onClick={() => handleDeleteClick(row.id)} size="small"> {/* I'm assuming handleDeleteClick based on your use of DeleteIcon */}
                    <DeleteIcon fontSize="small" />
                </IconButton>
                {/* Add more buttons or logic as needed */}
            </div>
        );
    };

    // Map measurements to rows for DataGrid
    const rows = measurements.map((row) => {
        const formattedRow = formatRow(row);
        const rowData: { [key: string]: any; id: string | number; } = { id: row.id };

        headers.forEach((header, idx) => {
            rowData[header] = formattedRow[idx];
        });

        return rowData;
    });




    return (
        <div style={{ height: '100%', width: '100%' }}> {/* Set height & width as per your requirements */}
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                checkboxSelection={false}
                onEditCellChangeCommitted={handleCellEdit}
            />
        </div>
    );
};







const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, pantsMeasurements, shirtsMeasurements }) => {
    const [tabValue, setTabValue] = useState<string>('pants');
    // const [selectedMeasurement, setSelectedMeasurement] = useState('');
    const router = useRouter();
    const [measurementType, setMeasurementType] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState(null);
    // const [tableVersion, setTableVersion] = useState(0);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`/api/getCustomerOrders?customerId=${customerId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const ordersData: Order[] = await response.json();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    const toggleShowOrderForm = () => {
        setShowOrderForm(prev => !prev);
    }

    const customerId = router.query.id;

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch(`/api/getCustomerOrders?customerId=${customerId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const ordersData: Order[] = await response.json();
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        fetchOrders();
    }, [customerId]);



    const handleMeasurementChange = (value: SelectChangeEvent) => {
        const selectedValue = value as number;
        console.log('Selected value:', selectedValue);
        setMeasurementType(selectedValue); // <-- Ensure this is here

        switch (selectedValue) {
            case '1':
                router.push(`/addMeasurementForm/${customer.id}/pants`);
                break;
            case '2':
                router.push(`/addMeasurementForm/${customer.id}/shirts`);
                break;
            case '3':
                router.push(`/addMeasurementForm/${customer.id}/suits`);
                break;
            default:
                break;
        }

    };


    useEffect(() => {
        console.log('Customer data:', customer);
        console.log('Pants data:', pantsMeasurements);
        console.log('Shirt data:', shirtsMeasurements);
    }
        , [customer]);




    let displayedMeasurements = [];
    let tableHeaders = [];
    let rowFormatter;

    switch (tabValue) {
        case 'pants':
            displayedMeasurements = pantsMeasurements || [];
            tableHeaders = ["Date", "Waist", "Hip", "Knee", "FR", "Jambe", "Genou", "Length", "Mollet", "Bottom"];  // ... add other headers
            // tableHeaders = [...tableHeaders, "Actions"]
            rowFormatter = (row: typeof pantsMeasurements[0]) => [
                formatDate(row.xata.createdAt),
                row.Waist,
                row.Hip,
                row.Knee,
                row.FR,
                row.Jambe,
                row.Genou,
                row.Length,
                row.Mollet,
                row.Bottom,
                // ... other cells
            ];
            break;

        case 'shirts':
            displayedMeasurements = shirtsMeasurements || [];
            tableHeaders = ["Date", "Collar", "XB", "Chest", "Waist", "Length", "Sleeve Length", "Around Arm"];  // ... add other headers
            rowFormatter = (row: typeof shirtsMeasurements[0]) => [
                formatDate(row.xata.createdAt),
                row.Collar,
                row.XB,
                row.Chest,
                row.Waist,
                row.Length,
                row.Sleeve_length,
                row.Around_arm
                // ... other cells
            ];
            break;

        default:
            break;
    }

    const tableConfigurations = {
        pants: {
            headers: ["Date", "Waist", "Hip", "Knee", "FR", "Jambe", "Genou", "Length", "Mollet", "Bottom"],
            data: pantsMeasurements,
            formatter: (row: typeof pantsMeasurements[0]) => [
                formatDate(row.xata.createdAt),
                row.Waist,
                row.Hip,
                row.Knee,
                row.FR,
                row.Jambe,
                row.Genou,
                row.Length,
                row.Mollet,
                row.Bottom,
                // actionButtons(row)
            ]
        },
        shirts: {
            headers: ["Date", "Collar", "XB", "Chest", "Waist", "Length", "Sleeve Length", "Around Arm"],
            data: shirtsMeasurements,
            formatter: (row: typeof shirtsMeasurements[0]) => [
                formatDate(row.xata.createdAt),
                row.Collar,
                row.XB,
                row.Chest,
                row.Waist,
                row.Length,
                row.Sleeve_length,
                row.Around_arm
            ]
        }
    };

    console.log("Is handleNewOrder a function?", typeof handleNewOrder === "function");





    return (
        <>            <Navbar />

            <Container sx={{
                minWidth: '100%',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, // creates two columns of equal width
                gridTemplateRows: 'auto auto',  // creates two rows, each with automatic height
                gap: 5,  // spacing between grid items
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.paper',
                padding: 2,
                innerHeight: '100%',

                // minWidth: '100%',

            }}>
                {/* Customer Info Card */}
                {customer && (
                    <Card sx={{
                        minHeight: 430,
                        maxHeight: 430,
                        gridColumn: { xs: '1', md: '1' },
                        justifyContent: 'center',
                        textAlign: 'center',
                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                        borderRadius: 5,
                        mx: 'auto',
                        width: '80%',
                    }}>
                        <CardContent>
                            <Avatar src={customer.image_url} sx={{ mt: 2, height: '92px', width: '92px', marginBottom: '8px', mx: "auto" }}>
                                {(!customer.image_url && customer.first_name) ? customer.first_name[0] + customer.last_name[0] : ''}
                            </Avatar>
                            <Typography
                                variant='h4'
                                sx={{
                                    textAlign: 'center',
                                    mt: 3,
                                    px: 3,
                                    color: '#000000'
                                }}
                            >{customer.first_name} <br></br> {customer.last_name}
                            </Typography>
                            <Typography
                                // variant='regular'
                                sx={{
                                    textAlign: 'center',
                                    mt: 1,
                                    px: 3,
                                    color: 'black'
                                }}
                            >{customer.phone_number}
                            </Typography>
                            <Typography
                                // variant='regular'
                                sx={{
                                    textAlign: 'center',
                                    px: 3,
                                    color: 'black'
                                }}
                            >{customer.email}
                            </Typography>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    sx={{
                                        color: 'primary',
                                        borderRadius: 12,
                                        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                                        marginTop: 3,
                                        marginBottom: 3,
                                        p: 3
                                    }}
                                    onClick={(event) => setAnchorEl(event.currentTarget)}
                                >
                                    Add measurements
                                </Button>
                            </motion.div>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={() => { setAnchorEl(null); handleMeasurementChange(""); }}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem onClick={() => { setAnchorEl(null); handleMeasurementChange("1"); }}>
                                    Pants
                                </MenuItem>
                                <MenuItem onClick={() => { setAnchorEl(null); handleMeasurementChange("2"); }}>
                                    Shirts
                                </MenuItem>
                                <MenuItem onClick={() => { setAnchorEl(null); handleMeasurementChange("3"); }}>
                                    Suits
                                </MenuItem>
                            </Menu>
                        </CardContent>
                    </Card>

                )
                }


                <Card sx={{
                    minHeight: 430,
                    maxHeight: 430,
                    gridColumn: { xs: '1', md: '2' },
                    textAlign: 'center',
                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                    width: '90%',
                    borderRadius: 5,
                }}>

                    <CardContent className='' sx={{
                        maxHeight: '425px',
                    }}>
                        {/* Typography Centered */}
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 4, padding: 4 }}>
                            <Typography
                                className='text-black text-center font-bold text-2xl w-half columns-1'
                                // variant='h4'
                                sx={{
                                    gridColumn: '1fr',
                                    flexGrow: 1,
                                    width: '100%',
                                    textAlign: 'center',
                                    my: 2,
                                    // px: 3,
                                    color: 'black'
                                }}

                            >
                                Orders
                            </Typography>

                            {/* Button on the upper right */}
                            <Button
                                sx={{
                                    color: 'primary',
                                    minWidth: '100px',
                                    minHeight: '50px',
                                    maxHeight: '50px',
                                    borderRadius: 12,
                                    flexGrow: 0.5,
                                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                        color: 'indigo',
                                        '& .btn-text': {
                                            display: 'none',
                                        },
                                        '& .btn-icon': {
                                            display: 'block',
                                        }
                                    }
                                }}
                                className='bg-indigo-700 rounded-lg text-white text-md text-bold capitalize mt-2 columns-1'
                                onClick={() => setShowOrderForm(!showOrderForm)}
                            >
                                <span className="btn btn-text font-bold text text-sm bolder ">
                                    {showOrderForm ? 'View Orders' : 'Create Order'}
                                </span>
                                <span className="btn-icon hidden">
                                    {!showOrderForm ? <AddIcon /> : <TocIcon />}
                                </span>
                            </Button>
                        </div>
                        {/* Displaying the form or the table */}
                        {showOrderForm
                            ? <OrderForm sx={{ width: '100%' }} toggleView={toggleShowOrderForm} refreshOrders={fetchOrders} ></OrderForm>
                            : <OrderTable orders={orders} sx={{ width: '100' }}></OrderTable>
                        }
                    </CardContent>


                </Card>





                <Container sx={{
                    minWidth: '100%',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridColumn: '1 / span 2',
                    // boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                    marginTop: 4,
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    justifyContent: 'center',
                    textAlign: 'center',
                    overflow: 'auto',
                    maxHeight: '80vh',
                    maxWidth: '100%'
                }}>

                    <>
                        <Tabs
                            sx={{
                                mt: 1,
                                mx: 'auto',
                            }}
                            value={tabValue}
                            onChange={(event, newValue) => setTabValue(newValue)}
                        >
                            <Tab label="Pants" value="pants" />
                            <Tab label="Shirts" value="shirts" />
                            <Tab label="Suits" value="suits" />
                            {/* Add other tabs as needed */}
                        </Tabs>

                        {/* Orders Card */}



                        <Card sx={{
                            // boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.4)',
                            marginTop: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                            justifyContent: 'center',
                            textAlign: 'center',
                            overflow: 'auto',
                            maxHeight: '80vh',
                            maxWidth: '100%'
                        }}>
                            {tableConfigurations[tabValue].data && tableConfigurations[tabValue].data.length > 0 ? (
                                <MeasurementsTable
                                    // key={tableVersion}
                                    // refreshTable={refreshTable}
                                    customer={customer}
                                    measurements={tableConfigurations[tabValue].data}
                                    headers={tableConfigurations[tabValue].headers}
                                    formatRow={tableConfigurations[tabValue].formatter}
                                // onDataUpdated={handleDataUpdated} // pass the new handler here
                                />
                            ) :
                                <Typography sx={{
                                    textAlign: 'center',
                                    my: 3,
                                    px: 3,
                                    color: 'black'
                                }}>
                                    No measurements found.
                                </Typography>
                            }
                        </Card>
                    </>
                </Container>




            </Container >
        </>
    );
};


export async function getServerSideProps(context) {
    const customerId = context.params.id;
    const response = await fetch(`http://localhost:3000/api/getCustomerData?id=${customerId}`);
    if (!response.ok) {
        console.error('Failed to fetch customer data:', await response.text());
    }
    const data = await response.json();
    console.log('Fetched data:', data);


    return {
        props: {
            customer: data.customer || null,
            pantsMeasurements: data.pantsMeasurements || null,
            shirtsMeasurements: data.shirtsMeasurements || null
        }
    };

}

export default CustomerProfile;
