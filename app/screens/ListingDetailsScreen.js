import React, { useState, useEffect, useRef, useContext } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    Button,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import AppText from "../components/AppText";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";
import AppKeyboardAvoidingView from "../components/AppKeyboardAvoidingView";
import Counter from "react-native-counters";
import AppButton from "../components/AppButton";
// import * as Notifications from "expo-notifications";
import routes from "../navigation/routes";
import useAuth from "../auth/useAuth";
import useListings from "../listing/useListings";
import useApi from "../hooks/useApi";
import listing from "../api/listing";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormAddListing from "../components/forms/AppFormAddListing";
import AppBlankScreen from "../components/AppBlankScreen";
import categories from "../api/categories";
import * as ImagePicker from "expo-image-picker";
import listings from "../api/listings";
import BasketContext from "../basket/context";

// Notifications.setNotificationHandler({
//     handleNotification: async () => {
//         return {
//             shouldShowAlert: true,
//             shouldPlaySound: true,
//             shouldSetBadge: true,
//         };
//     },
// });

function ListingDetailsScreen({ route, navigation }) {
    const {
        title,
        price,
        images,
        description,
        status,
        id,
        categoryId,
    } = route.params;
    const { user } = useAuth();
    const { request } = useListings();
    const listingApi = useApi(listing.updateListingStatus);
    const listingsApi = useApi(listings.putImageListing);
    const categoriesApi = useApi(categories.get);
    const [total, setTotal] = useState(price);
    const scrollView = useRef(null);
    const [visible, setVisible] = useState(false);
    const { setBasket } = useContext(BasketContext);

    useEffect(() => {
        categoriesApi.request();
    }, []);

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5,
            });
            if (!result.cancelled) {
                await listingsApi.request(result.uri, id);
                if (listingApi.error) {
                    console.log("Something went wrong on updating the image");
                } else {
                    request();
                    navigation.navigate(routes.LISTING_SCREEN);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <AppActivityIndicator
                visible={listingApi.loading || listingsApi.loading}
            />
            <ScrollView
                ref={scrollView}
                onContentSizeChange={() => scrollView.current.scrollToEnd()}
            >
                <AppKeyboardAvoidingView style={styles.container}>
                    <TouchableWithoutFeedback
                        onLongPress={
                            user.role === "Admin"
                                ? () =>
                                      Alert.alert(
                                          "Edit Image",
                                          "Do you like to edit the image?",
                                          [
                                              {
                                                  text: "Yes",
                                                  onPress: selectImage,
                                              },
                                              { text: "No" },
                                          ]
                                      )
                                : () => Alert.alert(title)
                        }
                    >
                        <View>
                            <Image
                                style={styles.image}
                                uri={images[0].url}
                                preview={{ uri: images[0].thumbnailUrl }}
                                tint="light"
                            />
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.detailsContainer}>
                        <AppText style={styles.title} numberOfLines={1}>
                            {title}
                        </AppText>
                        <AppText style={styles.description} numberOfLines={3}>
                            {description}
                        </AppText>
                        <AppText style={styles.price}>{`${total} PHP`}</AppText>
                        {user.role !== "Admin" ? (
                            <Counter
                                max={Infinity}
                                start={1}
                                onChange={(value) => setTotal(price * value)}
                            />
                        ) : (
                            <TouchableOpacity onPress={() => setVisible(true)}>
                                <AppText style={styles.edit}>
                                    Edit Entries?
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                </AppKeyboardAvoidingView>
            </ScrollView>

            <View style={styles.addToBasketButton}>
                {user.role !== "Admin" ? (
                    <AppButton
                        title={"Add To Basket"}
                        color={colors.primary}
                        onPress={() => {
                            // addtokart here
                            const content = {
                                title: "Awesome!",
                                body: "This Item is added to your Basket.",
                            };

                            // Notifications.scheduleNotificationAsync({
                            //     content,
                            //     trigger: null,
                            // });

                            setBasket((prevBasket) => [
                                ...prevBasket,
                                {
                                    ...route.params,
                                    total,
                                    quantity: total / price,
                                    basketId: prevBasket.length + 1,
                                },
                            ]);

                            navigation.navigate(routes.ACCOUNT_NAVIGATOR, {
                                screen: routes.BASKET_SCREEN,
                                initial: false,
                            });
                        }}
                    />
                ) : (
                    <AppButton
                        title={
                            status === "Available" ? "out of stock" : "in stock"
                        }
                        onPress={async () => {
                            await listingApi.request(id);
                            if (!listingApi.error) {
                                request();
                                navigation.navigate(routes.LISTING_SCREEN);
                            } else {
                                alert("Something went wrong to the server.");
                            }
                        }}
                        color={
                            status === "Available"
                                ? colors.danger
                                : colors.success
                        }
                    />
                )}
            </View>
            <Modal visible={visible} animationType="slide">
                <AppBlankScreen>
                    <Button title="close" onPress={() => setVisible(false)} />
                    <AppFormAddListing
                        listing={{
                            ...route.params,
                            category: categoriesApi.data.filter(
                                (object) => object.id === categoryId
                            ),
                        }}
                        navigation={navigation}
                    />
                </AppBlankScreen>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    image: {
        width: "100%",
        height: 300,
    },
    detailsContainer: {
        padding: 10,
        alignItems: "center",
    },
    price: {
        fontSize: 40,
        color: colors.secondary,
        fontWeight: "bold",
    },
    title: {
        fontSize: 40,
    },
    description: {
        marginBottom: 50,
    },
    addToBasketButton: {
        padding: 10,
    },
    edit: {
        fontSize: 25,
        color: colors.info,
        textDecorationLine: "underline",
    },
});

export default ListingDetailsScreen;
