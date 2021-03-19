import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "./app/navigation/navigationTheme";
import AppOfflineNotice from "./app/components/AppOfflineNotice";
import AuthNavigator from "./app/navigation/AuthNavigator";
import AuthContext from "./app/auth/context";
import ListingContext from "./app/listing/context";
import AppNavigator from "./app/navigation/AppNavigator";
import { getUser } from "./app/auth/storage";
import AppLoading from "expo-app-loading";
import { navigationRef } from "./app/navigation/rootNavigation";
import useApi from "./app/hooks/useApi";
import listings from "./app/api/listings";
import categories from "./app/api/categories";
import CategoryContext from "./app/category/context";
import BasketContext from "./app/basket/context";
import LocationContext from "./app/location/context";
import OrderContext from "./app/order/context";
import useLocation from "./app/hooks/useLocation";
import order from "./app/api/order";
import admins from "./app/api/user";

function App(props) {
    const listingsApi = useApi(listings.getListings);
    const categoryApi = useApi(categories.get);
    const ordersApi = useApi(order.getAllOrders);
    const usersApi = useApi(admins.getAll);
    const [basket, setBasket] = useState([]);
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const { location, loading: locationLoading } = useLocation();

    const restoreUser = async () => {
        const user = await getUser();
        if (user) setUser(user);
    };

    useEffect(() => {
        listingsApi.request();
        categoryApi.request();
        ordersApi.request();
        usersApi.request();
    }, []);

    if (!isReady)
        return (
            <AppLoading
                startAsync={restoreUser}
                onFinish={() => setIsReady(true)}
                onError={console.warn}
            />
        );

    return (
        <AuthContext.Provider
            value={{
                admins: usersApi.data,
                request: usersApi.request,
                loading: usersApi.loading,
                user,
                setUser,
            }}
        >
            <ListingContext.Provider
                value={{
                    data: listingsApi.data,
                    error: listingsApi.error,
                    loading: listingsApi.loading,
                    request: listingsApi.request,
                }}
            >
                <CategoryContext.Provider
                    value={{
                        data: categoryApi.data,
                        error: categoryApi.error,
                        loading: categoryApi.loading,
                        request: categoryApi.request,
                    }}
                >
                    <OrderContext.Provider
                        value={{
                            data: ordersApi.data,
                            error: ordersApi.error,
                            loading: ordersApi.loading,
                            request: ordersApi.request,
                        }}
                    >
                        <BasketContext.Provider value={{ basket, setBasket }}>
                            <LocationContext.Provider
                                value={{ location, locationLoading }}
                            >
                                <AppOfflineNotice />
                                <NavigationContainer
                                    ref={navigationRef}
                                    theme={navigationTheme}
                                >
                                    {user ? (
                                        <AppNavigator />
                                    ) : (
                                        <AuthNavigator />
                                    )}
                                </NavigationContainer>
                            </LocationContext.Provider>
                        </BasketContext.Provider>
                    </OrderContext.Provider>
                </CategoryContext.Provider>
            </ListingContext.Provider>
        </AuthContext.Provider>
    );
}

export default App;
