import {Box, Collapse, Divider, List, ListSubheader} from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {shades} from "../../../theme";
import {useState} from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const NavigationMenu = () => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClick = () => {
        setOpen(!open);
    };

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
                    < ListItemButton>
                        <ListItemText primary="Sent mail" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton>
                        <ListItemText primary="Sent mail" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton>
                        <ListItemText primary="Sent mail" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton>
                        <ListItemText primary="Sent mail" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={handleClick}>
                        <ListItemText primary="Inbox" />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Starred" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                </List>
            </Box>
    );
}

export default NavigationMenu;