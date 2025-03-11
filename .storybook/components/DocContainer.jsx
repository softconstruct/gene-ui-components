import React, { useEffect, useMemo, useState } from "react";
import { DocsContainer as BaseContainer } from "@storybook/blocks";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";
import { themes } from "@storybook/theming";
import { addons } from "@storybook/preview-api";

const channel = addons.getChannel();

export const DocsContainer = (props) => {
    const [isDark, setDark] = useState(false);

    useEffect(() => {
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        const currentThem = JSON.parse(localStorage.getItem("sb-addon-themes-3"));
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        if (currentThem) {
            setDark(currentThem.current === "dark");
        }
        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
    }, [channel]);

    return (
        <BaseContainer {...props} theme={isDark ? themes.dark : themes.normal}>
            {props.children}
        </BaseContainer>
    );
};
