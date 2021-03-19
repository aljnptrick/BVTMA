import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import colors from "../config/colors";
import routes from "../navigation/routes";

const WelcomeScreen = ({ navigation }) => {
    return (
        <React.Fragment>
            <ImageBackground
                style={styles.backgroundImage}
                source={require(`../assets/splash.png`)}
            >
                <View style={styles.buttonContainer}>
                    {[
                        {
                            title: "login",
                            color: colors.primary,
                            onPress: () =>
                                navigation.navigate(routes.LOGIN_SCREEN),
                        },
                        {
                            title: "register",
                            color: colors.secondary,
                            onPress: () =>
                                navigation.navigate(routes.REGISTER_SCREEN),
                        },
                    ].map((object, index) => (
                        <AppButton
                            key={index}
                            title={object.title}
                            color={object.color}
                            onPress={object.onPress}
                        />
                    ))}
                </View>
            </ImageBackground>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    buttonContainer: {
        padding: 20,
        width: "100%",
    },
});

export default WelcomeScreen;
