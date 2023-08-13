import {OrderHistory, OrderHistoryItem} from "../../state/account/accountReducer";
import {OrdersType} from "./ManagerDashboard";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../app/hooks";
import {Box, Button, LinearProgress, MenuItem, Select} from "@mui/material";
import {DataGrid, getGridStringOperators, GridColDef} from '@mui/x-data-grid';
import axios from "axios";
import {selectLoggedUser} from "../../state/security/securityReducer";

interface ExtendedOrderItem extends OrderHistoryItem {
    id: number;
    reservationDate: string;
    endOfReservation: string;
    clientEmail: string;
}

interface ExtendedOrderHistoryItem extends OrderHistory {
    clientEmail: string;
}

interface OrdersPage {
    content: ExtendedOrderItem[] | ExtendedOrderHistoryItem[]
    totalPages: number,
    totalElements: number,
}

const OrdersList = (props: {ordersType: OrdersType}) => {
    const {ordersType} = props;
    const token = useAppSelector(selectLoggedUser);
    const [orders, setOrders] = useState<ExtendedOrderItem[] | ExtendedOrderHistoryItem[]>([]);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        ordersType === OrdersType.RESERVED ? getReservations() : getOrders();
    }, [ordersType])

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    const getReservations = async () => {
        const response = await axios.get<OrdersPage>(`${process.env.REACT_APP_API_URL}/reservation/reservedItems`, {headers});
        setTotalElements(response.data.totalElements);
        setOrders(response.data.content);
        setLoading(false)
    }

    const getOrders = async () => {
        const endpoint =  ordersType === OrdersType.OVERDUE ? `/borrowedItems/overdue` : `/borrowedItems?borrowed=true`;
        const response = await axios.get<OrdersPage>(`${process.env.REACT_APP_API_URL}/reservation${endpoint}`, {headers});
        setTotalElements(response.data.totalElements);
        setOrders(response.data.content);
        setLoading(false)
    }

    const columns: GridColDef[] = ordersType === OrdersType.RESERVED ?
        [
            { field: 'titles' , headerName: 'Titles', flex: 1, renderCell: (params) =>
                <Select
                    displayEmpty
                    sx={{width: "100%", height: "90%"}}
                    renderValue={(selected) => {
                        return <em>{params.row.reservationItems[0].book.title}</em>;}
                    }>
                    { params.row.reservationItems.map((item: OrderHistoryItem, index: number) =>
                        <MenuItem key={index}>{item.book.title}</MenuItem>
                    )}
                </Select>,
                sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'reservationDate', headerName: 'Reservation Date', flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'endOfReservation', headerName: 'End of Reservation',flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'clientEmail', headerName: 'Client', flex: 1, sortable: false, filterOperators: getGridStringOperators().filter((operator) => operator.value == 'contains' || operator.value == 'equals')},
            { field: 'action', headerName: '', flex: 0.7, sortable: false, filterable: false, hideable: false, disableColumnMenu: true, renderCell:  (params) => {
                    const onClick = () => {
                        handleOrderClick(params.row.id)
                    };

                    return <Button sx={{textAlign: "center", width: "100%" }} onClick={onClick}>Confirm</Button>;
                }
            }

        ]
        : [
        { field: 'title' , headerName: 'Title', flex: 1, valueGetter: (params) => params.row.book.title, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
        { field: 'quantity', headerName: 'Quantity', flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
        { field: 'reservationDate', headerName: 'Reservation Date', flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
        { field: 'endOfReservation', headerName: 'End of Reservation',flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
        { field: 'clientEmail', headerName: 'Client', flex: 1, sortable: false, filterOperators: getGridStringOperators().filter((operator) => operator.value == 'contains' || operator.value == 'equals')},
        { field: 'action', headerName: '', flex: 0.7, sortable: false, filterable: false, hideable: false, disableColumnMenu: true, renderCell:  (params) => {
                const onClick = () => {
                    handleOrderClick(params.row.id)
                };

                return <Button sx={{textAlign: "center", width: "100%" }} onClick={onClick}>Return</Button>;
            }
        }
    ]

    const handleOrderClick = (id: number) => {
        const endpoint = ordersType === OrdersType.RESERVED ? `/confirmReservation?reservationId=${id}` : `/return?reservationItemId=${id}`;
        axios.delete(`${process.env.REACT_APP_API_URL}/reservation${endpoint}`, {headers})
        .then(() => {
        ordersType === OrdersType.RESERVED ? getReservations() : getOrders();
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <Box m="0 auto" p="20px 20px" width="100%" height="100%" display="flex" flexWrap="wrap">
            <DataGrid
                rows={orders}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                rowCount={totalElements}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                slots={{
                    loadingOverlay: LinearProgress
                }}
                loading={loading}
            />
        </Box>
    )
}

export default OrdersList;