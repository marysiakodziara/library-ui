import { Outlet, Navigate } from 'react-router-dom';
import {useAppSelector} from "../../app/hooks";
import {selectRole} from "../../state/security/securityReducer";

const PrivateRoutes = () => {
    const role = useAppSelector(selectRole);
    const isManager = role === "manager";

    return (
        isManager ? <Outlet /> : <Navigate to="/" />
    )
}

export default PrivateRoutes;