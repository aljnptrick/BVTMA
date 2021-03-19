import React, { useState } from "react";
import { useEffect } from "react";
import { StyleSheet, FlatList, Button, Modal, View, Alert } from "react-native";
import categories from "../api/categories";
import useCategories from "../category/useCategories";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppBlankScreen from "../components/AppBlankScreen";
import AppButton from "../components/AppButton";
import AppKeyboardAvoidingView from "../components/AppKeyboardAvoidingView";
import AppTextInput from "../components/AppTextInput";
import {
    AppListItem,
    AppListItemDeleteAction,
    AppListSeparator,
    AppListEditAction,
} from "../components/lists";
import colors from "../config/colors";
import useApi from "../hooks/useApi";

function CategoriesScreen(props) {
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState("");
    const [action, setAction] = useState(null);
    const [editId, setEditId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const { data, request, loading, error } = useCategories();
    const categoriesDeleteApi = useApi(categories.deleteCategory);
    const categoriesAddApi = useApi(categories.add);
    const categoriesEditApi = useApi(categories.update);

    useEffect(() => {
        if (error)
            Alert.alert("Something went wrong on fetching the category data.");
    });

    return (
        <>
            <AppActivityIndicator
                visible={
                    loading ||
                    categoriesAddApi.loading ||
                    categoriesDeleteApi.loading ||
                    categoriesEditApi.loading
                }
            />
            <View style={styles.container}>
                <AppButton
                    title="add"
                    color={colors.primary}
                    onPress={() => {
                        setAction("add");
                        setValue("");
                        setVisible(true);
                    }}
                />
                <FlatList
                    data={data}
                    keyExtractor={(data) => data.id.toString()}
                    renderItem={({ item }) => (
                        <AppListItem
                            title={item.name}
                            renderRightActions={() => (
                                <>
                                    <AppListItemDeleteAction
                                        onPress={async () => {
                                            await categoriesDeleteApi.request(
                                                item.id
                                            );
                                            if (categoriesDeleteApi.error) {
                                                alert("Something went wrong.");
                                            } else {
                                                request();
                                            }
                                        }}
                                    />
                                    <AppListEditAction
                                        onPress={() => {
                                            setValue(item.name);
                                            setAction("edit");
                                            setEditId(item.id);
                                            setVisible(true);
                                        }}
                                    />
                                </>
                            )}
                            showChevrons={true}
                            fontWeight="normal"
                        />
                    )}
                    ItemSeparatorComponent={() => <AppListSeparator />}
                    refreshing={refreshing}
                    onRefresh={() => request()}
                />
            </View>
            <Modal animationType="slide" visible={visible}>
                <AppBlankScreen>
                    <Button title="cancel" onPress={() => setVisible(false)} />
                    <AppKeyboardAvoidingView style={styles.modalContainer}>
                        <AppTextInput
                            width="100%"
                            placeholder="Input a category here..."
                            value={value}
                            onChangeText={(text) => setValue(text)}
                        />
                        <AppButton
                            title="submit"
                            onPress={async () => {
                                if (value === "")
                                    return Alert.alert(
                                        "Notice",
                                        "Input field must contain atleast one character."
                                    );
                                setVisible(false);
                                if (action === "add") {
                                    await categoriesAddApi.request(value);
                                    if (categoriesAddApi.error) {
                                        Alert.alert(
                                            "Something went wrong on adding the category."
                                        );
                                    } else {
                                        request();
                                    }
                                } else if (action === "edit") {
                                    await categoriesEditApi.request(
                                        editId,
                                        value
                                    );
                                    if (categoriesEditApi.error) {
                                        Alert.alert(
                                            "Something went wrong on editing the category."
                                        );
                                    } else {
                                        request();
                                    }
                                }
                            }}
                            color={colors.primary}
                        />
                    </AppKeyboardAvoidingView>
                </AppBlankScreen>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        flexDirection: "row",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CategoriesScreen;
