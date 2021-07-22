import Login from './Login';
import Logout from './Logout';
import { useAuth0 } from "@auth0/auth0-react";

const Authentication = () => {
    const { isAuthenticated } = useAuth0();

    return isAuthenticated ? <Logout /> : <Login />;
}

export default Authentication;
