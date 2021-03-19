import client from "./client";

const get = (id) => client.get("user/" + id);

const getAll = () => client.get("users");

const updateEntries = ({ name, email, password, id }, onUploadProgress) => {
    const data = { name, email, password };

    return client.put(`users/${id}`, data, {
        onUploadProgress: ({ loaded, total }) =>
            onUploadProgress(loaded / total),
    });
};

export default { get, getAll, updateEntries };
