import {
    Autocomplete,
    Box,
    Button,
    Chip,
    FormHelperText,
    IconButton,
    InputAdornment, InputBase,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import CustomizedSteppers from "../global/CustomizedSteppers";
import {useEffect, useRef, useState} from "react";
import {useAppSelector} from "../../app/hooks";
import {Book, Category, selectAllCategories} from "../../state/book/bookReducer";
import {shades} from "../../theme";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {styled} from "@mui/material/styles";
import {Item} from "./ManagerDashboard";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios, {AxiosResponse} from "axios";
import {selectLoggedUser} from "../../state/security/securityReducer";

const Label = styled('label')`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

const emptyBook: Book = {
    id: 0,
    isbn: 0,
    title: "",
    author: "",
    numberOfBooks: 1,
    categories: [],
    count: 0,
    numberOfAvailableBooks: 0,
}

const AddBook = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [book, setBook] = useState<Book>(emptyBook);
    const [checked, setChecked] = useState<boolean>(false);
    const [isbnSearch, setIsbnSearch] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [sendRequest, setSendRequest] = useState<boolean>(false);
    const isZeroStep = activeStep === 0;
    const isFirstStep = activeStep === 1;
    const isSecondStep = activeStep === 2;
    const steps = ["Book Details", "Summary", "Done"]
    const category: Category = useAppSelector(selectAllCategories);
    const categories = (Object.values(category)).reduce((acc, val) => acc.concat(val), []);
    const boxRef = useRef<HTMLAnchorElement>(null);
    const [noBookFound, setNoBookFound] = useState<boolean>(false);
    const [size, setSize] = useState<number>(boxRef.current ? boxRef.current.offsetHeight : 0);
    const [restart, setRestart] = useState<boolean>(false);
    const isDataFilled = (book.title !== "" && book.author !== "" && book.numberOfBooks !== 0 && book.categories.length !== 0
        && book.isbn.toString().length === 13);
    const [isbnError, setIsbnError] = useState<boolean>(false);
    const [titleError, setTitleError] = useState<boolean>(false);
    const [authorError, setAuthorError] = useState<boolean>(false);
    const [countError, setCountError] = useState<boolean>(false);
    const [categoryError, setCategoryError] = useState<boolean>(false);
    const [bookError, setBookError] = useState<boolean>(false);
    const [bookErrorMessage, setBookErrorMessage] = useState<string>("");
    const token = useAppSelector(selectLoggedUser);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    useEffect(() => {
        setSize(boxRef.current ? boxRef.current.offsetHeight : 0);
    }, [book.categories]);


    const handleCheckedBox = () => {
        setIsbnError(false);
        setTitleError(false);
        setAuthorError(false);
        setCountError(false);
        setCategoryError(false);
        setBook(emptyBook);
        setLoading(true);
        setSendRequest(false);
        setChecked(!checked);
        setRestart(!restart);
    }

    const handleFetchBook = () => {
        if (isNaN(Number(isbnSearch)) || isbnSearch.toString().length !== 13) {
            setIsbnError(true)
        } else {
            setSendRequest(true);
            fetchBookByIsbn();
        }
    }

    const addCategories = (category: string[]) => {
        setBook({...book, categories: category.length > 0 ? category : []})
    }

    const importLogo = (r: __WebpackModuleApi.RequireContext) => {
        const imagePath = r.keys()[0];
        return r(imagePath);
    };

    const logoImport = importLogo(
        require.context("../../assets/logo", false, /\.(png|jpe?g|svg)$/)
    );

    async function fetchBookByIsbn() {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/book/isbn?isbn=${isbnSearch}`);
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setBook(data);
                    setLoading(false);
                } else {
                    setNoBookFound(true)
                    setBook(emptyBook);
                    setLoading(false);
                }
            } else {
                setNoBookFound(true)
                setBook(emptyBook);
                setLoading(false);
            }
        } catch (error) {
            setNoBookFound(true)
            setBook(emptyBook);
            setLoading(false);
        }
    }

    const handleNext = () => {
        if (isDataFilled) {
            setActiveStep(1)
        } else {
            if (book.title === "") {
                setTitleError(true)
            }
            if (book.author === "") {
                setAuthorError(true)
            }
            if (book.isbn.toString().length !== 13) {
                setIsbnError(true)
            }
            if (book.numberOfBooks === 0) {
                setCountError(true)
            }
            if (book.categories.length === 0) {
                setCategoryError(true)
            }
        }
    }

    const restartComponent = () => {
        setBook(emptyBook);
        setIsbnSearch(0);
        setChecked(false);
        setLoading(true);
        setSendRequest(false);
        setRestart(!restart);
        setChecked(false);
        setActiveStep(0);
        setBookError(false);
        setBookErrorMessage("");
    }

    const sendBook = async () => {
            const endpoint = checked ? "/book/updateBook" : "/book";
        axios({
            method: checked ? "put" : "post",
            url: `${process.env.REACT_APP_API_URL}${endpoint}`,
            data: book,
            headers: headers
        }).then((response) => {
            if (response.status === 200) {
                setActiveStep(2)
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                setBookError(true);
                setBookErrorMessage("Book with this isbn already exists. Choose \"Update Book\" option to change its properties.");
            } else {
                setBookError(true);
                setBookErrorMessage("Something went wrong, try again later!");
            }
        })
    }

    return (
        <Box width="100%" justifyContent="center" >
            <Box width="100%" m="30px auto" >
                <CustomizedSteppers activeStep={activeStep} steps={steps}/>
            </Box>
            <Item
                elevation={3}
                sx={{
                    backgroundColor: shades.neutral[100],
                    width: "80%",
                    m: "60px auto",
                    display: "flex",
                    maxHeight: "500px",
                }}
            >
            { !isSecondStep && (
                <>
                    <Box
                        width="60%" p="15px 0" sx={{backgroundColor: isZeroStep ? shades.neutral[100] : shades.neutral[300],
                        overflowY: size >= 61 ? "scroll" : "visible"}}>
                        <Box width="100%" display="flex" height="50px" m="0 auto"   >
                            <Box display="flex" alignItems="center" justifyContent="space-around" m="0 auto">
                                <Typography variant="h6">Add New Book</Typography>
                                <Switch
                                    disabled={!isZeroStep}
                                    onChange={handleCheckedBox}
                                />
                                <Typography variant="h6">Update Book</Typography>
                            </Box>
                        </Box>
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(auto-fill, 400px)"
                            gridTemplateRows="(repeat(auto-fill), 60px)"
                            justifyContent="space-around"
                            rowGap="20px"
                            columnGap="1.33%"
                            width="100%"
                            height="80%"
                            pt="6%"
                            pl="20px"
                            pr="20px"
                            m="0 auto">
                            { checked && (
                                <>
                                    <TextField
                                        error={titleError}
                                        helperText={titleError ? "Title is required" : ""}
                                        onChange={(e) => {
                                            setBook({...book, title: e.target.value})
                                            setTitleError(false)
                                        }}
                                        disabled={checked || !isZeroStep} label={book.title !== "" ? book.title : "Title"} variant="outlined" />
                                    <TextField
                                        error={authorError}
                                        helperText={authorError ? "Author is required" : ""}
                                        onChange={(e) => {
                                            setBook({...book, author: e.target.value})
                                            setAuthorError(false)
                                        }}
                                        disabled={checked || !isZeroStep} sx={{width: "400px"}} label={book.author !== "" ? book.author :"Author"} variant="outlined" />
                                </>
                            )}
                            { !checked && (
                                <>
                                    <TextField
                                        error={titleError}
                                        helperText={titleError ? "Title is required" : ""}
                                        onChange={(e) => {
                                            setBook({...book, title: e.target.value})
                                            setTitleError(false)
                                        }}
                                        disabled={checked || !isZeroStep} label={"Title"} variant="outlined" />
                                    <TextField
                                        error={authorError}
                                        helperText={authorError ? "Author is required" : ""}
                                        onChange={(e) => {
                                            setBook({...book, author: e.target.value})
                                            setAuthorError(false)
                                        }}
                                        disabled={checked || !isZeroStep} sx={{width: "400px"}} label={"Author"} variant="outlined" />
                                </>
                            )}
                            <Box display="flex" justifyContent="space-between" width="400px" alignItems="center" >
                                { checked && (
                                    <TextField
                                        error={isbnError || noBookFound}
                                        helperText={noBookFound ? "There is no book with this isbn" : (isbnError ? "Isbn has to have 13 numbers" : "")}
                                        disabled={!isZeroStep}
                                        sx={{width: "250px", "& .MuiOutlinedInput-root":{"& > fieldset": {border: '1.7px solid black'}}, display: "flex"}}
                                        label={"Choose Book by Isbn"}
                                        variant="outlined"
                                        onChange={(e) => {
                                            setIsbnSearch(parseInt(e.target.value))
                                            setIsbnError(false)
                                            setNoBookFound(false)
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end"
                                                >
                                                    <SearchIcon
                                                        onClick={handleFetchBook}
                                                        sx={{color: "black", '&:hover': { cursor: 'pointer' }}}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                                { !checked && (
                                    <TextField
                                        error={isbnError}
                                        helperText={isbnError ? "Isbn has to have 13 numbers" : ""}
                                        onChange={(e) => {
                                            setBook({...book, isbn: parseInt(e.target.value)})
                                            setIsbnError(false)
                                        }}
                                        sx={{width: "250px"}} label="Isbn" variant="outlined" disabled={!isZeroStep}/>
                                )}
                                <Box>
                                    <Box
                                        width="100px"
                                        display="flex"
                                        height="51px"
                                        justifyContent="space-around"
                                        alignItems="center"
                                        sx={{backgroundColor: isZeroStep ? shades.neutral[100] : shades.neutral[300]}}
                                        borderRadius="4px"
                                        border={`1.5px solid ${countError ? shades.secondary[500] : shades.neutral[500]}`}
                                    >
                                        <IconButton
                                            disabled={(checked && !sendRequest) || !isZeroStep || book.numberOfBooks === 0 || book.numberOfAvailableBooks >= book.numberOfBooks}
                                            onClick={() => {setBook({...book, numberOfBooks: book.numberOfBooks - 1})}}
                                        >
                                            <RemoveIcon/>
                                        </IconButton>
                                        <Typography color={shades.primary[300]}>{book.numberOfBooks}</Typography>
                                        <IconButton
                                            disabled={(checked && !sendRequest) || !isZeroStep}
                                            onClick={() => {
                                                setBook({...book, numberOfBooks: book.numberOfBooks + 1})
                                                setCountError(false)
                                            }}
                                        >
                                            <AddIcon/>
                                        </IconButton>
                                    </Box>
                                    { countError && (
                                        <FormHelperText sx={{color: shades.secondary[500]}}>{"Choose different number"}</FormHelperText>
                                    )}

                                </Box >
                            </Box>
                            <Box width="400px" justifyContent="start" >
                                { sendRequest && !loading && (
                                    <Typography sx={{pl: "15px", height: "60px"}} width="100%" textAlign="start" ref={boxRef} variant="h5">Categories: {book.categories.map((categoryName: string) =>
                                        <Chip label={categoryName} key={categoryName}/>
                                    )}
                                    </Typography>
                                )}
                                { !sendRequest && loading && (
                                    <Autocomplete
                                        disabled={(checked && !sendRequest) || !isZeroStep}
                                        ref={boxRef}
                                        limitTags={2}
                                        sx={{width: "400px", textOverflow: 'clip'}}
                                        multiple
                                        options={categories}
                                        key={restart.toString()}
                                        getOptionLabel={(option) => option}
                                        onChange={(event, value) => {
                                            addCategories(value)
                                            setCategoryError(false)
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                multiline={false}
                                                error={categoryError}
                                                helperText={categoryError ? "Categories can't be blank" : ""}
                                                {...params} label="Category" />}
                                    />
                                )}
                                { (sendRequest && loading) && (<Box height="60px" />)}
                                <Button
                                    disabled={!isZeroStep}
                                    onClick={handleNext}
                                    sx={{height: "40px", width: "150px", m: "0 auto", backgroundColor: shades.neutral[400]}}>
                                    Next</Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box position="relative" pt="25px" pl="20px" pr="20px" width="40%" sx={{backgroundColor: isFirstStep ? shades.neutral[100] : shades.neutral[300],}}>
                        { isZeroStep && (
                            <Box width="100%" height="100%" display="flex">
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
                        )}
                        { isFirstStep && (
                            <>
                                <Typography variant="h6" sx={{mb: "40px"}}>Check Your Changes</Typography>
                                <Box
                                    maxHeight="250px"
                                    overflow="auto"
                                    width="100%"
                                    display="grid"
                                    gridTemplateColumns="repeat(auto-fill, 300px)"
                                    justifyContent="space-around"
                                    rowGap="25px"
                                    columnGap="1.33%"
                                    textAlign="left">
                                    { !bookError && (
                                        <>
                                            <Typography variant="h5">Title: {book.title}</Typography>
                                            <Typography variant="h5">Author: {book.author}</Typography>
                                            <Typography variant="h5">Isbn: {book.isbn}</Typography>
                                            <Typography variant="h5">Count: {book.numberOfBooks}</Typography>
                                            <Typography variant="h5">Categories: {book.categories.map((categoryName: string) =>
                                                <Chip label={categoryName} key={categoryName}/>
                                            )}
                                            </Typography>
                                        </>
                                    )}
                                    { bookError && (
                                        <FormHelperText sx={{color: shades.secondary[500], fontSize: "15px"}}>{bookErrorMessage}</FormHelperText>
                                    )}
                                </Box>
                                <Box
                                    width="100%"
                                    position="absolute"
                                    left="0"
                                    bottom="6%"
                                    display="flex"
                                    justifyContent="space-around"
                                >
                                    <Box display="flex" width="80%" >
                                        <Button
                                            disabled={!isFirstStep}
                                            onClick={() => {
                                                setActiveStep(0)
                                                setBookError(false)
                                                setBookErrorMessage("")
                                            }}
                                            sx={{height: "40px", width: "100px", m: "0 auto", backgroundColor: shades.neutral[400]}}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            disabled={!isFirstStep || bookError}
                                            onClick={() => sendBook()}
                                            sx={{height: "40px", width: "100px", m: "0 auto", backgroundColor: shades.neutral[400]}}
                                        >
                                            Send
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Box>
                </>
                )}
                { isSecondStep && (
                    <Box
                        position="relative"
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="center"
                        alignItems="center"
                        p="3% 20px"
                        width="100%" height="450px" sx={{backgroundColor: shades.neutral[200]}}>
                        <Box
                            sx={{cursor: "pointer"}}
                            onClick={() => restartComponent()}
                            width="18%"
                            position="absolute"
                            top="20px"
                            left="20px"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-around">
                            <ArrowBackIcon />
                            <Typography variant="h3">Start Again</Typography>
                        </Box>
                        <Typography
                            sx={{mb: "20px"}}
                            textAlign="center" variant="h2" fontWeight="bold">
                            {checked ? "Successfully Edited Book" : "Book Has Been Added"}
                        </Typography>
                    </Box>
                )}
            </Item>
        </Box>
    )
}

export default AddBook;