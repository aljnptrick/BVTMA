import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";
import colors from "../config/colors";
import * as Yup from "yup";

import {
    AppForm,
    AppFormField,
    AppSubmitButton,
    AppErrorMessage,
} from "../components/forms";
import auth from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppKeyboardAvoidingView from "../components/AppKeyboardAvoidingView";
import { TouchableOpacity } from "react-native-gesture-handler";
import routes from "../navigation/routes";
import AppText from "../components/AppText";

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
    const loginApi = useApi(auth.login);
    const { logIn } = useAuth();
    const [visible, setVisible] = useState(false);

    const handleSubmit = async ({ email, password }) => {
        const result = await loginApi.request(email, password);

        if (!result.ok) {
            return setVisible(true);
        } else {
            setVisible(false);
            logIn(result.data);
        }
    };

    return (
        <>
            <AppActivityIndicator visible={loginApi.loading} />
            <AppKeyboardAvoidingView style={styles.container}>
                <AppForm
                    initialValues={{ email: "", password: "" }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <Image
                        style={styles.logo}
                        source={require(`../assets/logo.png`)}
                    />

                    <AppErrorMessage
                        error="Invalid email and/or password."
                        visible={visible}
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

                    <AppSubmitButton title="submit" color={colors.primary} />
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(routes.FORGOT_PASSWORD_SCREEN)
                        }
                    >
                        <AppText style={styles.forgotPassword}>
                            Forgot Password
                        </AppText>
                    </TouchableOpacity>
                </AppForm>
            </AppKeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: "center",
        marginTop: 50,
        marginBottom: 20,
        borderRadius: 50,
    },
    forgotPassword: {
        color: colors.info,
        alignSelf: "center",
        marginTop: 20,
    },
});

export default LoginScreen;
