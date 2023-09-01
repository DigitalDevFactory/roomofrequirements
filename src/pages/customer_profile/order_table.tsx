import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataGrid, GridAlignment, GridColDef } from '@mui/x-data-grid';


export interface Order {
    id: string;
    type: string | null;
    order_name: string | null;
    clothReference: string | null;
    quantity: number | null;
}

interface OrderTableProps {
    orders: Order[];
    onEdit?: (order: Order) => void;
    onDelete?: (order: Order) => void;
    onView?: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onEdit, onDelete, onView }) => {
    
    const columns = [
        // { field: 'type', headerName: 'Type', width: 150 },
        { field: 'order_name', headerName: 'Name', width: 200, flex: 1, headerAlign: 'left' as GridAlignment, align: 'left' as GridAlignment, type: 'string' },
        { field: 'clothReference', headerName: 'Cloth Reference', flex: 1, headerAlign: 'center' as GridAlignment, align: 'center' as GridAlignment, type: 'string' },
        // { field: 'quantity', headerName: 'Quantity', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            type: 'string',
            headerAlign: 'center' as GridAlignment,
            align: 'center' as GridAlignment,
            renderCell: (params: any) => {
                const order: Order = params?.row;

                const onEdit = (order: Order) => {
                    console.log('onEdit', order);
                }
                const onDelete = (order: Order) => {
                    console.log('onDelete', order);
                }
                const onView = (order: Order) => {
                    console.log('onView', order);
                }




                return (
                    <>
                        <IconButton onClick={() => onEdit(order)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(order)}>
                            <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => onView(order)}>
                            <VisibilityIcon />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <div style={{ height: 300, minHeight: 300, maxHeight: 300, paddingLeft: '9px', paddingRight: '9px' }}>  {/* Adjust the height accordingly */}
            <DataGrid
                rows={orders ? orders : []}
                columns={columns ? columns : []}
                // pageSize={4}
                // rowsPerPageOptions={[4]}
                pagination={true}
                // responsive
                // overflow="auto"
                // disableSelectionOnClick
                // scrollbarSize={10}
                sx={{ textAlign: 'center', border: "none", borderRadius: "10px", bgcolor: "white" }}
            />
        </div>
    );
}

export default OrderTable;
