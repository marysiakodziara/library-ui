import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, IconButton, Typography, useTheme, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { shades } from '../theme';
import {addToCart, decreaseCount, increaseCount, Item} from "../state/cart/cartReducer";
import { useNavigate } from 'react-router-dom';


const Book = ({item, width}: {item: Item, width: string}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const {palette: {info}} = useTheme();
    const { category, price, name} = item.attributes;

    return (
        <Box width={width}>
            <Box
                position="relative"
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}>
                <img
                    src={`https://covers.openlibrary.org/b/isbn/${item.isbn}-L.jpg`}
                    alt={item.name}
                    width="300px"
                    height="400px"
                    onClick={() => navigate(`/item/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                />
                <Box
                    display={isHovered ? 'blocked' : 'none'}
                    position="absolute"
                    bottom="10%"
                    left="0"
                    width="100%"
                    padding="0 5%"
                >
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
                            >
                                <AddIcon/>
                            </IconButton>
                        </Box>
                        <Button
                            onClick={() => dispatch(addToCart({item: {...item, count}}))}
                            sx={{ backgroundColor: shades.primary[300], color: "white" }}
                        >
                            Add to cart
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box mt="3px">
                <Typography fontWeight="bold" >{item.name}</Typography>
                <Typography>{item.author}</Typography>

            </Box>
        </Box>
    )
}

export default Book;