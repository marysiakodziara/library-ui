import {Box, Collapse, Divider, List, ListItem, ListSubheader, Skeleton} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {shades} from "../../../theme";
import React, {useState} from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../../app/hooks";
import {Category, selectAllCategories, selectStatus} from "../../../state/book/bookReducer";
import {ROUTES} from "../../../routes/routes";

const NavigationMenu = () => {
    const [open, setOpen] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false]);
    const navigate = useNavigate();
    const categories: Category = useAppSelector(selectAllCategories);
    const status = useAppSelector(selectStatus);

    const handleClick = (index: number) => {
        setOpen((prevOpen) => {
            const newState = [...prevOpen];
            newState[index] = !newState[index];
            return newState;
        });
    }

    const handleNavigate = (categories: string[]) => {
        const categoriesString = categories.join(",").toLowerCase();
        const path = ROUTES.CATEGORIES.replace(':categories', categoriesString).replace(':page', '0');
        navigate(path);
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
                { status === 'fulfilled' && (
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
                                <ListItemButton>
                                    <ListItemText primary={mainCategory} onClick={() => handleNavigate(subCategories)}/>
                                    { subCategories.length > 0 && (
                                        open[index] ?
                                            <ExpandLess onClick={() => handleClick(index)} /> :
                                            <ExpandMore onClick={() => handleClick(index)}/>
                                    ) }
                                </ListItemButton>
                                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {subCategories.map((subCategory: String) => (
                                            <ListItemButton
                                                onClick={() => {
                                                    const path = ROUTES.CATEGORIES.replace(':categories', subCategory.toLowerCase()).replace(':page', '0');
                                                    navigate(path)
                                                }}
                                                sx={{ pl: 4 }}>
                                                <ListItemText primary={subCategory} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ))}

                    </List>
                )}
                { status !== 'fulfilled' && (
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
                        {Array(8).fill(0).map((_, index) => (
                            <Box
                                p="0 10px"
                                mb="5px"
                            >
                                <Box
                                    sx={{ backgroundColor: shades.neutral[300] }}
                                    height="50px"
                                    display="flex"
                                    alignItems="center"
                                >
                                    <Skeleton
                                        key={index}
                                        variant="text"
                                        height="20px"
                                        width="50%"
                                        sx={{ ml: "10px" }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </List>
                )}


            </Box>
    );
}

export default NavigationMenu;
