import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import {
    AppErrorMessage,
    AppForm,
    AppFormField,
    AppSubmitButton,
} from "../components/forms";
import colors from "../config/colors";
import * as Yup from "yup";
import useAuth from "../auth/useAuth";
import AppKeyboardAvoidingView from "../components/AppKeyboardAvoidingView";
import userApi from "../api/user";
import useApi from "../hooks/useApi";
import UploadScreen from "./UploadScreen";

const validationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().min(4).label("Password"),
    passwordConfirmation: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string()
            .oneOf([Yup.ref("password")], "Both password need to be the same")
            .required()
            .label("Confirm Password"),
    }),
});

function AccountEditScreen({ navigation }) {
    const [uploadVisible, setUploadVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const updateApi = useApi(userApi.updateEntries);
    const { user, setUser } = useAuth();
    const [error, setError] = useState(null);

    const handleSubmit = async (userInfo) => {
        setProgress(0);
        setUploadVisible(true);
        const result = await updateApi.request(
            { ...userInfo, id: user.userId },
            (progress) => setProgress(progress)
        );

        if (result.data.error) {
            setUploadVisible(false);
            setError(result.data.error);
            return;
        }
        if (result.error) {
            setUploadVisible(false);
            Alert.alert("Something went wrong to the server.");
            return;
        }

        const { name, email, password } = result.data;
        setUser((prevUser) => ({ ...prevUser, name, email, password }));
        navigation.goBack();
    };

    return (
        <>
            <UploadScreen
                onDone={() => setUploadVisible(false)}
                progress={progress}
                visible={uploadVisible}
            />
            <AppKeyboardAvoidingView style={styles.container}>
                <AppForm
                    initialValues={{
                        name: user.name,
                        email: user.email,
                        password: "",
                        passwordConfirmation: "",
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <AppErrorMessage error={error} visible={error !== null} />

                    <AppFormField
                        autoCaptilize="none"
                        autoCorrect={false}
                        icon="account"
                        name="name"
                        placeholder="Name"
                        textContentType="name"
                    />

                    <AppFormField
                        autoCaptilize="none"
                        autoCorrect={false}
                        icon="email"
                        keyboardType="email-address"
                        name="email"
                        placeholder="Email"
                        textContentType="emailAddress"
                    />

                    <AppFormField
                        autoCaptilize="none"
                        autoCorrect={false}
                        icon="lock"
                        name="password"
                        placeholder="Password"
                        secureTextEntry
                        textContentType="password"
                    />

                    <AppFormField
                        autoCaptilize="none"
                        autoCorrect={false}
                        icon="lock"
                        name="passwordConfirmation"
                        placeholder="Confirm Password"
                        secureTextEntry
                        textContentType="password"
                    />

                    <AppSubmitButton title="save" color={colors.primary} />
                </AppForm>
            </AppKeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default AccountEditScreen;
