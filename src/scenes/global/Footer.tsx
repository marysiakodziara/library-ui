import { useTheme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { shades } from '../../theme';

const Footer = () => {
    const { palette: { info }} = useTheme();

    return (
        <Box p="40px 0" sx={{backgroundColor: info.light}}>
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
                        variant="h4"
                        fontWeight="bold"
                        mb="30px"
                        color={shades.secondary[500]}
                    >
                        ECOMMERCE
                    </Typography>
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Curabitur finibus in quam sed iaculis.
                        Integer tincidunt tempus risus at luctus.
                        Proin et tellus id augue sollicitudin porta.
                    </div>
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight="bold" mb="30px">
                        About Us
                    </Typography>
                    <Typography mb="30px">Careers</Typography>
                    <Typography mb="30px">Our Stores</Typography>
                    <Typography mb="30px">Terms & Conditions</Typography>
                    <Typography mb="30px">Privacy Policy</Typography>
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight="bold" mb="30px">
                        Customer Care
                    </Typography>
                    <Typography mb="30px">Help Center</Typography>
                    <Typography mb="30px">Track Your Order</Typography>
                    <Typography mb="30px">Corporate & Bulk Purchasing</Typography>
                    <Typography mb="30px">Returns & Refunds</Typography>
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
    )

}

export default Footer;
