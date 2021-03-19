import React, { useState } from "react";
import { useEffect } from "react";
import colors from "../config/colors";
import AppTextInput from "./AppTextInput";

function AppSearchBar({
    searchHandler,
    placeholder = "Search item here",
    backgroundColor = colors.white,
}) {
    const [input, setInput] = useState("");

    const onChangeText = (text) => {
        setInput(text);
    };

    useEffect(() => {
        searchHandler(input);
    }, [input]);

    return (
        <AppTextInput
            placeholder={placeholder}
            icon="magnify"
            backgroundColor={backgroundColor}
            value={input}
            onChangeText={onChangeText}
        />
    );
}

export default AppSearchBar;
