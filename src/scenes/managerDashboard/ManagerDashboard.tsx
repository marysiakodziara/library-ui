import {Box, Tab, Tabs, Typography} from "@mui/material";
import {useAppSelector} from "../../app/hooks";
import {selectRole} from "../../state/security/securityReducer";
import ErrorPage from "../global/ErrorPage";
import {shades} from "../../theme";
import {SyntheticEvent, useState} from "react";
import AddBook from "./AddBook";

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
                    <Box pt="60px" display="flex" height="100%">
                        <Box
                            sx={{ backgroundColor: shades.neutral[300] }}
                            width="max(300px, 20%)"
                            height="100%"
                            padding="10px 3px"
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
                        </Box>
                        { value === 0 && (
                            <AddBook/>)}
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default ManagerDashboard;