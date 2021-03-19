import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function AppIcon({
    name,
    size = 50,
    backgroundColor = colors.black,
    iconColor = colors.white,
    onPress,
    style,
}) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.icon(backgroundColor, size), style]}>
                <MaterialCommunityIcons
                    name={name}
                    size={size / 2}
                    color={iconColor}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    icon: (backgroundColor, size) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
    }),
});

export default AppIcon;
