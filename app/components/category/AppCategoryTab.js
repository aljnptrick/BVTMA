import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import colors from "../../config/colors";
import AppCategoryButton from "./AppCategoryButton";

function AppCategoryTab({ items = [], backgroundColor = colors.white }) {
    return (
        <ScrollView horizontal style={[styles.container, { backgroundColor }]}>
            {items.map(({ title, onPress, backgroundColor }) => (
                <AppCategoryButton
                    key={title}
                    title={title}
                    onPress={onPress}
                    backgroundColor={backgroundColor}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        padding: 5,
    },
});

export default AppCategoryTab;
