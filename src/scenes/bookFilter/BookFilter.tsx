import {Box, CircularProgress} from "@mui/material";
import {useLocation, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    Book,
    fetchBooksByCategories,
    fetchBooksByPhrase,
    selectAllBooks,
    selectStatus
} from "../../state/book/bookReducer";
import React, {useEffect, useState} from "react";
import {shades} from "../../theme";
import BookView from "../../components/BookView";
import ErrorPage from "../global/ErrorPage";

const BookFilter = () => {
    const { phrase, categories, page } = useParams();
    const dispatch = useAppDispatch();
    const phraseChecked = phrase !== undefined ? phrase : "";
    const categoriesChecked = categories !== undefined ? categories : "";
    const pageChecked: number = page !== undefined ? parseInt(page) : 0;
    const [called, setCalled] = useState<boolean>(false);
    const books = useAppSelector(selectAllBooks);
    const status = useAppSelector(selectStatus);
    const location = useLocation();

    const handlePhrase = ( phrase: string, page: number ) => {
        dispatch(fetchBooksByPhrase({phrase, page}));
        setCalled(true);
    }

    const handleCategories = ( categories: string[], page: number ) => {
        dispatch(fetchBooksByCategories({categories, page}));
        setCalled(true);
    }

    useEffect(() => {
        switch (true)  {
            case phraseChecked !== "":
                handlePhrase(phraseChecked, pageChecked);
                break;
            case categoriesChecked !== "":
                const categoriesArray: string[] = categoriesChecked.split(",");
                categoriesArray.forEach((category, index) => {
                    categoriesArray[index] = category.toUpperCase();
                });
                handleCategories(categoriesArray, pageChecked);
                break;
        }
    }, [location]);

    return (
        <Box width="80%" margin="100px auto">
            { called && (
                <Box
                    margin="0 auto"
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, 250px)"
                    justifyContent="space-around"
                    rowGap="20px"
                    columnGap="1.33%"
                >
                    {books.map((book: Book) => (
                        <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                    ))}
                </Box>
            )}
            { !called && (
                <CircularProgress
                    size={200}
                    sx={{
                        size: 400,
                        color: shades.neutral[500],
                        m: "auto auto",
                    }}/>
            )}
            { books.length === 0 && status === 'fulfilled' && (
                <ErrorPage/>
            )}

        </Box>
    )
}

export default BookFilter