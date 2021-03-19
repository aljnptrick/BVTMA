import { useContext } from "react";
import AuthContext from "./context";
import { removeToken, storeToken } from "./storage";
import jwtDecode from "jwt-decode";

export default useAuth = () => {
    const { admins, request, loading, user, setUser } = useContext(AuthContext);

    const logIn = (authToken) => {
        const user = jwtDecode(authToken);
        setUser(user);
        storeToken(authToken);
    };

    const logOut = () => {
        setUser(null);
        removeToken();
    };

    return {
        admins,
        request,
        loading,
        user,
        setUser,
        logOut,
        logIn,
    };
};
