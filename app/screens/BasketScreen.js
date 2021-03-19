import React from "react";
import AppBasket from "../components/AppBasket";

function BasketScreen({ navigation }) {
    return <AppBasket navigation={navigation} status="new" />;
}

export default BasketScreen;
