import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    RefreshControl,
    ScrollView,
} from "react-native";
import AppBlankScreen from "../components/AppBlankScreen";
import AppText from "../components/AppText";
import { BarChart } from "react-native-chart-kit";
import colors from "../config/colors";
import useOrders from "../order/useOrders";
import moment from "moment";
import AppActivityIndicator from "../components/AppActivityIndicator";

const getUnique = (array) => {
    const uniqueArray = [];

    array.forEach((item) => {
        if (uniqueArray.indexOf(item) === -1) {
            uniqueArray.push(item);
        }
    });

    return uniqueArray;
};

function SalesScreen(props) {
    const [refreshing, setRefreshing] = useState(false);
    const { data, request, loading } = useOrders();
    const labels = getUnique(
        data
            .sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            })
            .map((obj) => moment(obj.createdAt).format("MMM-YY"))
            .reverse()
    );

    return (
        <>
            <AppActivityIndicator visible={loading} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {
                            setRefreshing(true);
                            await request();
                            setRefreshing(false);
                        }}
                    />
                }
            >
                <AppBlankScreen stle={styles.container}>
                    <AppText style={styles.title}>BVTMA Monthly Sales</AppText>
                    <BarChart
                        data={{
                            labels: labels,
                            datasets: [
                                {
                                    data: labels.map((item) => {
                                        return data
                                            .filter(
                                                (obj) =>
                                                    obj.status ===
                                                        "completed" &&
                                                    moment(
                                                        obj.createdAt
                                                    ).format("MMM-YY") === item
                                            )
                                            .reduce(
                                                (acc, curr) =>
                                                    acc + curr.grandTotal,
                                                0
                                            );
                                    }),
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={400}
                        yAxisLabel=" "
                        // yAxisSuffix="k"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: colors.secondary,
                            backgroundGradientFrom: colors.secondary,
                            backgroundGradientTo: colors.primary,
                            // decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726",
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </AppBlankScreen>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        alignSelf: "center",
        color: colors.info,
    },
});

export default SalesScreen;
