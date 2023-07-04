import {Avatar, Box, Button, Divider, Typography} from "@mui/material";
import { shades } from "../../theme";
import {useState} from "react";
import PersonalInformation from "./PersonalInformation";
import BorrowingHistory from "./BorrowingHistory";
import ReservationHistory from "./ReservationHistory";

const Account = () => {
    const [subCategory, setSubCategory] = useState<string>('personalInformation');

    return (
        <Box mt="100px" width="80%" mr="auto" ml="auto" >
            <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                mt="auto"
                mb="auto"
                height="70px"
                alignItems="center"
                padding="0 3%"
            >
                <Typography variant="h3" fontWeight="bold">Library Account</Typography>
                <Button sx={{
                    width: "100px",
                    height: "45px",
                    backgroundColor: `rgba(255, 135, 62,1.00)`,
                    fontSize: "13px",
                    borderRadius: 10,
                }}>
                    Sign Out
                </Button>
            </Box>
            <Divider />
            <Box
                width="100%"
                display="flex"
                m="0 auto"
                sx={{backgroundColor: shades.neutral[100]}}
                padding="3% 3%"
            >
                <Box width="30%">
                    <Avatar sx={{ width: 150, height: 150, ml: "20px" }}/>
                    <Typography variant="h3" mt="20px" fontWeight="bold">Marysia Antoniak</Typography>
                    <Typography sx={{ color: shades.neutral[700], mt: "10px" }}>userEmail@gmail.com</Typography>
                    <Typography
                        mt="60px"
                        variant="h5"
                        sx={{
                            '&:hover': { cursor: 'pointer' },
                            color: subCategory === 'personalInformation' ? `rgb(255, 135, 62)` : "black"}}
                        onClick={() => setSubCategory('personalInformation')}
                    >
                        Personal information</Typography>
                    <Typography
                        mt="20px"
                        variant="h5"
                        sx={{
                            '&:hover': { cursor: 'pointer' },
                            color: subCategory === 'borrowingHistory' ? `rgb(255, 135, 62)` : "black"}}
                        onClick={() => setSubCategory('borrowingHistory')}
                    >
                        Borrowing history</Typography>
                    <Typography
                        mt="20px"
                        variant="h5"
                        sx={{
                            '&:hover': { cursor: 'pointer' },
                            color: subCategory === 'reservationHistory' ? `rgb(255, 135, 62)` : "black"}}
                        onClick={() => setSubCategory('reservationHistory')}
                    >
                        Reservation history</Typography>
                </Box>
                {subCategory === 'personalInformation' && (
                    <PersonalInformation />
                )}
                {subCategory === 'borrowingHistory' && (
                    <BorrowingHistory />
                )}
                {subCategory === 'reservationHistory' && (
                    <ReservationHistory />
                )}
            </Box>
        </Box>
    )
}

export default Account;