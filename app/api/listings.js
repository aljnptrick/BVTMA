import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get(endpoint);

const postListings = (values, onUploadProgress) => {
    const form = { ...values };
    const data = new FormData();

    for (let key of Object.keys(form)) {
        if (key === "images") {
            form[key].forEach((file, index) => {
                data.append(key, {
                    name: file.split("/").pop(),
                    type: "image/jpeg",
                    uri: file,
                });
            });
        } else if (key === "location") {
            form[key] !== null && data.append(key, JSON.stringify(form[key]));
        } else if (key === "category") {
            data.append("categoryId", form[key].id);
        } else {
            data.append(key, form[key]);
        }
    }

    return client.post(endpoint, data, {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: ({ loaded, total }) =>
            onUploadProgress(loaded / total),
    });
};

const putImageListing = (uri, id) => {
    const data = new FormData();
    data.append("images", {
        name: uri.split("/").pop(),
        type: "image/jpeg",
        uri,
    });

    return client.put(`${endpoint}/images/${id}`, data, {
        headers: { "content-type": "multipart/form-data" },
    });
};

const putListings = (values, onUploadProgress) => {
    const { title, price, description, category, id } = values;
    const data = {
        title,
        price,
        description,
        categoryId: category.id,
    };

    return client.put(`${endpoint}/${id}`, data, {
        onUploadProgress: ({ loaded, total }) =>
            onUploadProgress(loaded / total),
    });
};

const deleteListings = (id) => {
    return client.delete(`${endpoint}/${id}`);
};

export default {
    getListings,
    postListings,
    putListings,
    deleteListings,
    putImageListing,
};
