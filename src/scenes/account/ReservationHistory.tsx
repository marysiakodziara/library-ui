import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    fetchReservationHistory,
    OrderHistory,
    OrderHistoryItem,
    selectReservationHistory,
    selectReservationHistoryStatus,
} from "../../state/account/accountReducer";
import {selectLoggedUser} from "../../state/security/securityReducer";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Divider,
    Typography
} from "@mui/material";
import {shades} from "../../theme";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";

const ReservationHistory = () => {
    const [reservationHistory, setReservationHistory] = useState<OrderHistory[]>([]);
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectReservationHistoryStatus);
    const history = useAppSelector(selectReservationHistory);
    const token = useAppSelector(selectLoggedUser);

    useEffect(() => {
        if (status === 'fulfilled') {
            console.log(history)
            setReservationHistory(history);
        } else if (status === 'idle' && token) {
            dispatch(fetchReservationHistory());
        }
    }, [token, status]);

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
    }

    return (
        <Box
            minHeight="500px"
            width="100%"
            padding="20px 50px"
            border={`1.5px solid ${shades.neutral[400]}`}
        >
            { status === 'fulfilled' && reservationHistory.map((order: OrderHistory) =>
                    (
                        <Box
                            display="flex"
                            sx={{backgroundColor: order.canceled ? shades.neutral[300] : `rgba(170,214,136,0.5)`}}
                            width="100%"
                            height="100px"
                            key={order.id}
                            border={`1.5px solid ${shades.neutral[400]}`}
                            padding="20px 30px"
                            justifyContent="space-between"
                            alignItems="center"
                            marginBottom="20px"
                        >
                            <Accordion sx={{width: "200px"}}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography variant="h5">Books:</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {order.reservationItems.map((orderHistoryItem: OrderHistoryItem) =>
                                        (
                                            <Box key={orderHistoryItem.book.id}>
                                                <Typography variant="h5">{orderHistoryItem.book.title}</Typography>
                                                <Typography sx={{textAlign: "right", paddingRight: "20px"}} variant="h5">pcs: {orderHistoryItem.quantity}</Typography>
                                                <Divider sx={{padding: "5px 0"}}/>
                                            </Box>
                                        ))}
                                </AccordionDetails>
                            </Accordion>

                            <Typography variant="h5">Ends on: {order.endOfReservation}</Typography>
                            <Button
                                disabled={order.canceled}
                                onClick={() => handleCancelReservation(order)}
                                sx={{backgroundColor: shades.neutral[500], height: "50px", width: "100px"}}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )
                )
            }
            { status !== 'fulfilled' && (
                <CircularProgress/>
            )
            }
        </Box>
    );
}

export default ReservationHistory;

/*
<Box display="flex" alignItems="center" width="45%" justifyContent="space-between">
    <Select value="Books" sx={{width: "200px"}}>
        {order.reservationItems.map((orderHistoryItem: OrderHistoryItem) =>
            (
                <MenuItem >{orderHistoryItem.book.title}</MenuItem>
            ))}

    </Select>
</Box>*/
