import {useDispatch, useSelector} from 'react-redux';
import {
    Badge,
    Box,
    Button,
    ClickAwayListener,
    Grow,
    IconButton,
    MenuItem,
    MenuList,
    Paper,
    Popper, Typography
} from '@mui/material';
import {MenuOutlined, PersonOutline, SearchOutlined, ShoppingBagOutlined,} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {shades} from '../../theme';
import {setIsCartOpen} from "../../state/cart/cartReducer";
import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useRef, useState} from "react";
import logo from "../../assets/logoEyes.png";


const Navbar = () => {
    const { loginWithRedirect, logout } = useAuth0();
    const [open, setOpen] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state: any) => state.cart.cart);

    useEffect(() => {
        console.log(isAuthenticated + " + " + isLoading);
        console.log(user?.name);
    }, [isLoading, isAuthenticated]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    const navigateAndClose = () => {
        setOpen(false);
        navigate("/account");
    }

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="60px"
            sx={{ backgroundColor: shades.neutral[900] }}
            //sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            color="black"
            position="fixed"
            top="0"
            left="0"
            zIndex="1"
            >
            <Box
                width="80%"
                margin="auto"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box
                    onClick={() => navigate("/")}
                    sx={{ '&:hover': { cursor: 'pointer' } }}
                    color={shades.neutral[500]}
                    alignItems="center"
                    display="flex"
                >
                    <img
                        height="45px"
                        src={logo}
                        alt="Logo" />
                    <Typography sx={{ml: "10px"}} variant="h2" fontWeight="bold">LIBRARY</Typography>
                </Box>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    columnGap="20px"
                    zIndex="2"
                >
                    <IconButton sx={{color: "white"}}>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton
                        ref={anchorRef}
                        sx={{color: "white"}}
                        onClick={handleToggle}
                    >
                        <PersonOutline />
                    </IconButton>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        placement="bottom-start"
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            autoFocusItem={open}
                                            id="composition-menu"
                                            aria-labelledby="composition-button"
                                            onKeyDown={handleListKeyDown}
                                            sx={{ display: "flex", flexDirection: "column" }}
                                        >
                                            <MenuItem onClick={navigateAndClose} sx={{ fontWeight: 'bold' }}>My account</MenuItem>
                                            { isAuthenticated && (
                                                <Button
                                                    sx={{
                                                        mr: "auto",
                                                        ml: "auto",
                                                        width: "80%",
                                                        fontFamily: "inherit",
                                                        backgroundColor: shades.primary[100],
                                                    }}
                                                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                                >
                                                    Log Out
                                                </Button>
                                            )}
                                            { !isAuthenticated && (
                                                <Button
                                                    sx={{
                                                        mr: "auto",
                                                        ml: "auto",
                                                        width: "80%",
                                                        fontFamily: "inherit",
                                                        backgroundColor: shades.primary[100],
                                                    }}
                                                    onClick={() => loginWithRedirect()}
                                                >
                                                    Log In
                                                </Button>
                                            )}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    <Badge
                        badgeContent={cart.length}
                        color="secondary"
                        invisible={cart.length === 0}
                        sx={{
                            "& .MuiBadge-badge": {
                                right: 5,
                                top: 5,
                                padding: "0 4px",
                                height: "14px",
                                minWidth: "13px",
                            }
                        }}>
                        <IconButton
                            onClick={() => dispatch(setIsCartOpen())}
                            sx={{color: "white"}}>
                            <ShoppingBagOutlined />
                        </IconButton>
                    </Badge>
                    <IconButton sx={{color: "white"}}>
                        <MenuOutlined />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default Navbar;