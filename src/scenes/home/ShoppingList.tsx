import React, { useEffect, useState, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Tab, Tabs, useMediaQuery } from '@mui/material';
import Book from '../../components/Book';
import {Item, setItems} from '../../state/cart/cartReducer';
import listOfBooks from "../../state/cart/listOfBooks";



const ShoppingList = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState("all");
    const items = useSelector((state: any) => state.cart.items);
    const isNonMobile = useMediaQuery('(min-width:600px)');

    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
        setValue(newValue);
    };

    async function getItems() {
        /*const items = await fetch(
            "https://fakestoreapi.com/products/1",
            {method: "GET"}
        );

        const itemsJson = await items.json();
        dispatch(setItems(itemsJson.data));*/
        dispatch(setItems(listOfBooks));
    }

    useEffect(() => {
        getItems();
    }, []);

    const topRatedItems = items.filter(
        (item: Item) => item.attributes.category === "topRated"
    )
    const newArrivalsItems = items.filter(
        (item: Item) => item.attributes.category === "newArrivals"
    )
    const bestSellersItems = items.filter(
        (item: Item) => item.attributes.category === "bestSellers"
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
                {value === "all" && items.map((item: Item) => (
                    <Book item={item} key={`${item.name}-${item.id}`} width={"300px"} />
                    ))}
                {value === "neArrivals" && newArrivalsItems.map((item: Item) => (
                    <Book item={item} key={`${item.name}-${item.id}`} width={"300px"} />
                ))}
                {value === "bestSellers" && bestSellersItems.map((item: Item) => (
                    <Book item={item} key={`${item.name}-${item.id}`} width={"300px"} />
                ))}
                {value === "topRated" && topRatedItems.map((item: Item) => (
                    <Book item={item} key={`${item.name}-${item.id}`} width={"300px"} />
                ))}

            </Box>
        </Box>
    )
}

export default ShoppingList;