import {useSelector} from 'react-redux';
import {
    Badge,
    Box,
    Button,
    ClickAwayListener,
    Grow,
    IconButton,
    InputBase,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Typography
} from '@mui/material';
import {MenuOutlined, PersonOutline, ShoppingBagOutlined,} from '@mui/icons-material';
import {useLocation, useNavigate} from 'react-router-dom';
import {shades} from '../../../theme';
import {setIsCartOpen} from "../../../state/cart/cartReducer";
import {useAuth0} from "@auth0/auth0-react";
import {SyntheticEvent, useEffect, useRef, useState, KeyboardEvent} from "react";
import NavigationMenu from "./NavigationMenu";
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {selectRole, logoutUser} from "../../../state/security/securityReducer";
import {ROUTES} from "../../../routes/routes";


const Navbar = () => {
    const { loginWithRedirect, logout } = useAuth0();
    const [openAccount, setOpenAccount] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [search, setSearch] = useState("");
    const { isAuthenticated } = useAuth0();
    const location = useLocation();
    const anchorRefAccount = useRef<HTMLButtonElement>(null);
    const anchorRefMenu = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const cart = useSelector((state: any) => state.cart.cart);
    const userRole = useAppSelector(selectRole);

    useEffect(() => {
        setOpenMenu(false);
    }, [location]);

    const handleOpenAccount = () => {
        setOpenAccount((prevOpen) => !prevOpen);
    };

    const handleCloseAccount = (event: Event | SyntheticEvent) => {
        if (
            anchorRefAccount.current &&
            anchorRefAccount.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpenAccount(false);
    };

    const handleCloseMenu = (event: Event | SyntheticEvent) => {
        if (
            anchorRefAccount.current &&
            anchorRefAccount.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpenMenu(false);
    };

    const navigateAndClose = () => {
        setOpenAccount(false);
        navigate(ROUTES.ACCOUNT);
    }

    function handleListKeyDown(event: KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenAccount(false);
        } else if (event.key === 'Escape') {
            setOpenAccount(false);
        }
    }

    const handleOpenMenu = () => {
        setOpenMenu((prevOpen) => !prevOpen);
    }

    const handleSearch = () => {
        if (search !== "") {
            const path = ROUTES.SEARCH.replace(":phrase", search).replace(":page", "0");
            navigate(path);
        }
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="60px"
            sx={{ backgroundColor: shades.neutral[900] }}
            color="black"
            position="fixed"
            top="0"
            left="0"
            zIndex="15"
            >
            <Box
                width="90%"
                margin="auto"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Box display="flex">
                    <IconButton
                        ref={anchorRefMenu}
                        onClick={handleOpenMenu}
                        sx={{color: "white"}}>
                        <MenuOutlined />
                    </IconButton>
                    <Box
                        onClick={() => navigate(ROUTES.HOME)}
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                        color={shades.neutral[500]}
                        alignItems="center"
                        display="flex"
                    >
                        <Typography sx={{ml: "10px"}} variant="h3" fontWeight="bold">LIBRARY</Typography>
                    </Box>
                </Box>
                <Popper
                    open={openMenu}
                    anchorEl={anchorRefMenu.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                >
                    <ClickAwayListener onClickAway={handleCloseMenu}>
                        <Box
                            position="fixed"
                            onKeyDown={handleListKeyDown}>
                            <NavigationMenu />

                        </Box>
                    </ClickAwayListener>
                </Popper>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    columnGap="20px"
                    zIndex="2"
                >
                    <Box sx={{backgroundColor: shades.neutral[800]}} padding="2px 10px" borderRadius="20px">
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: "white"}}
                            placeholder="Search for a book"
                            inputProps={{ 'aria-label': 'search google maps' }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IconButton
                            type="button"
                            aria-label="search"
                            onClick={() => handleSearch()}>
                            <SearchIcon sx={{color: "white"}}/>
                        </IconButton>
                    </Box>
                    <IconButton
                        ref={anchorRefAccount}
                        sx={{color: "white"}}
                        onClick={handleOpenAccount}
                    >
                        <PersonOutline />
                    </IconButton>
                    <Popper
                        open={openAccount}
                        anchorEl={anchorRefAccount.current}
                        role={undefined}
                        placement="bottom"
                        sx={{ paddingTop: "12px"}}
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
                                    <ClickAwayListener onClickAway={handleCloseAccount}>
                                        <MenuList
                                            autoFocusItem={openAccount}
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
                                                    onClick={() => {
                                                        logout({ logoutParams: { returnTo: window.location.origin } })
                                                        dispatch(logoutUser());
                                                    }}
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
                                                    onClick={() => loginWithRedirect({ appState: { returnTo: window.location.pathname } })}
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
                    { userRole === "manager" && (
                        <IconButton
                            onClick={() => navigate(ROUTES.ADMIN)}
                            sx={{color: "white"}}>
                            <BusinessCenterIcon />
                        </IconButton>
                    )}
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
                </Box>
            </Box>
        </Box>
    );
}

export default Navbar;