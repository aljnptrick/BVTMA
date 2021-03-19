import React, { useState, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import colors from "../config/colors";
import MapViewDirections from "react-native-maps-directions";
import AppText from "./AppText";
import AppIcon from "./AppIcon";
import Constants from "expo-constants";
import AppActivityIndicator from "./AppActivityIndicator";
import LocationContext from "../location/context";
import useAuth from "../auth/useAuth";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const apikey = Constants.manifest.extra.apikey;
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height / 2;
const latitude = 16.4496452;
const longitude = 120.58917234076404;
const latitudeDelta = 0.09;

const initialRegion = {
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta: latitudeDelta * (width / height),
};

function AppMap({ customerLocation, setSelectedLocation, status }) {
    const { user } = useAuth();
    const { location, loading } = useContext(LocationContext);
    const [duration, setDuration] = useState("");
    const [distance, setDistance] = useState("");

    return (
        <>
            {loading ? (
                <AppActivityIndicator visible={loading} />
            ) : (
                <View style={styles.container}>
                    <View style={styles.detailsContainer}>
                        <AppIcon
                            name="google-maps"
                            backgroundColor={colors.secondary}
                        />
                        <View style={styles.details}>
                            <AppText
                                style={styles.detailsText}
                                numberOfLines={1}
                            >
                                {duration}
                            </AppText>
                            <AppText
                                style={styles.detailsText}
                                numberOfLines={1}
                            >
                                {distance}
                            </AppText>
                        </View>
                    </View>
                    <MapView style={styles.map} initialRegion={initialRegion}>
                        <Marker
                            coordinate={{ latitude, longitude }}
                            title={
                                user.role !== "Admin"
                                    ? "La Tinidad Trading Post, Benguet"
                                    : "BVTMA"
                            }
                        />
                        {location && (
                            <Marker
                                coordinate={
                                    customerLocation
                                        ? customerLocation
                                        : location
                                }
                                title={
                                    user.role !== "Customer"
                                        ? "Customer"
                                        : "You"
                                }
                            />
                        )}
                        {location && (
                            <MapViewDirections
                                origin={{ latitude, longitude }}
                                destination={
                                    customerLocation
                                        ? customerLocation
                                        : location
                                }
                                apikey={apikey}
                                strokeWidth={3}
                                strokeColor={colors.primary}
                                onReady={({ distance, duration }) => {
                                    setDistance(
                                        `Distance: ${Math.floor(distance)} km`
                                    );
                                    setDuration(
                                        `Duration: ${Math.floor(duration)} min.`
                                    );
                                }}
                            />
                        )}
                    </MapView>
                    {status === "new" && (
                        <View style={styles.search}>
                            <GooglePlacesAutocomplete
                                placeholder="Input location here instead..."
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    // 'details' is provided when fetchDetails = true
                                    const {
                                        lat,
                                        lng,
                                    } = details.geometry.location;
                                    setSelectedLocation({
                                        latitude: lat,
                                        longitude: lng,
                                    });
                                }}
                                query={{
                                    key: apikey,
                                    language: "en",
                                }}
                            />
                        </View>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    map: {
        width,
        height,
    },
    details: {
        marginLeft: 10,
        justifyContent: "flex-start",
        width: "50%",
    },
    detailsText: {
        fontWeight: "500",
    },
    detailsContainer: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    search: {
        width: "100%",
        marginTop: 10,
    },
});

export default AppMap;
