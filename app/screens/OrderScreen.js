import React, { useState, useEffect } from "react";
import { Alert, Button, FlatList, Modal, StyleSheet } from "react-native";
import AppListItem from "../components/lists/AppListItem";
import AppBlankScreen from "../components/AppBlankScreen";
import AppListSeparator from "../components/lists/AppListSeparator";
import AppText from "../components/AppText";
import useOrders from "../order/useOrders";
import moment from "moment";
import useAuth from "../auth/useAuth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppBasket from "../components/AppBasket";
import AppListItemAccept from "../components/lists/AppListItemAccept";
import AppListItemDeclined from "../components/lists/AppListItemDeclined";
import AppListItemConfirm from "../components/lists/AppListItemConfirm";
import order from "../api/order";
import useApi from "../hooks/useApi";
import AppCategoryTab from "../components/category/AppCategoryTab";
import colors from "../config/colors";
import AppSearchBar from "../components/AppSearchBar";

function OrderScreen(props) {
    const { user } = useAuth();
    const { data, request, loading } = useOrders();
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [previousBasket, setPreviousBasket] = useState([]);
    const [customerLocation, setCustomerLocation] = useState({});
    const [orders, setOrders] = useState(data);

    const acceptOrderApi = useApi(order.acceptOrder);
    const confirmOrderApi = useApi(order.confirmOrder);

    const categories = [
        {
            title: "default",
            backgroundColor: colors.medium,
            onPress: () => setOrders(data),
        },
        {
            title: "new",
            backgroundColor: colors.info,
            onPress: () =>
                setOrders(data.filter((object) => object.status === "new")),
        },
        {
            title: "accepted",
            backgroundColor: colors.success,
            onPress: () =>
                setOrders(
                    data.filter((object) => object.status === "accepted")
                ),
        },
        {
            title: "declined",
            backgroundColor: colors.danger,
            onPress: () =>
                setOrders(
                    data.filter((object) => object.status === "declined")
                ),
        },
        {
            title: "completed",
            backgroundColor: colors.secondary,
            onPress: () =>
                setOrders(
                    data.filter((object) => object.status === "completed")
                ),
        },
    ];

    useEffect(() => {
        setOrders(data);
    }, [data]);

    return (
        <>
            <AppActivityIndicator
                visible={
                    loading || acceptOrderApi.loading || confirmOrderApi.loading
                }
            />
            <AppBlankScreen style={styles.container}>
                <AppSearchBar
                    searchHandler={(text) =>
                        setOrders(
                            data.filter((object) => {
                                const regex = new RegExp(text, "i");
                                return (
                                    moment(object.createdAt)
                                        .format("MMM-DD-YYYY")
                                        .search(regex) != -1
                                );
                            })
                        )
                    }
                    backgroundColor={colors.light}
                    placeholder="Search ordered date here"
                />
                <FlatList
                    data={
                        user.role === "Admin"
                            ? orders
                            : orders.filter(
                                  (object) => object.ownerId === user.userId
                              )
                    }
                    keyExtractor={(data) => data.id.toString()}
                    renderItem={({ item }) => (
                        <AppListItem
                            title={
                                user.role === "Admin"
                                    ? `${item.ownerName}`
                                    : `${moment(item.createdAt).format(
                                          "MMM-DD-YYYY"
                                      )}`
                            }
                            subTitle={
                                user.role === "Admin"
                                    ? `${moment(item.createdAt).format(
                                          "MMM-DD-YYYY"
                                      )}, ${item.details.length} items`
                                    : `${item.details.length} items`
                            }
                            onPress={() => {
                                setCustomerLocation(item.location);
                                setPreviousBasket(item.details);
                                setVisible(true);
                            }}
                            renderRightActions={() =>
                                user.role === "Admin"
                                    ? item.status === "new" && (
                                          <>
                                              <AppListItemDeclined
                                                  onPress={async () => {
                                                      const result = await acceptOrderApi.request(
                                                          item.id,
                                                          {
                                                              isAccepted: false,
                                                          }
                                                      );

                                                      if (!result.ok)
                                                          return Alert.alert(
                                                              "Something went wrong."
                                                          );

                                                      request();
                                                  }}
                                              />
                                              <AppListItemAccept
                                                  onPress={async () => {
                                                      const result = await acceptOrderApi.request(
                                                          item.id,
                                                          {
                                                              isAccepted: true,
                                                          }
                                                      );

                                                      if (!result.ok)
                                                          return Alert.alert(
                                                              "Something went wrong."
                                                          );

                                                      request();
                                                  }}
                                              />
                                          </>
                                      )
                                    : item.status === "accepted" && (
                                          <AppListItemConfirm
                                              onPress={async () => {
                                                  const result = await confirmOrderApi.request(
                                                      item.id
                                                  );

                                                  if (!result.ok)
                                                      return Alert.alert(
                                                          "Something went wrong."
                                                      );

                                                  request();
                                              }}
                                          />
                                      )
                            }
                            showChevrons={
                                user.role === "Admin"
                                    ? item.status === "new"
                                        ? true
                                        : item.status === "accepted"
                                        ? false
                                        : item.status === "declined"
                                        ? false
                                        : item.status === "completed" && false
                                    : item.status === "new"
                                    ? false
                                    : item.status === "accepted"
                                    ? true
                                    : item.status === "declined"
                                    ? false
                                    : item.status === "completed" && false
                            }
                            status={item.status}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <AppCategoryTab items={categories} />
                    )}
                    ListFooterComponent={() => {
                        return (
                            orders.length === 0 && (
                                <AppText style={styles.searchText}>
                                    No Result Found.
                                </AppText>
                            )
                        );
                    }}
                    ItemSeparatorComponent={() => <AppListSeparator />}
                    stickyHeaderIndices={[0]}
                    refreshing={refreshing}
                    onRefresh={() => request()}
                />
            </AppBlankScreen>
            <Modal animationType="slide" visible={visible}>
                <AppBlankScreen>
                    <Button title="close" onPress={() => setVisible(false)} />
                    <AppBasket
                        status="confirm"
                        previousBasket={previousBasket}
                        customerLocation={customerLocation}
                    />
                </AppBlankScreen>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    searchText: {
        marginTop: 10,
        alignSelf: "center",
    },
});

export default OrderScreen;
