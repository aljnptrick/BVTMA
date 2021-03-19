import { useContext } from "react";
import ListingsContext from "../listing/context";

export default useListings = () => {
    const { data, error, loading, request } = useContext(ListingsContext);

    return { data, error, loading, request };
};
