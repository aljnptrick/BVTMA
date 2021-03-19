import client from "./client";

const login = (email, password) => client.post("/auth", { email, password });

const register = (userInfo) => client.post("/users", userInfo);

const recoverPassword = ({ email }) => client.post("/auth/recover", { email });

export default {
    login,
    register,
    recoverPassword,
};
