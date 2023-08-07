import {Box, Typography, useMediaQuery} from "@mui/material";
import {shades} from "../../theme";
import {User} from "./LoggedInView";

const PersonalInformation = (user: User) => {
    const isNonMobile = useMediaQuery('(max-width: 600px)');

    return (
        <Box width="100%" mb="10%" paddingLeft="3%">
            <Box>
                <Typography variant="h3" fontWeight="bold">Personal Information</Typography>
                <Box color={shades.neutral[700]} mt="20px" mb="50px">
                    Manage your personal information, including phone number and email address where you can be contacted.
                </Box>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, 400px)"
                justifyContent="space-around"
                rowGap="10%"
                columnGap="1.33%"
                overflow={isNonMobile ? "scroll" : "visible"}
            >
                <Box
                    display="flex"
                    width="100%"
                    height="170px"
                    sx={{
                        backgroundColor: shades.neutral[300],
                        borderRadius: "20px",
                }}>
                    <Box width="80%" height="80%" m="10% auto">
                        <Typography variant="h6" fontWeight="bold">Name</Typography>
                        <Typography mt="20px">{user?.firstName} {user?.lastName}</Typography>
                    </Box>
                </Box>
                <Box
                    width="100%"
                    height="170px"
                    sx={{
                        backgroundColor: shades.neutral[300],
                        borderRadius: "20px",
                    }}>
                    <Box width="80%" height="80%" m="10% auto">
                        <Typography variant="h6" fontWeight="bold">Phone Number</Typography>
                        <Typography mt="20px">{user?.phoneNumber}</Typography>
                    </Box>
                </Box>
                <Box
                    width="100%"
                    height="170px"
                    sx={{
                        backgroundColor: shades.neutral[300],
                        borderRadius: "20px",
                    }}>
                    <Box width="80%" height="80%" m="10% auto">
                        <Typography variant="h6" fontWeight="bold">Library Card</Typography>
                        <Typography mt="20px">825-ck7-89w-oo9</Typography>
                    </Box>
                </Box>
                <Box
                    width="100%"
                    height="170px"
                    sx={{
                        backgroundColor: shades.neutral[300],
                        borderRadius: "20px",
                    }}>
                    <Box width="80%" height="80%" m="10% auto">
                        <Typography variant="h6" fontWeight="bold">Date of Birth</Typography>
                        <Typography mt="20px">07-11-2001</Typography>
                    </Box>
                </Box>
                <Box
                    width="100%"
                    height="170px"
                    sx={{
                        backgroundColor: shades.neutral[300],
                        borderRadius: "20px",
                    }}>
                    <Box width="80%" height="80%" m="10% auto">
                        <Typography variant="h6" fontWeight="bold">Email</Typography>
                        <Typography mt="20px">{user?.emailAddress}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PersonalInformation;