import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from "@emotion/styled";
import { shades } from "../../theme";
import {
    increaseCount,
    decreaseCount,
    removeFromCart,
    setIsCartOpen
} from "../../state/cart/cartReducer";
import { Book } from "../../state/book/bookReducer";
import { useNavigate } from "react-router-dom";

export const FlexBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CartMenu = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state: any) => state.cart.cart);
    const isCartOpen = useSelector((state: any) => state.cart.isCartOpen);

    const totalPrice = cart.reduce((total: number, item: { count: number; attributes: { price: number; }; }) => {
        return total + item.count * item.attributes.price;
    }, 0);

    return (
        <Box
            display={isCartOpen ? "block" : "none"}
            sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            position="fixed"
            zIndex={20}
            width="100%"
            height="100%"
            left="0"
            top="0"
            overflow="auto"
        >
            <Box
                position="fixed"
                right="0"
                bottom="0"
                width="max(400px, 30%)"
                height="100%"
                sx={{ backgroundColor: "white" }}
            >
                <Box
                    padding="30px"
                    overflow="auto"
                    height="100%"
                >
                    <FlexBox mb="15px">
                        <Typography variant="h3">SHOPPING BAG ({cart.length})</Typography>
                        <IconButton onClick={() => dispatch(setIsCartOpen())}>
                            <CloseIcon/>
                        </IconButton>
                    </FlexBox>
                    <Box>
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
                                <Divider/>
                            </Box>
                        ))}
                    </Box>
                    <Box m="20px 0">
                        <Button
                            sx={{
                                backgroundColor: shades.primary[400],
                                color: "white",
                                borderRadius: 0,
                                minWidth: "100%",
                                padding: "20px 40px",
                                m: "20px 0",
                                }}
                            onClick={() => {
                                navigate("/checkout");
                                dispatch(setIsCartOpen());
                            }}
                        >
                            CHECKOUT
                        </Button>

                    </Box>

                </Box>

            </Box>

        </Box>
    )
}

export default CartMenu;