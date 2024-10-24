import React from "react";
import { addons } from "@storybook/addons";
import { themes } from "@storybook/theming";
import SidebarLabelWrapper from "./components/SidebarLabelWrapper/SidebarLabelWrapper";

addons.setConfig({
    isFullscreen: false,
    showNav: true,
    showPanel: "right",
    panelPosition: "right",
    enableShortcuts: true,
    showToolbar: true,
    theme: themes.dark,
    selectedPanel: undefined,
    initialActive: "sidebar",
    sidebar: {
        showRoots: true,
        collapsedRoots: ["other"],
        renderLabel: (item) => {
            return <SidebarLabelWrapper item={item} />;
        },
        filters: {
            patterns: (item) => {
                if (!item.title.startsWith("Chromatic")) {
                    return item;
                }
            }
        }
    },
    toolbar: {
        title: { hidden: false },
        zoom: { hidden: false },
        eject: { hidden: false },
        copy: { hidden: false },
        fullscreen: { hidden: false }
    },
    previewTabs: {
        canvas: "Playground"
    }
});
