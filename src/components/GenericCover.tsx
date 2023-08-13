import {Box} from "@mui/material";
import {ROUTES} from "../routes/routes";
import {useNavigate} from "react-router-dom";

export enum GenericCoverSize {
    SMALL = "small",
    LARGE = "large"
}



const GenericCover = (props: {bookId: number, size: GenericCoverSize}) => {
    const {bookId, size} = props;
    const navigate = useNavigate();
    const importLogo = (r: __WebpackModuleApi.RequireContext) => {
        const imagePath = r.keys()[0];
        return r(imagePath);
    };

    const styles = {
        small: {
            width: '123px',
            height: '164px',
            '&:hover': {cursor: 'pointer'}
        },
        large: {
            width: '250px',
            height: '350px',
            '&:hover': {cursor: 'pointer'}
        }
    }

    const logoImport = importLogo(
        require.context("../assets/logo", false, /\.(png|jpe?g|svg)$/)
    );

    return (
        <Box sx={styles[size]} display="flex"
             onClick={() => {
                 const path = ROUTES.BOOK.replace(':bookId', bookId.toString());
                 navigate(path);
             }}
        >
            <Box m="auto auto">
                <img
                    src={logoImport}
                    alt={"logo"}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.05,
                    }}
                />
            </Box>
        </Box>
    )
}

export default GenericCover;