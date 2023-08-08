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
    setIsCartOpen, OrderItem, selectCart, selectIsCartOpen
} from "../../state/cart/cartReducer";
import { useNavigate } from "react-router-dom";
import {useAppSelector} from "../../app/hooks";

export const FlexBox = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CartMenu = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useAppSelector(selectCart);
    const isCartOpen = useAppSelector(selectIsCartOpen);

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
                        {cart.map((item: OrderItem) => (
                            <Box key={`${item.book.title}-${item.book.id}`}>
                                <FlexBox p="15px 0">
                                    <Box flex="1 1 40%">
                                        <img
                                            alt={item.book.title}
                                            width="123px"
                                            height="164px"
                                            src={`https://covers.openlibrary.org/b/isbn/${item.book.isbn}-M.jpg`}
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