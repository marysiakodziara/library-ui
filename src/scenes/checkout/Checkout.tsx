import {useDispatch} from "react-redux";
import {
    Alert,
    Box,
    Button,
    Divider,
    FormHelperText,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import CustomizedSteppers from "../global/CustomizedSteppers";
import {shades} from "../../theme";
import {
    decreaseCount,
    increaseCount, Order,
    OrderItem,
    removeFromCart,
    selectCart,
    setCartEmpty
} from "../../state/cart/cartReducer";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {FlexBox} from "../global/CartMenu";
import {useAppSelector} from "../../app/hooks";
import ZeroStep from "./ZeroStep";
import SecondStep from "./SecondStep";
import dayjs from "dayjs";
import axios, {AxiosResponse} from "axios";
import {useAuth0} from "@auth0/auth0-react";
import {selectLoggedUser, selectRole} from "../../state/security/securityReducer";
import SearchIcon from "@mui/icons-material/Search";
import {User} from "../account/LoggedInView";

const Checkout = () => {
    const cart: OrderItem[] = useAppSelector(selectCart)
    const [activeStep, setActiveStep] = useState<number>(cart.length === 0 ? 0 : 1);
    const [isReservationCreated, setIsReservationCreated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isUserRequestSend, setIsUserRequestSend] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [userFetched, setUserFetched] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [ userFirstName, setUserFirstName ] = useState<string>('');
    const [ userLastName, setUserLastName ] = useState<string>('');
    const [ userPhoneNumber, setUserPhoneNumber ] = useState<string>('');
    const [ emailError, setEmailError ] = useState<boolean>(false);
    const [ phoneError, setPhoneError ] = useState<boolean>(false);
    const [ firstNameError, setFirstNameError ] = useState<boolean>(false);
    const [ lastNameError, setLastNameError ] = useState<boolean>(false);
    const [ isUserCreated, setIsUserCreated ] = useState<boolean>(false);
    const { isAuthenticated } = useAuth0();
    const { loginWithRedirect } = useAuth0();
    const dispatch = useDispatch();
    const isZeroStep = activeStep === 0;
    const isFirstStep = activeStep === 1;
    const isSecondStep = activeStep === 2;
    const token = useAppSelector(selectLoggedUser);
    const steps = ['Choose Books','Summary', 'Done'];
    const userRole = useAppSelector(selectRole);

    useEffect(() => {
        console.log(user == null)
        if (isReservationCreated) {
            dispatch(setCartEmpty());
            setActiveStep(2)
        } else if (cart.length === 0 && !isReservationCreated) {
            setActiveStep(0)
        }

    }, [isLoaded, cart.length]);

    useEffect(() => {
        console.log(user == null)
        setIsLoaded(false)
    }, [cart]);

    const sendData = () => {
        if (isAuthenticated) {
            if (userRole === 'MANAGER') {
                sendReservationAndUserData();
            } else {
                sendReservationData();
            }
        } else {
            loginWithRedirect();
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };


    const sendReservationData = async () => {
        const reservationData: Order = {
            borrowed: false,
            reservationItems: cart,
            reservationDate: dayjs().format('YYYY-MM-DD'),
            endOfReservation:  dayjs().add(1, 'day').format('YYYY-MM-DD'),
        }
        try {
            const response: AxiosResponse = await axios.post(
                `http://localhost:8080/api/v1/reservation`,
                reservationData, {
                    headers: headers
                }
            )
            if (response.status) {
                setIsReservationCreated(true);
            } else {
                setIsReservationCreated(false);
            }
            setIsLoaded(true);
        } catch (error) {
            setIsReservationCreated(false);
            setIsLoaded(true);
        }
    };

    const sendReservationAndUserData = async () => {
        const reservationDto: Order = {
            reservationItems: cart,
            borrowed: true,
            reservationDate: dayjs().format('YYYY-MM-DD'),
            endOfReservation:  dayjs().add(7, 'day').format('YYYY-MM-DD'),
        }
        const clientDto: User = {
            firstName: userFirstName,
            lastName: userLastName,
            emailAddress: userEmail,
            phoneNumber: userPhoneNumber,
        }
        const borrowRequest = {
            reservationDto: reservationDto,
            clientDto: clientDto,
        }
        try {
            const response: AxiosResponse = await axios.post(
                `http://localhost:8080/api/v1/reservation/borrow`,
                borrowRequest, {
                    headers: headers
                }
            )
            if (response.status) {
                setIsReservationCreated(true);
            } else {
                setIsReservationCreated(false);
            }
            setIsLoaded(true);
        } catch (error) {
            console.log(error)
            setIsReservationCreated(false);
            setIsLoaded(true);
        }
    }

    const createNewUser = async () => {
        setIsUserRequestSend(true);
        const clientDto: User = {
            firstName: userFirstName,
            lastName: userLastName,
            emailAddress: userEmail,
            phoneNumber: userPhoneNumber,
        }
        try {
            const response: AxiosResponse = await axios.post(
                `http://localhost:8080/api/v1/client`,
                clientDto, {
                    headers: headers
                }
            )
            if (response.status) {
                setIsUserCreated(true);
            } else {
                setIsUserCreated(false);
            }
        } catch (error) {
            console.log(error)
            setIsUserCreated(false);
            setEmailError(true);
        }
    }

    const handleFetchUser = async () => {
        axios({
            method: "get",
            url: `http://localhost:8080/api/v1/client/byEmail?email=${userEmail}`,
            headers: headers
        }).then((response: AxiosResponse) => {
            const user: User = response.data;
            if (user?.emailAddress != null) {
                setUser(user);
                setUserFetched(true);
            } else {
                setUser(null);
                setUserFetched(true);
            }
        }).catch((error) => {
            if (error.response.data === "Client Error") {
                setIsUserCreated(false);
            }
            setIsReservationCreated(false);
            setIsLoaded(true);
        });
    }

    const handleCheckedBox = () => {
        setChecked(!checked);
        setUser(null);
        setUserFetched(false);
        setUserEmail('');
        setUserFirstName('');
        setUserLastName('');
        setUserPhoneNumber('');
        setIsUserRequestSend(false);
        setIsUserCreated(false);
    }

    return (
         <Box>
                <Box width="80%" mt="100px" ml="auto" mr="auto" mb="40px">
                    <CustomizedSteppers activeStep={activeStep} steps={steps} />
                </Box>
             {isZeroStep && (
                 <ZeroStep />
             )}
             {isFirstStep && (
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
                        {isLoaded && !isReservationCreated && (
                            <Box width="100%" height="100%">
                                <Typography
                                    width="100%"
                                    textAlign="center"
                                    sx={{color: 'red', fontSize: '15px', pt: '20px', pb: '20px'}}
                                    fontWeight="bold"
                                >
                                    Reservation Was Rejected
                                </Typography>
                                <Divider/>
                                <Typography
                                    width="100%"
                                    sx={{pt: '20px', pb: '20px'}}
                                    textAlign="center"
                                    fontWeight="bold"
                                >
                                    The books you have chosen <br/>
                                    are not available at the moment. <br/>
                                    Try placing new order.
                                </Typography>
                            </Box>
                        )}
                        {!isLoaded && (
                            <>
                             <Box height="300px">
                                 {userRole !== "MANAGER" && (
                                     <>
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
                                     </>
                                 )}
                                 { userRole === "MANAGER" && (
                                     <Box justifyContent="center">
                                         <Box width="100%" display="flex" height="50px" m="0 auto"   >
                                             <Box display="flex" alignItems="center" justifyContent="space-around" m="0 auto">
                                                 <Typography variant="h4">Choose a Client</Typography>
                                                 <Switch
                                                     onChange={handleCheckedBox}
                                                 />
                                                 <Typography variant="h4">Add New Client</Typography>
                                             </Box>
                                         </Box>
                                         <Box
                                             display="flex"
                                             justifyContent="center"
                                             width="300px"
                                             height="80%"
                                             pt="6%"
                                             pl="20px"
                                             pr="20px"
                                             m="0 auto">
                                             { !checked && (
                                                 <>
                                                     <TextField
                                                         sx={{width: "100%"}}
                                                         error={userFetched && user == null}
                                                         helperText={(userFetched && user == null) ? "There is no user with given email" : ""}
                                                         label={"Client email"}
                                                         onChange={(e) => {
                                                             setUserFetched(false);
                                                             setUserEmail(e.target.value)}
                                                         }
                                                         InputProps={{
                                                             endAdornment: (
                                                                 <InputAdornment position="end"
                                                                 >
                                                                     <SearchIcon
                                                                         onClick={handleFetchUser}
                                                                         sx={{color: "black", '&:hover': { cursor: 'pointer' }}}
                                                                     />
                                                                 </InputAdornment>
                                                             ),
                                                         }}
                                                     />
                                                     { userFetched && user != null && (
                                                         <Box
                                                         mt="20px"
                                                         display="grid"
                                                         gridTemplateColumns="repeat(auto-fill, 300px)"
                                                         gridTemplateRows="(repeat(auto-fill), 60px)"
                                                         justifyContent="space-around"
                                                         rowGap="20px"
                                                         >
                                                         <Typography variant="h5">Firstname: {user.firstName}</Typography>
                                                         <Typography variant="h5">Lastname: {user.lastName}</Typography>
                                                         <Typography variant="h5">Email Address: {user.emailAddress}</Typography>
                                                         <Typography variant="h5">Phone Number: {user.phoneNumber}</Typography>
                                                         </Box>
                                                     )}
                                                 </>
                                             )}
                                            { checked && (
                                                <Box>
                                                    { checked && isUserCreated && (
                                                        <Box
                                                            display="grid"
                                                            gridTemplateColumns="repeat(auto-fill, 300px)"
                                                            gridTemplateRows="(repeat(auto-fill), 60px)"
                                                            m="0 auto"
                                                            rowGap="10px"
                                                            columnGap="1.33%">
                                                            <Alert severity="success">Successfully created a new Client!</Alert>
                                                            <Typography variant="h5">Firstname: {userFirstName}</Typography>
                                                            <Typography variant="h5">Lastname: {userLastName}</Typography>
                                                            <Typography variant="h5">Email Address: {userEmail}</Typography>
                                                            <Typography variant="h5">Phone Number: {userPhoneNumber}</Typography>
                                                        </Box>
                                                    )}
                                                    { checked && !isUserCreated && (
                                                        <Box
                                                            display="grid"
                                                            gridTemplateColumns="repeat(auto-fill, 300px)"
                                                            gridTemplateRows="(repeat(auto-fill), 60px)"
                                                            m="0 auto"
                                                            rowGap="10px"
                                                            columnGap="1.33%"
                                                        >
                                                            <TextField
                                                                error={emailError}
                                                                helperText={emailError ? isUserRequestSend ? "User with given email already exists" : "Email cannot be blank" : ""}
                                                                label={"Email"}
                                                                onChange={(e) => {
                                                                    setUserEmail(e.target.value)
                                                                    setEmailError(false)
                                                                    setIsUserRequestSend(false)
                                                                }}/>
                                                            <TextField
                                                                error={firstNameError}
                                                                helperText={firstNameError ? "Firstname cannot be blank" : ""}
                                                                label={"Firstname"}
                                                                onChange={(e) => {
                                                                    setUserFirstName(e.target.value)
                                                                    setFirstNameError(false)
                                                                }}/>
                                                            <TextField
                                                                error={lastNameError}
                                                                helperText={lastNameError ? "Lastname cannot be blank" : ""}
                                                                label={"Lastname"}
                                                                onChange={(e) => {
                                                                    setUserLastName(e.target.value)
                                                                    setLastNameError(false)
                                                                }}/>
                                                            <TextField
                                                                error={phoneError}
                                                                helperText={phoneError ? "Phone number cannot be blank" : ""}
                                                                label={"Phone number"}
                                                                onChange={(e) => {
                                                                    setUserPhoneNumber(e.target.value)
                                                                    setPhoneError(false)
                                                                }}/>
                                                        </Box>
                                                    )}

                                                </Box>
                                            )}
                                         </Box>
                                     </Box>
                                 )}
                             </Box>
                            <Box
                                mt="30px"
                                width="100%"
                                alignItems="center"
                                display="flex"
                            >
                                { checked && !isUserCreated && (
                                    <Button
                                        onClick={createNewUser}
                                        sx={{
                                            width: "50%",
                                            height: "50px",
                                            backgroundColor: `rgba(255, 135, 62,1.00)`,
                                            m: "0 auto"}}
                                    >
                                        Add Client
                                    </Button>
                                )}
                                { (!checked || (checked && isUserCreated)) && (
                                    <Button
                                        onClick={sendData}
                                        sx={{
                                            width: "50%",
                                            height: "50px",
                                            backgroundColor: `rgba(255, 135, 62,1.00)`,
                                            m: "0 auto"}}
                                    >
                                        { userRole === "MANAGER" ? "Confirm Order" : "Confirm Reservation"}
                                    </Button>
                                )}
                            </Box>
                            </>)}
                    </Box>
                 </Box>)}
                {isSecondStep && (
                    <SecondStep />
                )}
         </Box>

    );
}

export default Checkout;