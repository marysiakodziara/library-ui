import {Box, Collapse, Divider, List, ListSubheader} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {shades} from "../../../theme";
import {useState} from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {Category, selectAllCategories} from "../../../state/book/bookReducer";

const NavigationMenu = () => {
    const [open, setOpen] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false]);
    const navigate = useNavigate();
    const categories: Category = useAppSelector(selectAllCategories);

    const handleClick = (index: number) => {
        setOpen((prevOpen) => {
            const newState = [...prevOpen];
            newState[index] = !newState[index];
            return newState;
        });
    }


    return (
            <Box
                sx={{ backgroundColor: shades.neutral[100] }}
                position="fixed"
                width="max(300px, 20%)"
                mt="60px"
                height="100%"
                left="0"
                top="0"
                overflow="auto">

                <List
                    sx={{ width: '100%', maxWidth: 360, m: "0 auto" }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader
                            sx={{ backgroundColor: shades.neutral[100], mb: "8px" }}
                            id="nested-list-subheader">
                            Books Categories
                            <Divider/>
                        </ListSubheader>
                    }
                >
                    {Object.entries(categories).map(([mainCategory, subCategories], index) => (
                        <>
                            <ListItemButton onClick={() => handleClick(index)}>
                                <ListItemText primary={mainCategory} />
                                { subCategories.length > 0 && (
                                    open[index] ? <ExpandLess /> : <ExpandMore />
                                ) }
                            </ListItemButton>
                            <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {subCategories.map((subCategory: String) => (
                                        <ListItemButton
                                            onClick={() => navigate(`/books/${mainCategory}/${subCategory}`)}
                                            sx={{ pl: 4 }}>
                                            <ListItemText primary={subCategory} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </>
                    ))}

                </List>
            </Box>
    );
}

export default NavigationMenu;
