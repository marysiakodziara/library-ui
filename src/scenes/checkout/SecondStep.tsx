import {Box, Button, Divider, Typography} from "@mui/material";
import {shades} from "../../theme";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchReservationHistory} from "../../state/account/accountReducer";
import {ROUTES} from "../../routes/routes";
import {selectRole} from "../../state/security/securityReducer";


const SecondStep = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleNavigate = (location: ROUTES, state?: string) => {
        dispatch(fetchReservationHistory())
        navigate(state ? `${location}?tab=${state}` : location);
    }
    const userRole = useAppSelector(selectRole);

    return (
        <Box
            width="60%"
            ml="auto"
            mr="auto"
            mb="70px"
            sx={{backgroundColor: shades.neutral[100]}}
            height="400px"
        >
            <Box width="100%" display="flex">
                <Typography variant="h2" sx={{m:"30px auto", color: '#8EAE7D'}}>Your Reservation Has Been Placed</Typography>
            </Box>
            <Box width="100%" display="flex">
                <CheckCircleOutlineIcon sx={{fontSize: 140, color: '#BBD5AE', m: "auto auto"}}/>
            </Box>
            <Box width="80%" display="flex" justifyContent='space-between' sx={{m: "40px auto"}}>
                <Button
                    sx={{fontWeight: 'bold', fontSize: '13px'}}
                    onClick={() => handleNavigate(ROUTES.HOME)}
                >
                    <KeyboardArrowLeftIcon sx={{fontSize: '20px'}}/>
                    Go To Main Page
                </Button>
                <Button
                    sx={{fontWeight: 'bold', fontSize: '13px'}}
                    onClick={() => {
                        userRole === 'manager' ? handleNavigate(ROUTES.ADMIN) : handleNavigate(ROUTES.ACCOUNT, "reservationHistory");
                    }}
                >
                    {userRole === 'manager' ? "See Dashboard" : "Your Reservations"}
                    <KeyboardArrowRightIcon sx={{fontSize: '20px'}}/>
                </Button>
            </Box>

        </Box>)
}

export default SecondStep;