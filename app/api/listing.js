import client from "./client";

const updateListingStatus = (id) => {
    return client.post("/listing", { productId: id });
};

export default { updateListingStatus };
