import React, { useState, useContext, useEffect, useRef } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    View,
    LogBox,
    Alert,
    TouchableOpacity,
} from "react-native";
import AppBlankScreen from "../components/AppBlankScreen";
import AppButton from "../components/AppButton";
import colors from "../config/colors";
import routes from "../navigation/routes";
import BasketContext from "../basket/context";
import AppMap from "../components/AppMap";
import AppText from "../components/AppText";
import { AppListSeparator } from "../components/lists";
import Counter from "react-native-counters";
import order from "../api/order";
import useApi from "../hooks/useApi";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useOrders from "../order/useOrders";
import useLocation from "../hooks/useLocation";

const ListHeader = ({ navigation, status }) => (
    <View style={styles.basketDetailsHeader}>
        <AppText style={styles.title}>Basket Details</AppText>
        {status === "new" && (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(routes.HOME_NAVIGATOR, {
                        screen: routes.LISTING_SCREEN,
                    })
                }
            >
                {<AppText style={styles.addItems}>Add Items</AppText>}
            </TouchableOpacity>
        )}
    </View>
);

const ListBody = ({
    title,
    quantity,
    total,
    price,
    setBasket,
    basketId,
    status,
}) => (
    <TouchableOpacity
        onLongPress={() => {
            status === "new" &&
                Alert.alert("Delete Item", "Are you sure?", [
                    {
                        text: "Yes",
                        onPress: () => {
                            setBasket((prevBasket) => {
                                return prevBasket.filter(
                                    (obj) => obj.basketId !== basketId
                                );
                            });
                        },
                    },
                    { text: "No" },
                ]);
        }}
    >
        <View style={styles.basketDetailsBody}>
            <View style={styles.items}>
                <View style={styles.counter}>
                    <AppText>{title}</AppText>
                    <AppText>{`${total}`}</AppText>
                </View>
                {status === "new" && (
                    <Counter
                        max={Infinity}
                        start={quantity}
                        onChange={(value) =>
                            setBasket((prevBasket) => {
                                const data = [...prevBasket];
                                const index = prevBasket.findIndex((obj) => {
                                    return obj.basketId === basketId;
                                });
                                data[index].total = price * value;
                                return data;
                            })
                        }
                    />
                )}
            </View>
        </View>
    </TouchableOpacity>
);

const ListFooter = ({
    subTotal,
    deliveryFee,
    status,
    navigation,
    setBasket,
}) => (
    <View style={styles.basketDetailsFooter}>
        <View style={styles.items}>
            <AppText>Subtotal</AppText>
            <AppText>{subTotal}</AppText>
        </View>
        <View style={styles.items}>
            <AppText>Delivery Fee</AppText>
            <AppText>{deliveryFee}</AppText>
        </View>
        <View style={styles.items}>
            <AppText>Grand Total</AppText>
            <AppText>{subTotal + deliveryFee}</AppText>
        </View>
        <AppListSeparator />
        {status === "new" && (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(routes.HOME_NAVIGATOR, {
                        screen: routes.LISTING_SCREEN,
                    });
                    setBasket([]);
                }}
            >
                <View style={styles.cancel}>
                    <AppText style={styles.cancelOrder}>Cancel Order</AppText>
                </View>
            </TouchableOpacity>
        )}
    </View>
);

function AppBasket({ navigation, status, previousBasket, customerLocation }) {
    const { location } = useLocation();
    const { basket, setBasket } = useContext(BasketContext);
    const addOrderApi = useApi(order.addOrder);
    const scrollView = useRef(null);
    const ordersApi = useOrders();
    const [selectedLocation, setSelectedLocation] = useState(null);

    const data = status === "new" ? basket : previousBasket;

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    }, []);

    return (
        <>
            <AppActivityIndicator visible={addOrderApi.loading} />
            <AppBlankScreen
                style={
                    data.length !== 0
                        ? styles.container
                        : styles.noItemsContainer
                }
            >
                {data.length !== 0 ? (
                    <>
                        <ScrollView
                            ref={scrollView}
                            onContentSizeChange={() =>
                                scrollView.current.scrollToEnd()
                            }
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.map}>
                                <AppMap
                                    customerLocation={customerLocation}
                                    setSelectedLocation={(location) =>
                                        setSelectedLocation(location)
                                    }
                                    status={status}
                                />
                            </View>

                            <View style={styles.basketDetailsContainer}>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item) =>
                                        item.basketId.toString()
                                    }
                                    renderItem={({
                                        item: {
                                            title,
                                            quantity,
                                            total,
                                            price,
                                            basketId,
                                        },
                                    }) => (
                                        <ListBody
                                            setBasket={setBasket}
                                            title={title}
                                            quantity={quantity}
                                            total={total}
                                            price={price}
                                            basketId={basketId}
                                            status={status}
                                        />
                                    )}
                                    ListHeaderComponent={() => (
                                        <ListHeader
                                            navigation={navigation}
                                            status={status}
                                        />
                                    )}
                                    ListFooterComponent={() => (
                                        <ListFooter
                                            subTotal={data.reduce(
                                                (acc, curr) => {
                                                    return acc + curr.total;
                                                },
                                                0
                                            )}
                                            deliveryFee={0}
                                            status={status}
                                            navigation={navigation}
                                            setBasket={setBasket}
                                        />
                                    )}
                                    ItemSeparatorComponent={AppListSeparator}
                                />
                            </View>
                            <View style={styles.placeOrderButton}>
                                {status === "new" && (
                                    <AppButton
                                        title="place order"
                                        color={colors.primary}
                                        onPress={async () => {
                                            const result = await addOrderApi.request(
                                                data,
                                                selectedLocation === null
                                                    ? location
                                                    : selectedLocation
                                            );
                                            if (!result.ok)
                                                return Alert.alert(
                                                    "Something went wrong on adding order."
                                                );
                                            ordersApi.request();
                                            setBasket([]);
                                            navigation.navigate(
                                                routes.ACCOUNT_NAVIGATOR,
                                                {
                                                    screen: routes.ORDER_SCREEN,
                                                    initial: false,
                                                }
                                            );
                                        }}
                                    />
                                )}
                            </View>
                        </ScrollView>
                    </>
                ) : (
                    <AppButton
                        color={colors.primary}
                        title="order now"
                        onPress={() =>
                            navigation.navigate(routes.HOME_NAVIGATOR, {
                                screen: routes.LISTING_SCREEN,
                            })
                        }
                    />
                )}
            </AppBlankScreen>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.light,
    },
    noItemsContainer: {
        padding: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    basketDetailsContainer: {
        padding: 10,
        backgroundColor: colors.light,
    },
    placeOrderButton: {
        padding: 10,
    },
    basketDetailsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 5,
        marginBottom: 10,
        backgroundColor: colors.white,
    },
    title: {
        fontWeight: "bold",
    },
    addItems: {
        fontWeight: "bold",
        color: colors.secondary,
    },
    basketDetailsBody: {
        backgroundColor: colors.white,
        padding: 5,
    },
    items: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    basketDetailsFooter: {
        backgroundColor: colors.white,
        marginTop: 20,
        padding: 5,
    },
    map: {
        padding: 10,
    },
    counter: {
        justifyContent: "flex-end",
    },
    cancelOrder: {
        color: colors.danger,
        alignSelf: "center",
    },
    cancel: {
        backgroundColor: colors.white,
        padding: 10,
    },
});

export default AppBasket;
