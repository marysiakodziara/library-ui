import {Box, Typography, IconButton, useMediaQuery, Skeleton} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {shades} from "../../theme";

const importAll = (r: __WebpackModuleApi.RequireContext) =>
    r.keys().reduce((acc: any, item: any) => {
        acc[item.replace("./", "")] = r(item);
        return acc;
    }, {});

const heroTextureImports: string = importAll(
    require.context("../../assets", false, /\.(png|jpe?g|svg)$/)
);

const MainCarousel = () => {
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    return (
        <Box mt="60px">
        <Carousel
            infiniteLoop={true}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            renderArrowPrev={(onClickHandler, hasPrev, label) => (
                <IconButton
                    onClick={onClickHandler}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "0",
                        padding: "5px",
                        zIndex: "10"
                    }}
                >
                    <NavigateBeforeIcon sx={{ fontSize: 40 }} />
                </IconButton>
                )}
            renderArrowNext={(onClickHandler, hasNext, label) => (
                <IconButton
                    onClick={onClickHandler}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: "0",
                        padding: "5px",
                        zIndex: "10"
                    }}
                >
                    <NavigateNextIcon sx={{ fontSize: 40 }} />
                </IconButton>
            )}
            >
            {Object.values(heroTextureImports).map((texture, index) => (
                <Box key={`carousel-image-${index}`}>
                    { loading && (
                        <Skeleton
                            sx={{backgroundColor: shades.neutral[100]}}
                            variant="rectangular"
                            width="100%"
                            height="400px" />
                    )}
                    <img
                        src={texture}
                        alt={`carousel-${index}`}
                        width="100%"
                        height="400px"
                        onLoad={() => setLoading(false)}
                        style={{
                            objectFit: "cover",
                            backgroundAttachment: "fixed",
                            display: loading ? "none" : "block",
                        }}
                    />
                    { !loading && (
                        <Box
                            onClick={() => navigate("/book-club")}
                            color="white"
                            padding="20px"
                            borderRadius="1px"
                            textAlign="left"
                            sx={{backgroundColor: 'rgba(0, 0, 0, 0.5)', '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.8)', cursor: 'pointer'}}}
                            position="absolute"
                            top="46%"
                            left={isNonMobile ? "10%" : "0"}
                            right={isNonMobile ? undefined : "0"}
                            margin={isNonMobile ? undefined : "0 auto"}
                            maxWidth={isNonMobile ? undefined : "240px"}
                        >
                            <Typography textAlign="center" variant="h5">-- Library Community --</Typography>
                            <Typography
                                fontWeight="bold"
                                variant="h1">Book Club</Typography>
                            <Typography
                                textAlign="center"
                                fontWeight="bold"
                                variant="h5"
                            >
                                Click to Learn More
                            </Typography>
                        </Box>
                    )}
                </Box>
            ))}
        </Carousel>
        </Box>
    )
}

export default MainCarousel;