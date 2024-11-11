import React, { useMemo, useState, useEffect } from "react";
import "./storybookReset.scss";
import { useDarkMode } from "storybook-dark-mode";
import { GeneUIProvider } from "components";
import { Alert } from "src";
import { componentStage } from "../stories/assets/storybook.globals";

const ComponentStageMessage = ({ stage, currentVersion }) => (
    <>
        This component is <b>{stage}</b>, to learn more about the <b>{stage}</b> stage{" "}
        <a href={`${currentVersion}/?path=/docs/introduction--docs#component-stages`}>read here</a>.
    </>
);

const currentVersionRegex = /v\d\.\d\.\d/;

const CustomDecorator = ({ children }) => {
    const [allowRenderChildren, setAllowRenderChildren] = useState(false);
    const isDarkMode = useDarkMode();
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

    return (
        <>
            <GeneUIProvider>
                {componentStageProp && (
                    <div data-stage-alert style={{ padding: "16px 16px 0" }}>
                        <Alert
                            title={componentStageProp?.type.replace(/^\w/, (c) => c.toUpperCase())}
                            message={alertMessage}
                            style={{ marginBottom: "10px" }}
                            type={type}
                        />
                    </div>
                )}
                <div style={{ position: "relative", height: "100%", padding: "8px 16px" }}>
                    <div>{allowRenderChildren && children}</div>
                </div>
            </GeneUIProvider>
            {isDarkMode ? (
                <style>
                    {`:root {
          --background: #171c26;
          --background-hover: #262f3f;
          --background-sc: #fff;
          --background-rgb: 23,28,38;
          --background-sc-rgb: 255,255,255;
          --page-background: #0b1017;
          color-scheme: dark; // todo remove 'color-scheme' after provide theme function form GeneUIProvider
          
          }`}
                </style>
            ) : (
                ""
            )}
        </>
    );
};

export default (story) => <CustomDecorator>{story()}</CustomDecorator>;
