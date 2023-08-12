import {Box} from "@mui/material";
import {ROUTES} from "../routes/routes";
import {useNavigate} from "react-router-dom";

const GenericCover = (props: {bookId: number}) => {
    const {bookId} = props;
    const navigate = useNavigate();
    const importLogo = (r: __WebpackModuleApi.RequireContext) => {
        const imagePath = r.keys()[0];
        return r(imagePath);
    };

    const logoImport = importLogo(
        require.context("../assets/logo", false, /\.(png|jpe?g|svg)$/)
    );

    return (
        <Box width="250px" height="350px" display="flex"
             onClick={() => {
                 const path = ROUTES.BOOK.replace(':bookId', bookId.toString());
                 navigate(path);
             }}
             sx={{'&:hover': {cursor: 'pointer'}}}
        >
            <Box m="auto auto">
                <img
                    src={logoImport}
                    alt={"logo"}
                    style={{
                        objectFit: "cover",
                        opacity: 0.05,
                    }}
                />
            </Box>
        </Box>
    )
}

export default GenericCover;