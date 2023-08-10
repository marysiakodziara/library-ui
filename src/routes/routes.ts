export enum ROUTES {
    HOME = "/",
    BOOK = "book/:bookId",
    CHECKOUT = "checkout",
    ACCOUNT = "account",
    SEARCH = "search/:phrase/:page",
    CATEGORIES = ":categories/:page",
    BOOK_CLUB = "book-club",
    ADMIN = "admin",
}

/*
<Route path="/" element={<Home />} />
            <Route path="book/:bookId" element={<BookDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<Account />} />
            <Route path="search/:phrase/:page" element={<BookFilter />} />
            <Route path=":categories/:page" element={<BookFilter />} />
            <Route path="book-club" element={<BookClub />} />
            <Route element={<PrivateRoutes/>}>
              <Route path="/admin" element={<ManagerDashboard />} />
            </Route>*/
