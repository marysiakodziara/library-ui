import {Box, Typography} from "@mui/material";

const ErrorPage = () => {
    return (
        <Box display="flex" width="100%" height="100px">
            <Typography variant="h1" sx={{m: "auto auto"}} >Page not found</Typography>
        </Box>
    );
}

export default ErrorPage;