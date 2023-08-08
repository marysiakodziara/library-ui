import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {Box, Button, CircularProgress, Divider, IconButton, Tab, Tabs, Typography} from '@mui/material';
import FavouriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {shades} from '../../theme';
import {addToCart, OrderItem} from "../../state/cart/cartReducer";
import {Book, fetchRandomBooks, selectAllBooks} from '../../state/book/bookReducer';
import {useLocation, useParams} from 'react-router-dom';
import BookView from '../../components/BookView';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import ErrorPage from "../global/ErrorPage";

interface ProductDetails {
    author: string;
    publisher: string;
    publishedDate: string;
    pageCount: number;
    averageRating: number;
}

const BookDetails = () => {
    const { bookId } = useParams();
    const id: number = bookId ? parseInt(bookId) : 0;
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("description");
    const [count, setCount] = useState(1);
    const books = useAppSelector(selectAllBooks);
    const [book, setBook] = useState<Book | null>();
    const [description, setDescription] = useState<string>("");
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
    const location = useLocation();
    const relatedProductsRef = useRef<HTMLDivElement>(null);


    const [loading, setLoading] = useState(true);

    async function fetchBook() {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/book/id?id=${id}`);
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setBook(data);
                    setLoading(false);
                } else {
                    setBook(null);
                    setLoading(false);
                }
            } else {
                setBook(null);
                setLoading(false);
            }
        } catch (error) {
            setBook(null);
            setLoading(false);
        }
    }

    async function fetchData() {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book?.isbn}&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}`);
        const data = await response.json();
        setDescription(data.items[0].volumeInfo.description);
        setProductDetails({
            author: book ? book.author : "",
            publisher: data.items[0].volumeInfo.publisher,
            publishedDate: data.items[0].volumeInfo.publishedDate,
            pageCount: data.items[0].volumeInfo.pageCount,
            averageRating: data.items[0].volumeInfo.averageRating
        });
    };

    useEffect(() => {
        const handleFetchData = async () => {
            await fetchData();
        };

        if (book) {
            handleFetchData();
        }
    },[book] );

    useEffect(() => {
        setDescription("");
        setBook(null);
        setLoading(true);
        setValue("description");
    }, [location]);


    useEffect(() => {
        fetchBook();
        dispatch(fetchRandomBooks())
    }, [dispatch, location]);

    const handleChange = (event: any, newValue: SetStateAction<string>) => {
        setValue(newValue);

        if (newValue === 'related_products' && relatedProductsRef.current) {
            relatedProductsRef.current.scrollIntoView({ behavior: 'smooth' });
            setValue("description");
        }
    }

    const handleAddToCart = (book: Book, quantity: number) => {
        const newItem: OrderItem = {book, quantity};
        dispatch(addToCart(newItem));
    }

    const filteredBooks = books?.filter(book => book.id !== id);

    return (
        <Box width="100%" m="100px auto">
            { !loading && book && description &&  (
                <Box >
                    <Box sx={{backgroundColor: shades.neutral[100]}} p="20px 5%" >
                        <Box width="90%" display="flex" flexWrap="wrap" columnGap="70px" m="auto auto">
                            <Box flex="1 1 25%" m="auto auto">
                                <img
                                    alt={book?.title}
                                    width="90%"
                                    src={`https://covers.openlibrary.org/b/isbn/${book?.isbn}-L.jpg`}
                                    style={{objectFit: "contain"}}
                                />
                            </Box>
                            <Divider orientation="vertical" flexItem/>
                            <Box flex="1 1 50%" >
                                <Box alignItems="flex-start" justifyContent="flex-start">
                                    <Box m="65px 0 25px 0">
                                        <Typography variant="h2" fontWeight="bold">{book?.title}</Typography>
                                        <Typography>{book?.author}</Typography>
                                        <Box m="20px 0">
                                            <Tabs value={value} onChange={handleChange}>
                                                <Tab label="DESCRIPTION" value="description" />
                                                <Tab label="DETAILS" value="details" />
                                                <Tab label="RELATED BOOKS" value="related_products" />
                                            </Tabs>
                                        </Box>
                                        <Box minHeight="200px" display="flex" flexWrap="wrap" gap="15px">
                                            {value === "description" && (
                                                <div>{description}</div>
                                            )}
                                            {value === "details" && (
                                                <Box>
                                                    <Typography sx={{mb: '10px'}}><strong>Author:</strong> {productDetails?.author}</Typography>
                                                    <Typography sx={{mb: '10px'}}><strong>Publisher:</strong> {productDetails?.publisher}</Typography>
                                                    <Typography sx={{mb: '10px'}}><strong>Published Date:</strong> {productDetails?.publishedDate}</Typography>
                                                    <Typography sx={{mb: '10px'}}><strong>Number of Pages:</strong> {productDetails?.pageCount}</Typography>
                                                    <Typography sx={{mb: '10px'}}><strong>Average Rating:</strong> {productDetails?.averageRating}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    { book.numberOfAvailableBooks !== 0 && (
                                        <Box display="flex" alignItems="center" minHeight="50px">
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                border={`1.5px solid ${shades.neutral[300]}`}
                                                mr="20px"
                                                p="2px 5px"
                                            >
                                                <IconButton
                                                    onClick={() => setCount(Math.max(count - 1, 1))}
                                                >
                                                    <RemoveIcon/>
                                                </IconButton>
                                                <Typography sx={{p: "0 5px"}}>{count}</Typography>
                                                <IconButton
                                                    onClick={() => setCount(count + 1)}
                                                >
                                                    <AddIcon/>
                                                </IconButton>
                                            </Box>
                                            <Button
                                                sx={{
                                                    backgroundColor: "#222222",
                                                    color: "white",
                                                    borderRadius: 0,
                                                    minWidth: "150px",
                                                    padding: "10px 40px"
                                                }}
                                                onClick={() => handleAddToCart(book, count)}
                                            >
                                                ADD TO CART
                                            </Button>
                                        </Box>
                                    )}
                                    { book.numberOfAvailableBooks === 0 && (
                                        <Box
                                            height="50px"
                                            width="30%"
                                            display="flex"
                                            sx={{backgroundColor: `rgba(210, 215, 211, 0.9)`}}
                                        >
                                            <Typography
                                                sx={{m: 'auto auto'}}
                                                fontSize="15px"
                                            >No copies available</Typography>
                                        </Box>
                                    )}

                                    <Box>
                                        <Box m="20px 0 5px 0" display="flex">
                                            <FavouriteBorderOutlinedIcon />
                                            <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box ref={relatedProductsRef} width="80%" display="flex" flexWrap="wrap" columnGap="100px" m="auto auto">
                        <Box mt="70px" width="100%">
                        <Typography variant="h3" fontWeight="bold">
                        Related Products
                        </Typography>
                        <Divider sx={{mb: "30px"}}/>
                        <Box
                        mt="20px"
                        display="flex"
                        flexWrap="nowrap"
                        columnGap="1.33%"
                        justifyContent="space-between"
                        >
                    {filteredBooks.slice(0, 4).map((book, i) => (
                        <BookView key={`${book?.title}-${i}`} book={book} width={"250px"}/>))}
                        </Box>
                        </Box>
                    </Box>
                </Box>
            )}
            { !loading && book === null && (
                <ErrorPage/>
            )}
            { loading && (
                <CircularProgress
                    size={200}
                    sx={{
                        size: 400,
                        color: shades.neutral[500],
                        m: "auto auto",
                    }}/>
            )}
        </Box>
    );
}

export default BookDetails;