import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import routes from "./routes";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

const Stack = createStackNavigator();

export default AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name={routes.WELCOME_SCREEN}
            component={WelcomeScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name={routes.LOGIN_SCREEN}
            component={LoginScreen}
            options={{ title: "Login" }}
        />
        <Stack.Screen
            name={routes.REGISTER_SCREEN}
            component={RegisterScreen}
            options={{ title: "Register" }}
        />
        <Stack.Screen
            name={routes.FORGOT_PASSWORD_SCREEN}
            component={ForgotPasswordScreen}
            options={{ title: "Forgot Password" }}
        />
    </Stack.Navigator>
);
