import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, IconButton, Typography, useTheme, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shades } from '../theme';
import {addToCart, decreaseCount, increaseCount, OrderItem} from "../state/cart/cartReducer";
import {Book} from '../state/book/bookReducer';
import { useNavigate } from 'react-router-dom';


const BookView = ({book, width}: {book: Book, width: string}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const {palette: {info}} = useTheme();

    const handleAddToCart = (book: Book, quantity: number) => {
        const newItem: OrderItem = {book, quantity};
        dispatch(addToCart(newItem));
    }

    return (
        <Box width={width}>
            <Box
                position="relative"
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}>
                <img
                    src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                    alt={book.title}
                    width="250px"
                    height="350px"
                    onClick={() => navigate(`/book/${book.id}`)}
                    style={{ cursor: 'pointer' }}
                />
                <Box
                    display={isHovered ? 'blocked' : 'none'}
                    position="absolute"
                    bottom="10%"
                    left="0"
                    width="100%"
                    padding="0 5%"
                >
                    <Box width="100%" display="flex" justifyContent="space-between">
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{backgroundColor: shades.neutral[100]}}
                            borderRadius="3px"
                        >
                            <IconButton
                                onClick={() => setCount(Math.max(count - 1, 1))}
                            >
                                <RemoveIcon/>
                            </IconButton>
                            <Typography color={shades.primary[300]}>{count}</Typography>
                            <IconButton
                                onClick={() => setCount(count + 1)}
                            >
                                <AddIcon/>
                            </IconButton>
                        </Box>
                        <Button
                            onClick={() => handleAddToCart(book, count)}
                            sx={{ backgroundColor: shades.primary[300], color: "white" }}
                        >
                            Add to cart
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box mt="3px">
                <Typography fontWeight="bold" >{book.title}</Typography>
                <Typography>{book.author}</Typography>

            </Box>
        </Box>
    )
}

export default BookView;