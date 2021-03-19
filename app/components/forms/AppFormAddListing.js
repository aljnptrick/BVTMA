import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
    AppForm,
    AppFormField,
    AppFormImagePicker,
    AppFormPicker,
    AppSubmitButton,
} from "./index";
import * as Yup from "yup";
import colors from "../../config/colors";
// import AppCategoryPickerItem from "../components/AppCategoryPickerItem";
import listings from "../../api/listings";
import UploadScreen from "../../screens/UploadScreen";
import AppKeyboardAvoidingView from "../AppKeyboardAvoidingView";
import location from "../../config/location";
import routes from "../../navigation/routes";
import useListings from "../../listing/useListings";
import useCategories from "../../category/useCategories";

function AppFormAddListing({ listing = null, navigation }) {
    const [uploadVisible, setUploadVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const listingsContext = useListings();
    const categoriesContext = useCategories();

    const validationSchema = Yup.object().shape({
        title: Yup.string().required().min(1).label("Title"),
        price: Yup.string().required().min(1).max(10000).label("Price"),
        category: Yup.object().nullable(true).required().label("Category"),
        description: Yup.string().optional().label("Description"),
        images:
            listing === null
                ? Yup.array().min(1, "Please select one image.")
                : null,
    });

    const handleSubmit = async (values, { resetForm }) => {
        if (listing === null) {
            setProgress(0);
            setUploadVisible(true);
            const result = await listings.postListings(
                { ...values, location },
                (progress) => setProgress(progress)
            );

            if (!result) {
                setUploadVisible(false);
                alert("Something went wrong.");
            }

            listingsContext.request();
            resetForm();
            navigation.navigate(routes.HOME_NAVIGATOR, {
                screen: routes.LISTING_SCREEN,
            });
        } else {
            setProgress(0);
            setUploadVisible(true);
            const result = await listings.putListings(
                { ...values, id: listing.id },
                (progress) => setProgress(progress)
            );

            if (!result) {
                setUploadVisible(false);
                alert("Something went wrong.");
            }

            listingsContext.request();
            resetForm();
            navigation.navigate(routes.HOME_NAVIGATOR, {
                screen: routes.LISTING_SCREEN,
            });
        }
    };

    return (
        <ScrollView>
            <AppKeyboardAvoidingView style={styles.container}>
                <UploadScreen
                    onDone={() => setUploadVisible(false)}
                    progress={progress}
                    visible={uploadVisible}
                />
                <AppForm
                    enableReinitialize={true}
                    initialValues={{
                        title: listing !== null ? listing.title : "",
                        price: listing !== null ? listing.price.toString() : "",
                        category: listing !== null ? listing.category[0] : null,
                        description:
                            listing !== null ? listing.description : "",
                        images: [],
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    {listing === null ? (
                        <AppFormImagePicker name="images" />
                    ) : null}
                    <AppFormField
                        maxLength={255}
                        autoCaptilize="none"
                        autoCorrect={false}
                        name="title"
                        placeholder="Title"
                        textContentType="none"
                    />

                    <AppFormField
                        autoCaptilize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        name="price"
                        placeholder="Price per kilo"
                        textContentType="none"
                        width={"50%"}
                    />

                    <AppFormPicker
                        name="category"
                        // numColumns={3}
                        items={categoriesContext.data}
                        // PickerItemComponent={AppCategoryPickerItem}
                        placeholder="Category"
                        width={"50%"}
                    />

                    <AppFormField
                        maxLength={255}
                        multiline
                        name="description"
                        numberOfLines={5}
                        placeholder="Description"
                    />

                    <AppSubmitButton color={colors.primary} title="submit" />
                </AppForm>
            </AppKeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

export default AppFormAddListing;
