import { useContext } from "react";
import CategoryContext from "../category/context";

export default useCategories = () => {
    const { data, error, loading, request } = useContext(CategoryContext);

    return {
        data: data.filter((object) => object.isDeleted === false),
        error,
        loading,
        request,
    };
};
