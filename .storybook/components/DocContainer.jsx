import React, { useMemo } from "react";
import { DocsContainer as BaseContainer } from "@storybook/blocks";
import { useDarkMode } from "storybook-dark-mode";
import { themes } from "@storybook/theming";

export const DocsContainer = ({ children, context }) => {
    let contextTitle = context?.primaryStory?.title;

    const title = useMemo(() => {
        if (contextTitle) {
            return contextTitle[contextTitle.length - 2] === "-"
                ? contextTitle.replace(contextTitle.slice(-2), "")
                : contextTitle;
        }
    }, [contextTitle]);

    if (contextTitle) context.primaryStory.title = title;
    return (
        <BaseContainer context={context} theme={useDarkMode() ? themes.dark : themes.normal}>
            {children}
        </BaseContainer>
    );
};
