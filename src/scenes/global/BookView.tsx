import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Box, Button, IconButton, Skeleton, Typography, useTheme} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {shades} from '../../theme';
import {addToCart, OrderItem} from "../../state/cart/cartReducer";
import {Book} from '../../state/book/bookReducer';
import {useNavigate} from 'react-router-dom';
import {ROUTES} from "../../routes/routes";
import GenericCover, {GenericCoverSize} from "./GenericCover";


const BookView = ({book, width}: {book: Book, width: string}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const {palette: {info}} = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState('');
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    async function fetchData() {
        try {
            const apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(book?.title)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.docs && data.docs.length > 0) {
                const bookCoverId = data.docs[0].cover_i;
                if (bookCoverId) {
                    const coverUrl = `https://covers.openlibrary.org/b/id/${bookCoverId}-L.jpg`;
                    setImage(coverUrl);
                    setIsImageLoaded(true);
                } else {
                    setIsImageLoaded(true);
                }
                setIsLoading(false);
            } else {
                console.log('No book data found or missing required properties.');
                setIsImageLoaded(true);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('An error occurred while fetching book data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddToCart = (book: Book, quantity: number, bookImage: string) => {
        const image = bookImage ? bookImage : 'none';
        const newItem: OrderItem = {book, quantity, image};
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
                { isImageLoaded && image === '' && !isLoading && (
                    <GenericCover bookId={book.id} size={GenericCoverSize.LARGE} />
                )}
                { isImageLoaded && image !== '' && !isLoading && (
                    <img
                        src={image}
                        alt={book.title}
                        width="250px"
                        height="350px"
                        onClick={() => {
                            const path = ROUTES.BOOK.replace(':bookId', book.id.toString());
                            navigate(path);
                        }}
                        style={{ cursor: 'pointer' }}
                        onLoad={handleImageLoad}
                    />
                ) }
                { !isLoading && (
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
                                    onClick={() => handleAddToCart(book, count, image)}
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
                )}
            </Box>
            { !isLoading && (
                <Box mt="3px">
                    <Typography fontWeight="bold" >{book.title}</Typography>
                    <Typography>{book.author}</Typography>

                </Box>
            )}
        </Box>
    )
}

export default BookView;