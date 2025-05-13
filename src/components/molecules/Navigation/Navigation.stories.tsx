import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { HamburgerMenu } from "@geneui/icons";

import Button from "@components/atoms/Button";
import { navigationData } from "@components/molecules/Navigation/data";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Navigation, { INavigationProps } from "./index";

const meta: Meta<INavigationProps> = {
    title: "Molecules/Navigation",
    component: Navigation,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Navigation component argTypes
    },
    args: {
        // fill Navigation component args
    }
};

export default meta;

const NavigationStoryComponent = (props: INavigationProps) => {
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [activePath, setActivePath] = useState<string | null>("/helpCenter6");

    const onClickHandler = (path: string) => {
        setActivePath(path);
    };

    return (
        <div style={{ height: "90vh" }}>
            <div style={{ position: "fixed", top: 8, right: 8 }}>
                <Button onClick={() => setIsNavigationOpen((prev) => !prev)} Icon={HamburgerMenu} />
            </div>
            <Navigation
                open={isNavigationOpen}
                navigationData={navigationData}
                {...props}
                activePath={activePath}
                onClick={onClickHandler}
            />
        </div>
    );
};

type Story = StoryObj<INavigationProps>;

export const Default: Story = {
    render: (props) => <NavigationStoryComponent {...props} />
};
