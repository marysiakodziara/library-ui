import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {Box, Button, Divider, IconButton, Skeleton, Tab, Tabs, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {shades} from '../../theme';
import {addToCart, OrderItem} from "../../state/cart/cartReducer";
import {Book, fetchRandomBooks, selectAllBooks} from '../../state/book/bookReducer';
import {useLocation, useParams} from 'react-router-dom';
import BookView from '../global/BookView';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import ErrorPage from "../global/ErrorPage";
import BookDetailsSkeleton from "./components/BookDetailsSkeleton";
import GenericCover, {GenericCoverSize} from "../global/GenericCover";

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
    const [isBookReturned, setIsBookReturned] = useState(true);
    const [image, setImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    async function fetchBook() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/book/id?id=${id}`);
            const data = response.ok ? await response.json() : null;
            setBook(data);
            setIsBookReturned(data !== null)
            setLoading(false);
        } catch (error) {
            setBook(null);
            setIsBookReturned(false)
            setLoading(false);
        }
    }

    async function fetchData() {
        try {
            const openLibraryApiUrl = `https://openlibrary.org/search.json?title=${book?.title}`;
            const openLibraryResponse = await fetch(openLibraryApiUrl);
            const openLibraryData = await openLibraryResponse.json();

            if (openLibraryData.docs && openLibraryData.docs.length > 0) {
                const bookCoverId = openLibraryData.docs[0].cover_i;
                const coverUrl = `https://covers.openlibrary.org/b/id/${bookCoverId}-L.jpg`

                setDescription(openLibraryData.docs[0]?.title_suggest || "");
                setProductDetails({
                    author: openLibraryData.docs[0]?.author_name?.[0] || "",
                    publisher: openLibraryData.docs[0]?.publisher?.[0] || "",
                    publishedDate: openLibraryData.docs[0]?.publish_date?.[0] || "",
                    pageCount: openLibraryData.docs[0]?.number_of_pages || "",
                    averageRating: openLibraryData.docs[0]?.average_rating || ""
                });
                coverUrl.length > 0 ? setImage(coverUrl) : setImage('');
                setIsImageLoaded(true);
            } else {
                console.log('No book data found or missing required properties.');
                setIsImageLoaded(true);
            }
        } catch (error) {
            console.error('An error occurred while fetching book data:', error);
            setIsImageLoaded(true);
        }
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
        setImage("");
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

    const handleAddToCart = (book: Book, quantity: number, bookImage: string) => {
        const image = bookImage ? bookImage : 'none';
        const newItem: OrderItem = {book, quantity, image};
        dispatch(addToCart(newItem));
    }

    const filteredBooks = books?.filter(book => book.id !== id);

    return (
        <Box width="100%" m="100px auto">
            { !loading && book && isBookReturned &&  (
                <Box >
                    <Box sx={{backgroundColor: shades.neutral[100]}} p="20px 5%" >
                        <Box width="90%" display="flex" flexWrap="wrap" columnGap="70px" m="auto auto">
                            <Box flex="1 1 25%" m="auto auto">
                                { isImageLoaded && image !== '' && (
                                    <img
                                        alt={book?.title}
                                        width="90%"
                                        src={image}
                                        style={{objectFit: "contain"}}
                                    />
                                )}
                                { isImageLoaded && image === '' && (
                                    <GenericCover bookId={book?.id} size={GenericCoverSize.LARGE}/>
                                )}
                                { !isImageLoaded && (
                                    <Skeleton variant="rectangular" width="90%" height="400px" />
                                )}
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
                                                onClick={() => handleAddToCart(book, count, image)}
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
            { !(!loading && book) && isBookReturned && (
                <BookDetailsSkeleton />
            )}
            { !isBookReturned && (
                <ErrorPage />
            )}
        </Box>
    );
}

export default BookDetails;