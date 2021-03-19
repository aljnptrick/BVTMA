import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image as ReactImage,
    Alert,
} from "react-native";
import AppText from "../components/AppText";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";

function AppCard({
    title,
    subTitle,
    imageUrl,
    onPress,
    thumbnailUrl,
    status = "Available",
    user = "Customer",
    onLongPress,
    quotes,
}) {
    return (
        <>
            {status === "Unavailable" && (
                <TouchableWithoutFeedback
                    onPress={
                        user === "Customer"
                            ? () =>
                                  Alert.alert(
                                      `We're Sorry`,
                                      `${title} is currently out of stock.`
                                  )
                            : onPress
                    }
                    onLongPress={
                        user === "Admin"
                            ? onLongPress
                            : () =>
                                  Alert.alert(
                                      quotes[
                                          Math.floor(
                                              Math.random() * quotes.length
                                          )
                                      ].text,
                                      quotes[
                                          Math.floor(
                                              Math.random() * quotes.length
                                          )
                                      ].author
                                  )
                    }
                >
                    <View style={styles.overlay}>
                        <ReactImage
                            source={require(`../assets/out-of-stock.png`)}
                            style={styles.outOfStockImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )}
            <TouchableWithoutFeedback
                onPress={onPress}
                onLongPress={
                    user === "Admin"
                        ? onLongPress
                        : () =>
                              Alert.alert(
                                  quotes[
                                      Math.floor(Math.random() * quotes.length)
                                  ].text,
                                  quotes[
                                      Math.floor(Math.random() * quotes.length)
                                  ].author
                              )
                }
            >
                <View style={styles.card}>
                    <Image
                        tint="light"
                        uri={imageUrl}
                        style={styles.image}
                        preview={{ uri: thumbnailUrl }}
                    />
                    <View style={styles.detailsContainer}>
                        <AppText style={styles.title} numberOfLines={1}>
                            {title}
                        </AppText>
                        <AppText style={styles.subTitle} numberOfLines={2}>
                            {subTitle}
                        </AppText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 25,
        backgroundColor: colors.white,
        marginBottom: 20,
        overflow: "hidden",
    },
    detailsContainer: {
        padding: 20,
        alignItems: "flex-start",
    },
    image: {
        height: 200,
        width: "100%",
    },
    subTitle: {
        color: colors.secondary,
        fontWeight: "bold",
    },
    title: {
        marginBottom: 5,
    },
    outOfStockImage: {
        position: "absolute",
        bottom: 0,
        height: 150,
        width: 150,
        alignSelf: "flex-end",
    },
    overlay: {
        position: "absolute",
        height: "94%",
        width: "100%",
        zIndex: 1,
        borderRadius: 25,
        overflow: "hidden",
    },
});

export default AppCard;
