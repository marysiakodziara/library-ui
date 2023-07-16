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
import {decreaseCount, increaseCount, removeFromCart} from "../../state/cart/cartReducer";
import {Book} from "../../state/book/bookReducer";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { FlexBox } from "../global/CartMenu";
import { useNavigate } from "react-router-dom";



const initialValues = {
    billingAddress: {
        firstName: "",
        lastName: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
    },
    shippingAddress: {
        isSameAddress: true,
        firstName: "",
        lastName: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
    },
    email: "",
    phoneNumber: "",
}

function schema() {
    return yup.string().required("required");
}

const checkoutSchema = [
    yup.object().shape({
        billingAddress: yup.object().shape({
            firstName: yup.string().required("required"),
            lastName: yup.string().required("required"),
            country: yup.string().required("required"),
            street1: yup.string().required("required"),
            street2: yup.string(),
            city: yup.string().required("required"),
            state: yup.string().required("required"),
            zipCode: yup.string().required("required"),
        }),
        shippingAddress: yup.object().shape({
            isSameAddress: yup.boolean(),
            firstName: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
            lastName: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
            country: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
            street1: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
            street2: yup.string(),
            city: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
            state: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
            zipCode: yup.string().when("isSameAddress", {
                is: (isSameAddress: boolean) => isSameAddress,
                then: schema,
            }),
        })
    }),
    yup.object().shape({
        email: yup.string().required("required"),
        phoneNumber: yup.string().required("required"),
    }),
]

const Checkout = () => {
    const cart = useSelector((state: any) => state.cart.cart);
    const [activeStep, setActiveStep] = useState<number>(cart.length === 0 ? 0 : 1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSecondStep = activeStep === 1;
    const isThirdStep = activeStep === 2;

    const handleFormSubmit = async (value: any, actions: any) => {
        setActiveStep(activeStep + 1);
    }

    async function  makePayment(values: any) {

    }

    /*<Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema[activeStep]}
    >
        {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue
          }) => (
            <form onSubmit={handleSubmit}>
            </form>
        )}
    </Formik>*/

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
                            {cart.map((item: Book) => (
                                <Box key={`${item.title}-${item.id}`}>
                                    <FlexBox p="15px 0">
                                        <Box flex="1 1 40%">
                                            <img
                                                alt={item?.title}
                                                width="123px"
                                                height="164px"
                                                src={`https://covers.openlibrary.org/b/isbn/${item?.isbn}-M.jpg`}
                                            />
                                        </Box>
                                        <Box flex="1 1 60%">
                                            <FlexBox mb="5px">
                                                <Typography fontWeight="bold">
                                                    {item.title}
                                                </Typography>
                                                <IconButton onClick={() => dispatch(removeFromCart({ id: item.id}))}>
                                                    <CloseIcon/>
                                                </IconButton>

                                            </FlexBox>
                                            <Typography>
                                                {item.author}
                                            </Typography>
                                            <FlexBox m="15px 0">
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    border={`1.5px solid ${shades.neutral[500]}`}
                                                >
                                                    <IconButton
                                                        onClick={() => dispatch(decreaseCount({ id: item.id}))}
                                                    >
                                                        <RemoveIcon/>
                                                    </IconButton>
                                                    <Typography>{item.count}</Typography>
                                                    <IconButton
                                                        onClick={() => dispatch(increaseCount({ id: item.id}))}
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
                            <Button sx={{
                                width: "50%",
                                height: "50px",
                                backgroundColor: `rgba(255, 135, 62,1.00)`,
                                m: "0 auto"
                            }}>
                                Confirm Reservation
                            </Button>
                        </Box>
                    </Box>
                 </Box>)}
         </Box>

    );
}

export default Checkout;