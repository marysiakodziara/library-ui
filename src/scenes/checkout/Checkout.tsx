import { useSelector, useDispatch } from "react-redux";
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    StepIcon,
    Typography,
    IconButton,
    Divider
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import CustomizedSteppers from "./CustomizedSteppers";
import { shades } from "../../theme";
import {boolean} from "yup";
import {
    CartState,
    decreaseCount,
    increaseCount,
    Order,
    OrderItem,
    removeFromCart,
    selectCart
} from "../../state/cart/cartReducer";
import {Book} from "../../state/book/bookReducer";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { FlexBox } from "../global/CartMenu";
import { useNavigate } from "react-router-dom";
import axios, {AxiosResponse} from "axios";
import {useAppSelector} from "../../app/hooks";
import dayjs from 'dayjs';

const Checkout = () => {
    const cart = useAppSelector(selectCart)
    const [activeStep, setActiveStep] = useState<number>(cart.length === 0 ? 0 : 1);
    const [isAppointmentCreated, setIsAppointmentCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSecondStep = activeStep === 1;
    const isThirdStep = activeStep === 2;

    const sendData = () => {
        sendReservationData();
    }


    const sendReservationData = async () => {
        const reservationData: Order = {
            reservationItems: cart,
            reservationDate: dayjs().format('YYYY-MM-DD'),
            endOfReservation:  dayjs().add(1, 'day').format('YYYY-MM-DD')
        }
        try {
            const response: AxiosResponse = await axios.post(
                `http://localhost:8080/api/v1/reservation`,
                reservationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            if (response.status) {
                setIsAppointmentCreated(true);
                setIsLoading(false);
            } else {
                setIsAppointmentCreated(false);
                setIsLoading(false);
            }
        } catch (error) {
            setIsAppointmentCreated(false);
            setIsLoading(false);
        }
    };

    return (
         <Box>
                <Box width="80%" mt="100px" ml="auto" mr="auto" mb="40px">
                    <CustomizedSteppers activeStep={activeStep} />
                </Box>
             {cart.length === 0 && (
                 <Box
                     width="80%"
                     height="300px"
                     m="0 auto"
                     sx={{ backgroundColor: shades.neutral[200] }}
                 >
                     <Box display="flex">
                         <Typography
                             sx={{ m: "50px auto" }}
                             variant="h2">
                             Your cart is empty
                         </Typography>
                     </Box>
                     <Box display="flex" >
                         <Typography
                             sx={{
                                 m: "0 auto",
                                 color: `rgba(195,73,0,1.00)`,
                                 ":hover": {cursor: "pointer"}
                             }}
                             onClick={() => navigate("/")}
                         >
                             Go to the main page
                         </Typography>
                     </Box>
                 </Box>
             )}
             {(isSecondStep && cart.length !== 0) && (
                 <Box
                     width="80%"
                     margin="auto"
                     display="flex"
                     justifyContent="space-around"
                     flexWrap="wrap"
                     rowGap="30px"
                 >
                    <Box width="65%" sx={{ backgroundColor: shades.neutral[200] }}>
                        <Box display='flex' alignItems='center' height="50px">
                            <Typography ml="20px" variant="h3">Books in your cart</Typography>
                        </Box>
                        <Divider />
                        <Box width="90%" m="20px auto">
                            {cart.map((item: OrderItem) => (
                                <Box key={`${item.book.title}-${item.book.id}`}>
                                    <FlexBox p="15px 0">
                                        <Box flex="1 1 40%">
                                            <img
                                                alt={item?.book.title}
                                                width="123px"
                                                height="164px"
                                                src={`https://covers.openlibrary.org/b/isbn/${item?.book.isbn}-M.jpg`}
                                            />
                                        </Box>
                                        <Box flex="1 1 60%">
                                            <FlexBox mb="5px">
                                                <Typography fontWeight="bold">
                                                    {item.book.title}
                                                </Typography>
                                                <IconButton onClick={() => dispatch(removeFromCart({ id: item.book.id}))}>
                                                    <CloseIcon/>
                                                </IconButton>

                                            </FlexBox>
                                            <Typography>
                                                {item.book.author}
                                            </Typography>
                                            <FlexBox m="15px 0">
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    border={`1.5px solid ${shades.neutral[500]}`}
                                                >
                                                    <IconButton
                                                        onClick={() => dispatch(decreaseCount({ id: item.book.id}))}
                                                    >
                                                        <RemoveIcon/>
                                                    </IconButton>
                                                    <Typography>{item.quantity}</Typography>
                                                    <IconButton
                                                        onClick={() => dispatch(increaseCount({ id: item.book.id}))}
                                                    >
                                                        <AddIcon/>
                                                    </IconButton>
                                                </Box>
                                            </FlexBox>
                                        </Box>
                                    </FlexBox>
                                 </Box> ))}
                        </Box>
                    </Box>
                    <Box
                        width="30%"
                        height="450px"
                        sx={{ backgroundColor: shades.neutral[200] }}
                        padding="2% 2%"
                    >
                         <Box height="300px">
                             <Box
                                 sx={{ mt: "20px"}}
                                 width="100%"
                                 display="flex"
                                 justifyContent="space-between"
                             >
                                 <Typography variant="h3">Reservation Till</Typography>
                                 <Typography>Tomorrow</Typography>
                             </Box>
                             <Box
                                 sx={{ mt: "20px"}}
                                 width="100%"
                                 display="flex"
                                 justifyContent="space-between">
                                 <Typography variant="h3">Number of books</Typography>
                                 <Typography>{cart.length}</Typography>
                             </Box>
                             <Box
                                 sx={{ mt: "100px"}}
                                 width="100%"
                                 display="flex"
                                 justifyContent="space-between">
                                 <div>
                                     This order ensures that the books will be reserved for you in the library.
                                     To confirm the reservation, please click the button below.
                                 </div>
                             </Box>
                         </Box>
                        <Box
                            width="100%"
                            alignItems="center"
                            display="flex"
                        >
                            <Button
                                onClick={sendData}
                                sx={{
                                    width: "50%",
                                    height: "50px",
                                    backgroundColor: `rgba(255, 135, 62,1.00)`,
                                    m: "0 auto"}}
                            >
                                Confirm Reservation
                            </Button>
                        </Box>
                    </Box>
                 </Box>)}
         </Box>

    );
}

export default Checkout;