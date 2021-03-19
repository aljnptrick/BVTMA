import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import AppText from "../AppText";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../../config/colors";

function AppListItem({
    title,
    subTitle,
    image,
    IconComponent,
    onPress,
    renderRightActions,
    showChevrons,
    fontWeight = "bold",
    status,
}) {
    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableHighlight onPress={onPress} underlayColor={colors.light}>
                <View style={styles.container}>
                    {IconComponent}
                    {image && <Image source={image} style={styles.image} />}
                    <View style={styles.listContainer}>
                        <View>
                            <AppText style={{ fontWeight }} numberOfLines={1}>
                                {title}
                            </AppText>
                            {status && (
                                <AppText style={styles.statusColor(status)}>
                                    {status}
                                </AppText>
                            )}
                        </View>
                        {subTitle && (
                            <AppText style={styles.subTitle} numberOfLines={2}>
                                {subTitle}
                            </AppText>
                        )}
                    </View>
                    {showChevrons && (
                        <MaterialCommunityIcons
                            color={colors.medium}
                            name="chevron-right"
                            size={20}
                        />
                    )}
                </View>
            </TouchableHighlight>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        backgroundColor: colors.white,
        alignItems: "center",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    subTitle: {
        fontSize: 15,
        color: colors.medium,
    },
    listContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: "center",
    },
    statusColor: (status) => {
        return {
            color:
                status === "new"
                    ? colors.info
                    : status === "accepted"
                    ? colors.success
                    : status === "declined"
                    ? colors.danger
                    : status === "completed"
                    ? colors.secondary
                    : null,
        };
    },
});

export default AppListItem;
