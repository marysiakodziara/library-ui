import React, {SetStateAction, useEffect, useState} from 'react';
import {Box, Button, CircularProgress, IconButton, Tab, Tabs, Typography} from '@mui/material';
import FavouriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {shades} from '../../theme';
import {addToCart, OrderItem} from "../../state/cart/cartReducer";
import {Book, fetchRandomBooks, selectAllBooks, selectStatus} from '../../state/book/bookReducer';
import {useLocation, useParams} from 'react-router-dom';
import BookView from '../../components/BookView';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import ErrorPage from "../global/ErrorPage";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const BookDetails = () => {
    const { bookId } = useParams();
    const id: number = bookId ? parseInt(bookId) : 0;
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("description");
    const [count, setCount] = useState(1);
    const books = useAppSelector(selectAllBooks);
    const [book, setBook] = useState<Book | null>();
    const [description, setDescription] = useState<string>("");
    const location = useLocation();


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
    }

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
    }, [location]);


    useEffect(() => {
        fetchBook();
        dispatch(fetchRandomBooks())
    }, [dispatch, location]);

    const handleChange = (event: any, newValue: SetStateAction<string>) => {
        setValue(newValue);
    }

    const handleAddToCart = (book: Book, quantity: number) => {
        const newItem: OrderItem = {book, quantity};
        dispatch(addToCart(newItem));
    }

    const filteredBooks = books?.filter(book => book.id !== id);

    return (
        <Box width="80%" m="80px auto">
            { !loading && book && description &&  (
                <>
                    <Box display="flex" flexWrap="wrap" columnGap="40px">
                        <Box flex="1 1 40%" mb="40px">
                            <img
                                alt={book?.title}
                                width="100%"
                                height="100%"
                                src={`https://covers.openlibrary.org/b/isbn/${book?.isbn}-M.jpg`}
                                style={{objectFit: "contain"}}
                            />
                        </Box>
                        <Box flex="1 1 50%" mb="40px">
                            <Box display="flex" justifyContent="space-between">
                                <Box>Home/Item</Box>
                                <Box>Prev Next</Box>
                            </Box>
                            //TODO: make content align to the left
                            <Box alignItems="flex-start" justifyContent="flex-start">
                                <Box m="65px 0 25px 0">
                                    <Typography variant="h3">{book?.title}</Typography>
                                    <Typography>{book?.author}</Typography>
                                    <Typography sx={{ mt: "20px" }}>
                                        {description}
                                    </Typography>
                                </Box>
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
                                <Box>
                                    <Box m="20px 0 5px 0" display="flex">
                                        <FavouriteBorderOutlinedIcon />
                                        <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
                                    </Box>
                                    <Typography>CATEGORIES: {book?.categories}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box m="20px 0">
                    <Tabs value={value} onChange={handleChange}>
                    <Tab label="DESCRIPTION" value="description" />
                    <Tab label="REVIEWS" value="reviews" />
                    </Tabs>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap="15px">
                {value === "description" && (
                    <div>{description}</div>
                    )}
                {value === "reviews" && (
                    <div>reviews</div>
                    )}
                    </Box>
                    <Box mt="50px" width="100%">
                    <Typography variant="h3" fontWeight="bold">
                    Related Products
                    </Typography>
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
                </>
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