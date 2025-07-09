import React, { useMemo, useState, useEffect } from "react";
import "./storybookReset.scss";
import { GeneUIProvider } from "components";
import { componentStage } from "../stories/assets/storybook.globals";
import { addons } from "@storybook/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";

const ComponentStageMessage = ({ stage, currentVersion }) => (
    <>
        This component is <b>{stage}</b>, to learn more about the <b>{stage}</b> stage{" "}
        <a href={`${currentVersion}/?path=/docs/introduction--docs#component-stages`}>read here</a>.
    </>
);

const currentVersionRegex = /v\d\.\d\.\d/;
const channel = addons.getChannel();

const paddingBlacklist = {
    "organisms-globalheader": true,
    "molecules-navigation": true,
    "molecules-products": true,
    "molecules-profile": true
};

const CustomDecorator = ({ children }) => {
    const [allowRenderChildren, setAllowRenderChildren] = useState(false);
    const [isDark, setDark] = useState(false);
    const html = document.querySelector("html");
    const url = new URL(document.location.href);
    const [themeParam, setThemeParam] = useState(url.searchParams.get("theme"));

    useEffect(() => {
        const currentThem = JSON.parse(localStorage.getItem("sb-addon-themes-3"));
        channel.on(DARK_MODE_EVENT_NAME, setDark);

        if (currentThem) setDark(themeParam ? themeParam === "dark" : currentThem.current === "dark");

        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
    }, [channel]);

    useEffect(() => {
        if (!themeParam) {
            html.style.colorScheme = isDark ? "dark" : "light";
        } else {
            html.style.colorScheme = themeParam;
            if ((themeParam === "light" && isDark) || (themeParam === "dark" && !isDark)) {
                setThemeParam(null);
            }
        }
    }, [isDark, themeParam]);

    let type;
    const componentStageGetter = (children, num) => {
        return (
            Array.isArray(children?.props?.children) &&
            children?.props?.children.length >= num &&
            children?.props?.children[num]?.props?.componentStage
        );
    };

    const componentStageProp =
        children?.props?.componentStage ||
        children?.props?.children?.props?.componentStage ||
        componentStageGetter(children, 1) ||
        componentStageGetter(children, 0);

    const currentVersion = useMemo(
        () =>
            (window.location.href.match(currentVersionRegex) && window.location.href.match(currentVersionRegex)[0]) ||
            "",
        []
    );

    useEffect(() => {
        setAllowRenderChildren(true);
    }, []);

    switch (componentStageProp?.type) {
        case componentStage.deprecated:
            type = "error";
            break;
        case componentStage.experimental:
            type = "info";
            break;
        default:
            type = "message";
    }

    const alertMessage = componentStageProp?.message ? (
        componentStageProp?.message
    ) : (
        <ComponentStageMessage currentVersion={currentVersion} stage={componentStageProp?.type} />
    );

    const paddingForWrapper = paddingBlacklist[children._owner?.pendingProps?.componentId]
        ? {}
        : { padding: "8px 16px" };
    console.log(paddingBlacklist, "paddingBlacklist");
    console.log(children, "children");
    console.log(children._owner, "children._owner");
    console.log(children._owner?.pendingProps, "children._owner?.pendingProps");
    console.log(children._owner?.pendingProps?.componentId, "children._owner?.pendingProps?.componentId");
    return (
        <GeneUIProvider theme={isDark ? "dark" : "light"}>
            {componentStageProp && (
                <div data-stage-alert style={{ padding: "16px 16px 0" }}>
                    {/*<Alert*/}
                    {/*    title={componentStageProp?.type.replace(/^\w/, (c) => c.toUpperCase())}*/}
                    {/*    message={alertMessage}*/}
                    {/*    style={{ marginBottom: "10px" }}*/}
                    {/*    type={type}*/}
                    {/*/>*/}
                </div>
            )}
            <div style={{ position: "relative", height: "100%", ...paddingForWrapper }}>
                <div>{allowRenderChildren && children}</div>
            </div>
        </GeneUIProvider>
    );
};

export default (story) => <CustomDecorator>{story()}</CustomDecorator>;
