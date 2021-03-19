import client from "./client";

const endpoint = "categories";

const get = () => client.get(endpoint);

const add = (name) => client.post(endpoint, { name });

const update = (id, name) => client.put(`${endpoint}/${id}`, { name });

const deleteCategory = (id) => client.delete(`${endpoint}/${id}`);

export default { get, add, update, deleteCategory };
