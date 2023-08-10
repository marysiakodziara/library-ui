import {
    BorrowedOrderHistoryItem, fetchBorrowingHistory,
    fetchReservationHistory,
    OrderHistory,
    OrderHistoryItem, selectBorrowingHistory, selectBorrowingHistoryStatus,
    selectReservationHistory,
    selectReservationHistoryStatus
} from "../../state/account/accountReducer";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {alpha, Box, Button, LinearProgress, MenuItem, Select} from "@mui/material";
import {DataGrid, gridClasses, GridColDef} from '@mui/x-data-grid';
import {selectLoggedUser} from "../../state/security/securityReducer";
import {OrdersType} from "../managerDashboard/ManagerDashboard";
import axios from "axios";
import {styled} from "@mui/material/styles";
import {shades} from "../../theme";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor: shades.secondary[300],
        '&:hover, &.Mui-hovered': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
        '&.Mui-selected': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                ODD_OPACITY + theme.palette.action.selectedOpacity,
            ),
            '&:hover, &.Mui-hovered': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    ODD_OPACITY +
                    theme.palette.action.selectedOpacity +
                    theme.palette.action.hoverOpacity,
                ),
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        ODD_OPACITY + theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    },
}));

const OrdersHistory = (props: {ordersType: OrdersType}) => {
    const {ordersType} = props;
    const dispatch = useAppDispatch();
    const reservationHistory = useAppSelector(selectReservationHistory);
    const borrowedHistory = useAppSelector(selectBorrowingHistory);
    const reservationStatus = useAppSelector(selectReservationHistoryStatus);
    const borrowedStatus = useAppSelector(selectBorrowingHistoryStatus);
    const token = useAppSelector(selectLoggedUser);
    const [orders, setOrders] = useState<OrderHistory[] | BorrowedOrderHistoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [reloadComponent, setReloadComponent] = useState<boolean>(false);

    useEffect(() => {
        ordersType === OrdersType.RESERVED ? handleReservationHistory() : handleBorrowedHistory();
    }, [token, reservationStatus, borrowedStatus, reloadComponent]);

    const handleReservationHistory = () => {
        if (reservationStatus === 'fulfilled') {
            setOrders(reservationHistory);
            setLoading(false)
        } else if (reservationStatus === 'idle' && token) {
            dispatch(fetchReservationHistory());
        }
    }

    const handleBorrowedHistory = () => {
        if (borrowedStatus === 'fulfilled') {
            setOrders(borrowedHistory);
            setLoading(false)
        } else if (borrowedStatus === 'idle' && token) {
            dispatch(fetchBorrowingHistory());
        }
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
            { field: 'action', headerName: '', flex: 0.7, sortable: false, filterable: false, hideable: false, disableColumnMenu: true, renderCell:  (params) => {
                    const onClick = () => {
                        handleCancelReservation(params.row as OrderHistory);
                    };

                    return <Button sx={{textAlign: "center", width: "100%" }} onClick={onClick}>Cancel</Button>;
                }
            }]
        : [
            { field: 'title' , headerName: 'Title', flex: 1, valueGetter: (params) => params.row.book.title, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'quantity', headerName: 'Quantity', flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'reservationDate', headerName: 'Reservation Date', flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'endOfReservation', headerName: 'End of Reservation',flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true },
            { field: 'overdue', headerName: 'Overdue', flex: 1, sortable: false, filterable: false, hideable: false, disableColumnMenu: true, valueGetter: (params) => new Date(params.row.endOfReservation).toISOString().split('T')[0] < new Date().toISOString().split('T')[0] ? 'Yes' : 'No' },
        ]

    const handleCancelReservation = (item: OrderHistory) => {
        axios.delete(`http://localhost:8080/api/v1/reservation/cancelReservation?reservationId=${item.id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        dispatch(fetchReservationHistory());
        setReloadComponent(!reloadComponent);
    }

    return (
        <Box width="100%" height="100%">
            <StripedDataGrid
                rows={orders}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                slots={{
                    loadingOverlay: LinearProgress
                }}
                loading={loading}
                getRowClassName={(params) => {
                    return new Date(params.row.endOfReservation).toISOString().split('T')[0] < new Date().toISOString().split('T')[0] ? 'even' : 'odd'
                }
                }
            />
        </Box>
    )
}

export default OrdersHistory;