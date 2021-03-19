import React, { useState } from "react";
import { StyleSheet, Image, ScrollView } from "react-native";
import {
    AppErrorMessage,
    AppForm,
    AppFormField,
    AppSubmitButton,
} from "./forms";
import colors from "../config/colors";
import * as Yup from "yup";
import auth from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import AppActivityIndicator from "./AppActivityIndicator";
import AppKeyboardAvoidingView from "./AppKeyboardAvoidingView";

const validationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
    passwordConfirmation: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string()
            .oneOf([Yup.ref("password")], "Both password need to be the same")
            .required()
            .label("Confirm Password"),
    }),
    contactNumber: Yup.string().required().min(11).label("Contact Number"),
});

function RegisterScreen({ register, closeModal }) {
    const registerApi = useApi(auth.register);
    const loginApi = useApi(auth.login);
    const { logIn } = useAuth();
    const [error, setError] = useState(null);

    const handleSubmit = async ({ name, email, password, contactNumber }) => {
        if (register) {
            const result = await registerApi.request({
                name,
                email,
                password,
                contactNumber,
            });

            if (!result.ok) {
                if (result.data) setError(result.data.error);
                else {
                    setError("An unexpected error occured.");
                    console.log(result);
                }
                return;
            }

            const { data: authToken } = await loginApi.request(email, password);
            logIn(authToken);
        } else {
            const result = await registerApi.request({
                name,
                email,
                password,
                contactNumber,
                role: "Admin",
            });

            if (!result.ok) {
                if (result.data) setError(result.data.error);
                else {
                    setError("An unexpected error occured.");
                    console.log(result);
                }
                return;
            }

            closeModal();
        }
    };

    return (
        <>
            <AppActivityIndicator
                visible={registerApi.loading || loginApi.loading}
            />
            <ScrollView>
                <AppKeyboardAvoidingView style={styles.container}>
                    <AppForm
                        initialValues={{
                            name: "",
                            email: "",
                            password: "",
                            passwordConfirmation: "",
                            contactNumber: "",
                        }}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        <Image
                            style={styles.logo}
                            source={require(`../assets/logo.png`)}
                        />

                        <AppErrorMessage
                            error={error}
                            visible={error !== null}
                        />

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
                            keyboardType="phone-pad"
                            icon="phone"
                            name="contactNumber"
                            placeholder="Contact Number"
                            textContentType="none"
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

                        <AppSubmitButton
                            title="register"
                            color={colors.primary}
                        />
                    </AppForm>
                </AppKeyboardAvoidingView>
            </ScrollView>
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
});

export default RegisterScreen;
