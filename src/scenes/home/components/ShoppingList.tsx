import React, {useEffect, useState,} from 'react';
import {Box, Skeleton, Tab, Tabs, Typography, useMediaQuery} from '@mui/material';
import BookView from '../../global/BookView';
import {
    Book,
    fetchHomePageBooksAll,
    fetchHomePageBooksBestsellers,
    fetchHomePageBooksNewArrivals,
    HomePageBooks,
    selectAllHomePageBooks,
    selectAllHomePageStatus
} from '../../../state/book/bookReducer';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";

const ShoppingList = () => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("all");
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const homePageBooks: HomePageBooks = useAppSelector(selectAllHomePageBooks);
    const allBooks = homePageBooks.all;
    const newArrivalsItems = homePageBooks.newArrivals;
    const bestSellersItems = homePageBooks.bestsellers;
    const status = useAppSelector(selectAllHomePageStatus);

    useEffect(() => {
        dispatch(fetchHomePageBooksAll());
        dispatch(fetchHomePageBooksNewArrivals());
        dispatch(fetchHomePageBooksBestsellers());
    }, []);

    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
        setValue(newValue);
    };

    return (
        <Box width="80%" mt="20px" ml='auto' mr='auto' mb='70px' >
            <Typography variant="h3" textAlign="center">
                Our Featured <b>Books</b>
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
            </Tabs>
            { status !== 'fulfilled' && (
                <Box
                    margin="0 auto"
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, 250px)"
                    justifyContent="space-around"
                    rowGap="20px"
                    columnGap="1.33%"
                >
                    {Array(4).fill(0).map((_, index) => (
                        <Skeleton key={index} variant="rectangular" height="350px"/>
                    ))}
                </Box>
                )}
            { status === 'fulfilled' && (
                <Box
                    margin="0 auto"
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, 250px)"
                    justifyContent="space-around"
                    rowGap="20px"
                    columnGap="1.33%"
                >
                    {value === "all" && allBooks?.books.map((book: Book) => (
                        <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                    ))}
                    {value === "newArrivals" && newArrivalsItems?.books.map((book: Book) => (
                        <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                        ))}
                    {value === "bestSellers" && bestSellersItems?.books.map((book: Book) => (
                        <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                        ))}
                </Box>
            )}
        </Box>
    )
}

export default ShoppingList;