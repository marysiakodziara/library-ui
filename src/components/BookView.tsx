import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Box, Button, IconButton, Skeleton, Typography, useTheme} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {shades} from '../theme';
import {addToCart, OrderItem} from "../state/cart/cartReducer";
import {Book} from '../state/book/bookReducer';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from "../routes/routes";


const BookView = ({book, width}: {book: Book, width: string}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const {palette: {info}} = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const handleAddToCart = (book: Book, quantity: number) => {
        const newItem: OrderItem = {book, quantity};
        dispatch(addToCart(newItem));
    }

    const handleImageLoad = () => {
        setIsLoading(false);
    }

    return (
        <Box width={width}>
            <Box
                position="relative"
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}>
                { isLoading && (
                    <Skeleton variant="rectangular" width="250px" height="350px" />
                )}
                <img
                    src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                    alt={book.title}
                    width="250px"
                    height="350px"
                    onClick={() => {
                        const path = (ROUTES.BOOK).replace(':bookId', book.id.toString());
                        navigate(path);
                    }}
                    style={{ cursor: 'pointer' }}
                    onLoad={handleImageLoad}
                />
                <Box
                    display={isHovered ? 'blocked' : 'none'}
                    position="absolute"
                    bottom="10%"
                    left="0"
                    width="100%"
                    padding="0 5%"
                >
                    { book.numberOfAvailableBooks !== 0 && (
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
                                    disabled={count >= book.numberOfAvailableBooks}
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
                    )}
                    { book.numberOfAvailableBooks === 0 && (
                        <Box
                            height="50px"
                            width="100%"
                            display="flex"
                            sx={{backgroundColor: `rgba(210, 215, 211, 0.9)`}}
                        >
                                <Typography
                                    sx={{m: 'auto auto'}}
                                    fontSize="15px"
                                >No copies available</Typography>
                        </Box>
                    )}


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