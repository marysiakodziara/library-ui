import {Box, Paper, Tab, Tabs} from "@mui/material";
import {shades} from "../../theme";
import {SyntheticEvent, useState} from "react";
import AddBook from "./AddBook";
import {styled} from "@mui/material/styles";
import OrdersList from "./OrdersList";

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 0,
    lineHeight: '60px',
}));

export enum OrdersType {
    BORROWED = "BORROWED",
    RESERVED = "RESERVED",
    OVERDUE = "OVERDUE",
}

const ManagerDashboard = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box
            sx={{ backgroundColor: shades.neutral[100] }}
            width="100%" height="100vh">
            <Box width="100%" pt="60px" display="flex" height="100%" justifyContent="space-between">
                <Item
                    elevation={5}
                    sx={{
                        backgroundColor: shades.neutral[400] ,
                        width: "20%",
                        height: "100%",
                        padding: "10px 3px"}}
                >
                    <Tabs
                        orientation="vertical"
                        value={value}
                        onChange={handleChange}
                    >
                        <Tab label="Add Book" sx={{alignItems: "start"}}/>
                        <Tab label="Borrowed Books" sx={{alignItems: "start"}}/>
                        <Tab label="Overdue Books"  sx={{alignItems: "start"}}/>
                        <Tab label="Book Reservations" sx={{alignItems: "start"}}/>
                    </Tabs>
                </Item>
                <Box width="80%">
                    { value === 0 && (
                        <AddBook />)}
                    { value === 1 && (
                        <OrdersList ordersType={OrdersType.BORROWED}/>
                    )}
                    { value === 2 && (
                        <OrdersList ordersType={OrdersType.OVERDUE}/>
                    )}
                    { value === 3 && (
                        <OrdersList ordersType={OrdersType.RESERVED}/>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

export default ManagerDashboard;