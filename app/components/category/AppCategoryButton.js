import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "../../config/colors";
import AppText from "../AppText";

function AppCategoryButton({
    onPress,
    backgroundColor = colors.primary,
    title = "status",
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor }]}
        >
            <AppText style={styles.title}>{title}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
    },
    title: {
        fontWeight: "bold",
        color: colors.white,
    },
});

export default AppCategoryButton;
