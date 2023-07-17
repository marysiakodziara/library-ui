import React, { useEffect, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tab, Tabs, useMediaQuery } from '@mui/material';
import BookView from '../../components/BookView';
import {setItems} from '../../state/cart/cartReducer';
import {Book, selectAllBooks} from '../../state/book/bookReducer';
import listOfBooks from "../../state/cart/listOfBooks";
import {useAppSelector} from "../../app/hooks";



const ShoppingList = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState("all");
    const books = useAppSelector(selectAllBooks);
    const isNonMobile = useMediaQuery('(min-width:600px)');

    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
        setValue(newValue);
    };

    const topRatedItems = books.filter(
        (book: Book) => book.categories.includes("topRated")
    )
    const newArrivalsItems = books.filter(
        (book: Book) => book.categories.includes("newArrivals")
    )
    const bestSellersItems = books.filter(
        (book: Book) => book.categories.includes("bestSellers")
    )

    return (
        <Box width="80%" margin="20px auto">
            <Typography variant="h3" textAlign="center">
                Our Featured <b>Products</b>
            </Typography>
            <Tabs
                textColor="primary"
                indicatorColor="primary"
                value={value}
                onChange={handleChange}
                centered
                TabIndicatorProps={{sx: {display: isNonMobile ? "block" : "none"}}}
                sx={{
                    m: "25px",
                    "&.MuiTabs-flexContainer": {
                        flexWrap: "wrap",
                    }
                }}
            >
                <Tab label="ALL" value="all"/>
                <Tab label="NEW ARRIVALS" value="newArrivals"/>
                <Tab label="BEST SELLERS" value="bestSellers"/>
                <Tab label="TOP RATED" value="topRated"/>
            </Tabs>
            <Box
                margin="0 auto"
                display="grid"
                gridTemplateColumns="repeat(auto-fill, 300px)"
                justifyContent="space-around"
                rowGap="20px"
                columnGap="1.33%"
            >
                {value === "all" && books.map((book: Book) => (
                    <BookView book={book} key={`${book.title}-${book.id}`} width={"300px"} />
                    ))}
                {value === "neArrivals" && newArrivalsItems.map((book: Book) => (
                    <BookView book={book} key={`${book.title}-${book.id}`} width={"300px"} />
                ))}
                {value === "bestSellers" && bestSellersItems.map((book: Book) => (
                    <BookView book={book} key={`${book.title}-${book.id}`} width={"300px"} />
                ))}
                {value === "topRated" && topRatedItems.map((book: Book) => (
                    <BookView book={book} key={`${book.title}-${book.id}`} width={"300px"} />
                ))}

            </Box>
        </Box>
    )
}

export default ShoppingList;