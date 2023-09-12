import {Box, CircularProgress, Divider, Pagination, Paper, Skeleton, Typography} from "@mui/material";
import { useRef } from 'react';
import clsx from 'clsx';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    Book,
    fetchBooksByCategories,
    fetchBooksByPhrase,
    selectAllBooks,
    selectAllBooksTotalPages, selectStatus
} from "../../state/book/bookReducer";
import React, {useEffect, useState} from "react";
import {shades} from "../../theme";
import BookView from "../global/BookView";
import {ROUTES} from "../../routes/routes";

const BookFilter = () => {
    const { phrase, categories, page } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const phraseChecked = phrase !== undefined ? phrase : "";
    const categoriesChecked = categories !== undefined ? categories : "";
    const pageChecked: number = page !== undefined ? parseInt(page) : 0;
    const totalPages = useAppSelector(selectAllBooksTotalPages);
    const books = useAppSelector(selectAllBooks);
    const location = useLocation();
    const [title, setTitle] = useState<string>("");
    const [defaultPage, setDefaultPage] = useState<number>( pageChecked + 1 );
    const status = useAppSelector(selectStatus);

    const handlePhrase = ( phrase: string, page: number ) => {
        dispatch(fetchBooksByPhrase({phrase, page}));
    }

    const handleCategories = ( categories: string[], page: number ) => {
        dispatch(fetchBooksByCategories({categories, page}));
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        if (value !== defaultPage) {
            const page: string = (value - 1).toString();
            const path = phraseChecked !== "" ? ROUTES.SEARCH.replace(':phrase', phraseChecked).replace(':page', page)
                : ROUTES.CATEGORIES.replace(':categories', categoriesChecked).replace(':page', page);
            navigate(path);
        }
    }

    useEffect(() => {
        setDefaultPage(pageChecked + 1)
        setTitle(phraseChecked !== "" ? `Searched By Phrase: " ${phraseChecked} "`
            : `Searched By Categories: ${categoriesChecked.split(",").join(", ")}`)
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
        <Box width="80%" margin="90px auto">
            <Box width="100%" display="flex" justifyContent="space-between">
                <Typography variant="h6">{title}</Typography>
                <Pagination page={defaultPage} count={totalPages}  onChange={handlePageChange}/>
            </Box>
            <Divider sx={{mb: "40px", mt: "5px"}}/>


                <Paper elevation={5} sx={{backgroundColor: shades.neutral[100]}}>
                    { status === 'fulfilled' && (
                        <>
                            { books.length === 0 && (
                                <Box width="100%" height="200px" display="flex" justifyContent="center" alignItems="center">
                                    <Typography variant="h6" sx={{mb: "40px"}}>No books found</Typography>
                                </Box>
                            )}
                            { books.length > 0 && (
                                <Box
                                    p="20px 0"
                                    display="grid"
                                    gridTemplateColumns="repeat(auto-fill, 250px)"
                                    justifyContent="space-around"
                                    rowGap="30px"
                                    columnGap="1.5%"
                                >
                                    {books.map((book: Book) => (
                                        <BookView book={book} key={`${book.title}-${book.id}`} width={"250px"} />
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                    { status !== 'fulfilled' && (
                        <Box
                            p="20px 0"
                            display="grid"
                            gridTemplateColumns="repeat(auto-fill, 250px)"
                            justifyContent="space-around"
                            rowGap="30px"
                            columnGap="1.5%"
                        >
                            {Array(4).fill(0).map((_, index) => (
                                <Skeleton key={index} variant="rectangular" height="350px"/>
                            ))}
                        </Box>
                    )}
                </Paper>

            <Box
                mt="40px"
                width="100%" display="flex" justifyContent="center">
                <Pagination size="large" page={defaultPage} count={totalPages} onChange={handlePageChange}/>
            </Box>
        </Box>
    )
}

export default BookFilter