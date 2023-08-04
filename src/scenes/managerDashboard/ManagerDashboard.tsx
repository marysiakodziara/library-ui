import {Box, Paper, Tab, Tabs, Typography, useMediaQuery} from "@mui/material";
import {useAppSelector} from "../../app/hooks";
import {selectRole} from "../../state/security/securityReducer";
import ErrorPage from "../global/ErrorPage";
import {shades} from "../../theme";
import {SyntheticEvent, useState} from "react";
import AddBook from "./AddBook";
import {styled} from "@mui/material/styles";

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 0,
    lineHeight: '60px',
}));

const ManagerDashboard = () => {
    const userRole = useAppSelector(selectRole);
    const [value, setValue] = useState(0);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box>
            { userRole !== "MANAGER" && (
                <ErrorPage/>
            )}
            { userRole === "MANAGER" && (
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
                                <Tab label="Manage Clients" sx={{alignItems: "start"}}/>
                            </Tabs>
                        </Item>
                        <Box width="80%">
                            { value === 0 && (
                                <AddBook />)}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default ManagerDashboard;