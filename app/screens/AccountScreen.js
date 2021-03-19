import React, { useContext } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import AppBlankScreen from "../components/AppBlankScreen";
import AppListItem from "../components/lists/AppListItem";
import AppIcon from "../components/AppIcon";
import AppListSeparator from "../components/lists/AppListSeparator";

import colors from "../config/colors";
import routes from "../navigation/routes";
import useAuth from "../auth/useAuth";
import { AppListEditAction } from "../components/lists";
import BasketContext from "../basket/context";

const menuItems = [
    {
        title: "Sales",
        icon: {
            name: "chart-bar",
            backgroundColor: colors.success,
        },
        targetScreen: routes.SALES_SCREEN,
        usedBy: "Admin",
    },
    {
        title: "Orders",
        icon: {
            name: "format-list-bulleted",
            backgroundColor: colors.primary,
        },
        targetScreen: routes.ORDER_SCREEN,
        usedBy: "Both",
    },
    {
        title: "Basket",
        icon: {
            name: "basket",
            backgroundColor: colors.secondary,
        },
        targetScreen: routes.BASKET_SCREEN,
        usedBy: "Customer",
    },
    // {
    //     title: "Messages",
    //     icon: {
    //         name: "email",
    //         backgroundColor: colors.secondary,
    //     },
    //     targetScreen: routes.MESSAGES_SCREEN,
    //     usedBy: "Both",
    // },
    {
        title: "Categories",
        icon: {
            name: "view-grid",
            backgroundColor: colors.info,
        },
        targetScreen: routes.CATEGORIES_SCREEN,
        usedBy: "Admin",
    },
    {
        title: "Administrators",
        icon: {
            name: "account",
            backgroundColor: colors.secondary,
        },
        targetScreen: routes.ADMINISTRATORS_SCREEN,
        usedBy: "Admin",
    },
    {
        title: "Log Out",
        icon: {
            name: "logout",
            backgroundColor: colors.warning,
        },
        usedBy: "Both",
    },
];

function AccountScreen({ navigation }) {
    const { user, logOut } = useAuth();
    const { setBasket } = useContext(BasketContext);

    return (
        <AppBlankScreen style={styles.screen}>
            <View style={styles.container}>
                <AppListItem
                    title={user.name}
                    subTitle={user.email}
                    showChevrons={true}
                    renderRightActions={() => (
                        <>
                            <AppListEditAction
                                onPress={() =>
                                    navigation.navigate(
                                        routes.ACCOUNT_EDIT_SCREEN
                                    )
                                }
                            />
                        </>
                    )}
                    // image={require(`../assets/mosh.jpg`)}
                />
            </View>
            <FlatList
                data={menuItems.filter(
                    (object) =>
                        object.usedBy === user.role || object.usedBy === "Both"
                )}
                keyExtractor={(menuItem) => menuItem.title}
                renderItem={({ item }) => (
                    <AppListItem
                        title={item.title}
                        IconComponent={
                            <AppIcon
                                name={item.icon.name}
                                backgroundColor={item.icon.backgroundColor}
                            />
                        }
                        onPress={() => {
                            if (item.title !== "Log Out")
                                return navigation.navigate(item.targetScreen);
                            Alert.alert("Logout", "Are you sure?", [
                                {
                                    text: "Yes",
                                    onPress: () => {
                                        setBasket([]);
                                        logOut();
                                    },
                                },
                                {
                                    text: "No",
                                },
                            ]);
                        }}
                    />
                )}
                ItemSeparatorComponent={AppListSeparator}
            />
        </AppBlankScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    screen: {
        backgroundColor: colors.light,
    },
});

export default AccountScreen;
