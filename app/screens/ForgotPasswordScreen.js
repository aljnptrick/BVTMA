import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import AppKeyboardAvoidingView from "../components/AppKeyboardAvoidingView";
import colors from "../config/colors";
import * as Yup from "yup";
import { AppForm, AppSubmitButton, AppFormField } from "../components/forms";
import useApi from "../hooks/useApi";
import auth from "../api/auth";
import * as Notifications from "expo-notifications";
import AppActivityIndicator from "../components/AppActivityIndicator";

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        };
    },
});

const content = {
    title: "BVTMA",
    body: "Password Reset link is sent to your email.",
};

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
});

function ForgotPasswordScreen({ navigation }) {
    const recoverPasswordApi = useApi(auth.recoverPassword);

    const handleSubmit = async (value) => {
        const result = await recoverPasswordApi.request(value);

        if (result.error)
            return Alert.alert("Something went wrong to the server");

        Notifications.scheduleNotificationAsync({
            content,
            trigger: null,
        });

        navigation.goBack();
    };

    return (
        <>
            <AppActivityIndicator visible={recoverPasswordApi.loading} />
            <AppKeyboardAvoidingView>
                <View style={styles.container}>
                    <AppForm
                        initialValues={{ email: "" }}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        <AppFormField
                            autoCaptilize="none"
                            autoCorrect={false}
                            icon="email"
                            keyboardType="email-address"
                            name="email"
                            placeholder="Email"
                            textContentType="emailAddress"
                        />
                        <AppSubmitButton
                            title="Submit"
                            color={colors.primary}
                        />
                    </AppForm>
                </View>
            </AppKeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ForgotPasswordScreen;
