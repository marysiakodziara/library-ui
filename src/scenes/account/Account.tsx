import {useAuth0} from "@auth0/auth0-react";
import LoggedInView from "./LoggedInView";
import LoggedOutView from "./LoggedOutView";
import {Box, CircularProgress} from "@mui/material";
import { shades } from "../../theme";
import {useParams} from "react-router-dom";

const Account = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const { tab } = useParams();
    const subCategory: string = tab !== undefined ? tab : "";

    if (isLoading) {
        return (
            <Box width="100%" display="flex" m="0 auto">
                <CircularProgress
                    size={200}
                    sx={{
                    size: 400,
                    color: shades.neutral[500],
                    m: "10% auto",
                }}/>
            </Box>
        )

    }

    return (
        <>
        { isAuthenticated && (
           < LoggedInView category={subCategory}/>
        )}
        { !isAuthenticated && (
            <LoggedOutView />
        )}
        </>
    );
}

export default Account;