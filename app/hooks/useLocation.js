import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

export default useLocation = () => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);

    const getLocation = async () => {
        try {
            setLoading(true);
            const { granted } = await Location.requestPermissionsAsync();
            if (granted) {
                const {
                    coords: { latitude, longitude },
                } = await Location.getLastKnownPositionAsync();
                setLocation({ latitude, longitude });
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    return { location, loading };
};
