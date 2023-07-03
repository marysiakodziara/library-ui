import { SetStateAction, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Box, IconButton, Typography, Button, Tabs, Tab} from '@mui/material';
import FavouriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {shades} from '../../theme';
import {addToCart, decreaseCount, increaseCount, Item} from "../../state/cart/cartReducer";
import {useParams} from 'react-router-dom';
import Book from '../../components/Book';
import listOfBooks from "../../state/cart/listOfBooks";

const BookDetails = () => {
    const dispatch = useDispatch();
    const { itemId } = useParams();
    const [value, setValue] = useState("description");
    const [count, setCount] = useState(1);
    const [item, setItem] = useState<Item | null>(null);
    const [items, setItems] = useState<Item[]>([]);

    const handleChange = (event: any, newValue: SetStateAction<string>) => {
        setValue(newValue);
    }

    async function getItem() {
        /*const item = await fetch(
            `https://fakestoreapi.com/products/${itemId}`,
            {method: "GET"}
        );
        const itemJson = await item.json();
        setItem(itemJson.data);*/
        itemId ? setItem(listOfBooks[parseInt(itemId) - 1]) : setItem(null);
    }

    async function getItems() {
        const items = await fetch(
            "https://fakestoreapi.com/products",
            {method: "GET"}
        );
        const itemsJson = await items.json();
        setItems(listOfBooks);
    }

    useEffect(() => {
        getItem();
        getItems();
    }, [itemId]);

    return (
        <Box width="80%" m="80px auto">
            <Box display="flex" flexWrap="wrap" columnGap="40px">
                <Box flex="1 1 40%" mb="40px">
                    <img
                        alt={item?.name}
                        width="100%"
                        height="100%"
                        src={`https://covers.openlibrary.org/b/isbn/${item?.isbn}-M.jpg`}
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
                            <Typography variant="h3">{item?.name}</Typography>
                            <Typography>{item?.attributes?.price}</Typography>
                            <Typography>{item?.author}</Typography>
                            <Typography sx={{ mt: "20px" }}>
                                {item?.attributes?.description}
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
                                onClick={() => dispatch(addToCart({item: {...item, count}}))}
                            >
                                ADD TO CART
                            </Button>
                        </Box>
                        <Box>
                            <Box m="20px 0 5px 0" display="flex">
                                <FavouriteBorderOutlinedIcon />
                                <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
                            </Box>
                            <Typography>CATEGORIES: {item?.attributes?.category}</Typography>
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
                    <div>{item?.attributes?.description}</div>
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
                    {items.slice(0, 4).map((item, i) => (
                    <Book key={`${item?.name}-${i}`} item={item} width={"100%"}/>))}
                </Box>
            </Box>
        </Box>
    );
}

export default BookDetails;