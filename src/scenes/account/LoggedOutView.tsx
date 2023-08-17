import {Box, Typography} from "@mui/material";

const LoggedOutView = () => {
    return (
        <Box width="100%" mt='160px' display="flex" justifyContent="center" alignItems="center">
            <Typography textAlign="center" variant="h3">Log in to check Your account details</Typography>
        </Box>
    );
}

export default LoggedOutView;