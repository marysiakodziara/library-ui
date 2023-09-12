import {Box, Divider, Skeleton, Tab, Tabs, Typography} from "@mui/material";
import {shades} from "../../../theme";

const BookDetailsSkeleton = () => (
    <Box width="100%" m="100px auto">
        <Box sx={{ backgroundColor: shades.neutral[100] }} p="20px 5%">
            <Box width="90%" display="flex" flexWrap="wrap" columnGap="70px" m="auto auto">
                <Box flex="1 1 25%" m="auto auto">
                    <Skeleton variant="rectangular" width="90%" height="350px" />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box flex="1 1 50%">
                    <Box alignItems="flex-start" justifyContent="flex-start">
                        <Box m="65px 0 25px 0">
                            <Skeleton variant="text" width="50%" height={40} />
                            <Skeleton variant="text" width="70%" height={20} />
                            <Box m="20px 0">
                                <Tabs value="description" onChange={() => {}}>
                                    <Tab label="DESCRIPTION" value="description" />
                                    <Tab label="DETAILS" value="details" />
                                    <Tab label="RELATED BOOKS" value="related_products" />
                                </Tabs>
                            </Box>
                            <Box minHeight="200px">
                                <Skeleton variant="text" height={150} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>
);


export default BookDetailsSkeleton;