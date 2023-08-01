import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectLoggedUser} from "../../state/security/securityReducer";
import {useEffect, useState} from "react";
import {
    fetchBorrowingHistory,
    OrderHistory,
    selectBorrowingHistory,
    selectBorrowingHistoryStatus,
} from "../../state/account/accountReducer";

const BorrowingHistory = () => {
    const [borrowingHistory, setBorrowingHistory] = useState<OrderHistory[]>([]);
    const dispatch = useAppDispatch();
    const token = useAppSelector(selectLoggedUser);
    const status = useAppSelector(selectBorrowingHistoryStatus);
    const history = useAppSelector(selectBorrowingHistory);

    useEffect(() => {
        if (status === 'fulfilled') {
            setBorrowingHistory(history)
        } else if (status === 'idle' && token) {
            dispatch(fetchBorrowingHistory());
        }
    }, [token]);

    return (
        <div>
        BorrowingHistory
        </div>
    );
}

export default BorrowingHistory;