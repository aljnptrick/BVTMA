import React, { useState } from "react";
import { Button, FlatList, Modal, StyleSheet } from "react-native";
import useAuth from "../auth/useAuth";
import AppBlankScreen from "../components/AppBlankScreen";
import AppButton from "../components/AppButton";
import { AppListItem, AppListSeparator } from "../components/lists";
import colors from "../config/colors";
import AppAddUser from "../components/AppAddUser";
import AppActivityIndicator from "../components/AppActivityIndicator";

function AdministratorsScreen(props) {
    const [visible, setVisible] = useState(false);
    const { admins, loading, request } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    return (
        <>
            <AppActivityIndicator visible={loading} />
            <AppBlankScreen style={styles.container}>
                <AppButton
                    title="new"
                    onPress={() => setVisible(true)}
                    color={colors.primary}
                />
                <FlatList
                    data={admins.filter((object) => object.role === "Admin")}
                    keyExtractor={(data) => data.id.toString()}
                    renderItem={({ item }) => (
                        <AppListItem title={item.name} subTitle={item.email} />
                    )}
                    ItemSeparatorComponent={() => <AppListSeparator />}
                    refreshing={refreshing}
                    onRefresh={() => request()}
                />
            </AppBlankScreen>
            <Modal animationType="slide" visible={visible}>
                <AppBlankScreen>
                    <Button title="close" onPress={() => setVisible(false)} />
                    <AppAddUser
                        register={false}
                        closeModal={() => {
                            setVisible(false);
                            request();
                        }}
                    />
                </AppBlankScreen>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});

export default AdministratorsScreen;
