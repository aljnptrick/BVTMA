import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";

function AppListItemAccept({ onPress }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.container}>
                <AppText style={{ color: colors.white }}>Accept</AppText>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.success,
        width: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
});

export default AppListItemAccept;
