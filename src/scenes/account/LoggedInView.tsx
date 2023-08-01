import {Avatar, Box, Button, Divider, Typography} from "@mui/material";
import {shades} from "../../theme";
import PersonalInformation from "./PersonalInformation";
import BorrowingHistory from "./BorrowingHistory";
import ReservationHistory from "./ReservationHistory";
import {FC, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useAppSelector} from "../../app/hooks";
import {selectLoggedUser} from "../../state/security/securityReducer";
import axios from "axios";

export interface User {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    address: string;
}

const LoggedInView: FC<{category: string}> = (props) => {
    const [subCategory, setSubCategory] = useState<string>('');
    const location = useLocation();
    const [user, setUser] = useState<User>({
        firstName: '',
        lastName: '',
        emailAddress: '',
        phoneNumber: '',
        address: '',
    });
    const token = useAppSelector(selectLoggedUser);

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    const fetchUser = async () => {
        try {
            const response: User = (await axios.get(`http://localhost:8080/api/v1/client`, {headers})).data;
            setUser(response);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [token]);

    useEffect(() => {
        switch (props.category) {
            case 'borrowingHistory':
                setSubCategory('borrowingHistory');
                break;
            case 'reservationHistory':
                setSubCategory('reservationHistory');
                break;
            default:
                setSubCategory('personalInformation');
                break;
        }
    }, []);

    const handleSubCategoryChange = (subCategory: string) => {
        setSubCategory(subCategory);
        window.history.pushState(null, '', `${location.pathname}?tab=${subCategory}`);
    }

    return (
        <Box mt="80px" width="80%" mr="auto" ml="auto">
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
                m="0 auto"
                sx={{backgroundColor: shades.neutral[100]}}
                padding="3% 3%"
                display="flex"
            >
                <Box width="30%">
                    <Avatar sx={{ width: 150, height: 150, ml: "20px" }}/>
                    <Typography variant="h3" mt="20px" fontWeight="bold">{user.firstName} {user.lastName}</Typography>
                    <Typography
                        mt="60px"
                        variant="h5"
                        sx={{
                            '&:hover': { cursor: 'pointer' },
                            color: subCategory === 'personalInformation' ? `rgb(255, 135, 62)` : "black"}}
                        onClick={() => handleSubCategoryChange('personalInformation')}
                    >
                        Personal information</Typography>
                    <Typography
                        mt="20px"
                        variant="h5"
                        sx={{
                            '&:hover': { cursor: 'pointer' },
                            color: subCategory === 'borrowingHistory' ? `rgb(255, 135, 62)` : "black"}}
                        onClick={() => handleSubCategoryChange('borrowingHistory')}
                    >
                        Borrowing history</Typography>
                    <Typography
                        mt="20px"
                        variant="h5"
                        sx={{
                            '&:hover': { cursor: 'pointer' },
                            color: subCategory === 'reservationHistory' ? `rgb(255, 135, 62)` : "black"}}
                        onClick={() => handleSubCategoryChange('reservationHistory')}
                    >
                        Reservation history</Typography>
                </Box>
                {subCategory === 'personalInformation' && (
                    <PersonalInformation  address={user.address} emailAddress={user.emailAddress} firstName={user.firstName} lastName={user.lastName} phoneNumber={user.phoneNumber}/>
                )}
                {subCategory === 'borrowingHistory' && (
                    <BorrowingHistory />
                )}
                {subCategory === 'reservationHistory' && (
                    <ReservationHistory />
                )}
            </Box>
        </Box>
    );
}

export default LoggedInView;