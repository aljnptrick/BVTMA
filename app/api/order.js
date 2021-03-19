import client from "./client";

const endPoint = "orders";

const addOrder = async (orderDetails, location) => {
    const order = {
        details: orderDetails.map(
            ({ title, quantity, total, price, basketId }) => ({
                title,
                quantity,
                total,
                price,
                basketId,
            })
        ),
        grandTotal: orderDetails.reduce((acc, curr) => {
            return acc + curr.total;
        }, 0),
        location: location,
    };

    return client.post(endPoint, order);
};

const getAllOrders = async () => client.get(endPoint);

const acceptOrder = async (id, isAccepted) =>
    client.post(endPoint + "/accept/" + id, isAccepted);

const confirmOrder = async (id) => client.post(endPoint + "/confirm/" + id);

export default {
    addOrder,
    getAllOrders,
    acceptOrder,
    confirmOrder,
};
