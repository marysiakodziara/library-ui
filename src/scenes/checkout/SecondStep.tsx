import {Box, Button, Divider, Typography} from "@mui/material";
import {shades} from "../../theme";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {fetchReservationHistory} from "../../state/account/accountReducer";


const SecondStep = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handeNavigate = (location: string) => {
        dispatch(fetchReservationHistory())
        navigate(location);
    }

    return (
        <Box
            width="60%"
            margin="auto"
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
                    onClick={() => handeNavigate("/")}
                >
                    <KeyboardArrowLeftIcon sx={{fontSize: '20px'}}/>
                    Go To Main Page
                </Button>
                <Button
                    sx={{fontWeight: 'bold', fontSize: '13px'}}
                    onClick={() => handeNavigate("/account?tab=reservationHistory")}
                >
                    Your Reservations
                    <KeyboardArrowRightIcon sx={{fontSize: '20px'}}/>
                </Button>
            </Box>

        </Box>)
}

export default SecondStep;