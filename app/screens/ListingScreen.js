import React, { useEffect } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
import AppBlankScreen from "../components/AppBlankScreen";
import AppCard from "../components/AppCard";
import colors from "../config/colors";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";
import { useState } from "react";
import useListings from "../listing/useListings";
import useAuth from "../auth/useAuth";
import listings from "../api/listings";
import AppSearchBar from "../components/AppSearchBar";
import AppCategoryTab from "../components/category/AppCategoryTab";
import useCategories from "../category/useCategories";

function ListingScreen({ navigation }) {
    const { data, error, loading, request } = useListings();
    const categoryContext = useCategories();
    const { user } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const [products, setProducts] = useState(data);

    useEffect(() => {
        request();
        fetch("https://type.fit/api/quotes")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setQuotes(data);
            });
    }, []);

    useEffect(() => {
        setProducts(data);
    }, [data]);

    const categories = categoryContext.data.map((category) => {
        return {
            title: category.name,
            backgroundColor: colors.secondary,
            onPress: () =>
                setProducts(
                    data.filter((product) => product.categoryId === category.id)
                ),
        };
    });

    return (
        <>
            <AppActivityIndicator visible={loading} />
            <AppBlankScreen style={styles.container}>
                {error && (
                    <>
                        <AppText>Couldn't retrieve the Feeds.</AppText>
                        <AppButton
                            title="retry"
                            color={colors.primary}
                            onPress={request}
                        />
                    </>
                )}
                <AppSearchBar
                    searchHandler={(text) => {
                        setProducts(
                            data
                                .filter((object) => object.isDeleted === false)
                                .filter((object) => {
                                    const regex = new RegExp(text, "i");
                                    return object.title.search(regex) != -1;
                                })
                        );
                    }}
                />
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <AppCard
                            title={item.title}
                            subTitle={`${item.price} PHP/kg`}
                            imageUrl={item.images[0].url}
                            onPress={() =>
                                navigation.navigate(
                                    routes.LISTING_DETAILS_SCREEN,
                                    item
                                )
                            }
                            thumbnailUrl={item.images[0].thumbnailUrl}
                            status={item.status}
                            user={user.role}
                            onLongPress={() =>
                                Alert.alert(
                                    "Delete Product",
                                    "Are you sure you want to delete this?",
                                    [
                                        {
                                            text: "Yes",
                                            onPress: () => {
                                                listings.deleteListings(
                                                    item.id
                                                );
                                                request();
                                            },
                                        },
                                        { text: "No" },
                                    ]
                                )
                            }
                            quotes={quotes}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <AppCategoryTab
                            items={[
                                {
                                    title: "default",
                                    backgroundColor: colors.medium,
                                    onPress: () => setProducts(data),
                                },
                                ...categories,
                            ]}
                            backgroundColor={colors.light}
                        />
                    )}
                    ListFooterComponent={() => {
                        return (
                            !products.length && (
                                <AppText style={styles.searchText}>
                                    No Result Found.
                                </AppText>
                            )
                        );
                    }}
                    stickyHeaderIndices={[0]}
                    refreshing={refreshing}
                    onRefresh={request}
                />
            </AppBlankScreen>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        padding: 20,
    },
    searchText: {
        marginTop: 10,
        alignSelf: "center",
    },
});

export default ListingScreen;
