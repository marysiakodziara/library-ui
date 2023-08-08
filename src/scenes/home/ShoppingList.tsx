import React, {useEffect, useState,} from 'react';
import {Box, CircularProgress, Tab, Tabs, Typography, useMediaQuery} from '@mui/material';
import BookView from '../../components/BookView';
import {
    Book,
    fetchHomePageBooksAll, fetchHomePageBooksBestsellers,
    fetchHomePageBooksNewArrivals, HomePageBooks,
    selectAllHomePageBooks
} from '../../state/book/bookReducer';
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {shades} from "../../theme";

const ShoppingList = () => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState("all");
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [called, setCalled] = useState<boolean>(false);
    const homePageBooks: HomePageBooks = useAppSelector(selectAllHomePageBooks);
    const allBooks = homePageBooks.all;
    const newArrivalsItems = homePageBooks.newArrivals;
    const bestSellersItems = homePageBooks.bestsellers;

    useEffect(() => {
        dispatch(fetchHomePageBooksAll());
        dispatch(fetchHomePageBooksNewArrivals());
        dispatch(fetchHomePageBooksBestsellers());
        setCalled(true);
    }, []);

    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
        setValue(newValue);
    };

    return (
        <Box width="80%" margin="20px auto">
            { (!called || allBooks.length == 0) && (
                <CircularProgress
                    size={200}
                    sx={{
                        size: 400,
                        color: shades.neutral[500],
                        m: "auto auto",
                    }}/>
            )}
            { called && (
                <>
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
                    <Box
                        margin="0 auto"
                        display="grid"
                        gridTemplateColumns="repeat(auto-fill, 250px)"
                        justifyContent="space-around"
                        rowGap="20px"
                        columnGap="1.33%"
                    >
                        {value === "all" && allBooks?.map((book: Book) => (
                            <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                        ))}
                        {value === "newArrivals" && newArrivalsItems?.map((book: Book) => (
                            <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                        ))}
                        {value === "bestSellers" && bestSellersItems?.map((book: Book) => (
                            <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                        ))}
                    </Box>
                </>
            )}

        </Box>
    )
}

export default ShoppingList;