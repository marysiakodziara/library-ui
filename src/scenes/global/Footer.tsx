import { useTheme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { shades } from '../../theme';
import {useLocation} from "react-router-dom";

const Footer = () => {
    const location = useLocation();
    const path = location.pathname;
    const { palette: { info }} = useTheme();

    return (
        <>
            { path === "/admin" && (
                <></>
            )}
            { path !== "/admin" && (
                <Box p="40px 0" mt="70px" sx={{backgroundColor: info.light}}>
                    <Box
                        width="80%"
                        margin="auto"
                        display="flex"
                        justifyContent="space-between"
                        flexWrap="wrap"
                        rowGap="30px"
                        columnGap="clamp(20px, 30px, 40px)"
                    >
                        <Box width="clamp(20%, 30%, 40%)">
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                mb="30px"
                                color={shades.secondary[500]}
                            >
                                Library
                            </Typography>
                            <div>
                                Discover a wide selection of books at our e-Library,
                                where you can find the perfect read for you and your family.
                                Join our community and get easy access to reserving and borrowing books.
                            </div>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" mb="30px">
                                About Us
                            </Typography>
                            <Typography mb="30px">Careers</Typography>
                            <Typography mb="30px">Our Store</Typography>
                            <Typography mb="30px">Terms & Conditions</Typography>
                            <Typography mb="30px">Privacy Policy</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" mb="30px">
                                Customer Care
                            </Typography>
                            <Typography mb="30px">Help Center</Typography>
                            <Typography mb="30px">Track Your Reservations</Typography>
                            <Typography mb="30px">Options for Schools</Typography>
                            <Typography mb="30px">How to Make a Reservation</Typography>
                        </Box>
                        <Box width="clamp(20%, 25%, 30%)">
                            <Typography variant="h4" fontWeight="bold" mb="30px">
                                Contact Us
                            </Typography>
                            <Typography mb="30px">Konoha, North 50</Typography>
                            <Typography mb="30px">Email: bestLibraryEver@gmail.com</Typography>
                            <Typography mb="30px">508-764-745</Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    )

}

export default Footer;
