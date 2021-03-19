import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ListingEditScreen from "../screens/ListingEditScreen";
import FeedNavigator from "./FeedNavigator";
import AccountNavigator from "./AccountNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EditListingButton from "./EditListingButton";
import routes from "./routes";
import useNotifications from "../hooks/useNotifications";
import useAuth from "../auth/useAuth";
import navigation from "../navigation/rootNavigation";

const Tab = createBottomTabNavigator();

export default TabNavigator = () => {
    useNotifications(() =>
        navigation.navigate(routes.ACCOUNT_NAVIGATOR, {
            screen: routes.ORDER_SCREEN,
            initial: false,
        })
    );

    const { user } = useAuth();

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={FeedNavigator}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons
                            name="home"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            {user.role === "Admin" ? (
                <Tab.Screen
                    name={routes.LISTING_EDIT_SCREEN}
                    component={ListingEditScreen}
                    options={({ navigation }) => ({
                        tabBarButton: () => (
                            <EditListingButton
                                onPress={() =>
                                    navigation.navigate(
                                        routes.LISTING_EDIT_SCREEN
                                    )
                                }
                            />
                        ),
                    })}
                />
            ) : null}
            <Tab.Screen
                name={routes.ACCOUNT_NAVIGATOR}
                component={AccountNavigator}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons
                            name="account"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
