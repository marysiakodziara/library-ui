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

    const handleNavigate = (categories: string[]) => {
        const categoriesString = categories.join(",").toLowerCase();
        navigate(`/${categoriesString}/0`);
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
                                            onClick={() => navigate(`/${subCategory}/0`)}
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
