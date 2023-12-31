import {shades} from "../../../theme";
import {Box, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../../routes/routes";

const ZeroStep = () => {
    const navigate = useNavigate();

    return (
        <Box
            width="80%"
            height="300px"
            ml="auto"
            mr="auto"
            mb="70px"
            sx={{ backgroundColor: shades.neutral[200] }}
        >
            <Box display="flex">
                <Typography
                    sx={{ m: "50px auto" }}
                    variant="h2">
                    Your cart is empty
                </Typography>
            </Box>
            <Box display="flex" >
                <Typography
                    sx={{
                        m: "0 auto",
                        color: `rgba(195,73,0,1.00)`,
                        ":hover": {cursor: "pointer"}
                    }}
                    onClick={() => navigate(ROUTES.HOME)}
                >
                    Go to the main page
                </Typography>
            </Box>
        </Box>
    );
}

export default ZeroStep;