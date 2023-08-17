import {Box, Typography, useMediaQuery} from "@mui/material";
import {shades} from "../../theme";
import {User} from "./LoggedInView";

const PersonalInformation = (user: User) => {
    const isNonMobile = useMediaQuery('(max-width: 600px)');
    const userData = [
        {
            label: 'First Name',
            value: user?.firstName,
        },
        {
            label: 'Phone Number',
            value: user?.phoneNumber,
        },
        {
            label: 'Last Name',
            value: user?.lastName,
        },
        {
            label: 'Email',
            value: user?.emailAddress,
        },
    ];

    return (
        <Box width="100%" paddingLeft="3%" >
            <Box>
                <Typography variant="h3" fontWeight="bold">Personal Information</Typography>
                <Box color={shades.neutral[700]} mt="20px" mb="50px">
                    Manage your personal information, including phone number and email address where you can be contacted.
                </Box>
            </Box>
            <Box
                margin="0 auto"
                display="grid"
                gridTemplateColumns="repeat(auto-fill, 400px)"
                gridTemplateRows="repeat(auto-fill, 170px)"
                justifyContent="space-around"
                rowGap="20px"
                columnGap="1.33%"
            >
                {userData.map((data, index) => (
                    <Box
                        key={index}
                        display="flex"
                        width="100%"
                        sx={{
                            backgroundColor: shades.neutral[300],
                            borderRadius: "20px",
                        }}
                    >
                        <Box width="80%" height="80%" m="10% auto">
                            <Typography variant="h6" fontWeight="bold">
                                {data.label}
                            </Typography>
                            <Typography mt="20px">{data.value}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default PersonalInformation;