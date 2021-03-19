import { useContext } from "react";
import OrderContext from "./context";

export default useOrders = () => {
    const { data, error, loading, request } = useContext(OrderContext);

    return {
        data,
        error,
        loading,
        request,
    };
};
