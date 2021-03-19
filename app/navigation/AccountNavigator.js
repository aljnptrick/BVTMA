import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import BasketScreen from "../screens/BasketScreen";
import routes from "./routes";
import CategoriesScreen from "../screens/CategoriesScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import OrderScreen from "../screens/OrderScreen";
import SalesScreen from "../screens/SalesScreen";
import AdministratorsScreen from "../screens/AdministratorsScreen";

const Stack = createStackNavigator();

export default AccountNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name={routes.ACCOUNT_SCREEN}
            component={AccountScreen}
            options={{ title: "Account" }}
        />
        <Stack.Screen
            name={routes.MESSAGES_SCREEN}
            component={MessagesScreen}
            options={{ title: "Messages" }}
        />
        <Stack.Screen
            name={routes.BASKET_SCREEN}
            component={BasketScreen}
            options={{ title: "Basket" }}
        />
        <Stack.Screen
            name={routes.CATEGORIES_SCREEN}
            component={CategoriesScreen}
            options={{ title: "Categories" }}
        />
        <Stack.Screen
            name={routes.ACCOUNT_EDIT_SCREEN}
            component={AccountEditScreen}
            options={{ title: "Entries" }}
        />
        <Stack.Screen
            name={routes.ORDER_SCREEN}
            component={OrderScreen}
            options={{ title: "Orders" }}
        />
        <Stack.Screen
            name={routes.SALES_SCREEN}
            component={SalesScreen}
            options={{ title: "Sales" }}
        />
        <Stack.Screen
            name={routes.ADMINISTRATORS_SCREEN}
            component={AdministratorsScreen}
            options={{ title: "Administrators" }}
        />
    </Stack.Navigator>
);
