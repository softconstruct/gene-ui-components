import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { HamburgerMenu } from "@geneui/icons";

import Button from "@components/atoms/Button";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { navigationCreateData, navigationData } from "../../../../stories/data/__navigation";
// Components
import Navigation, { INavigationProps } from "./index";

const meta: Meta<INavigationProps> = {
    title: "Molecules/Navigation",
    component: Navigation,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        open: args({ control: "boolean", ...propCategory.states }),
        onOpenChange: args({ control: "false", ...propCategory.action }),
        navigationData: args({ control: "false", ...propCategory.content }),
        navigationCreateData: args({ control: "false", ...propCategory.content }),
        activePath: args({ control: "false", ...propCategory.states }),
        onClick: args({ control: "false", ...propCategory.action }),
        onNavigationCreateDataClick: args({ control: "false", ...propCategory.action }),
        moreMenuTitle: args({ control: "text", ...propCategory.content }),
        render: args({ control: "false", ...propCategory.content }),
        compact: args({ control: "boolean", ...propCategory.appearance })
    }
};

export default meta;

const NavigationStoryComponent = (props: INavigationProps) => {
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [activePath, setActivePath] = useState<string | null>("/performance");

    const onClickHandler = (path: string) => {
        setActivePath(path);
    };

    const onOpenChangeHandler = (isOpen: boolean) => {
        setIsNavigationOpen(isOpen);
    };

    return (
        <div style={{ height: "90vh" }}>
            <div style={{ position: "fixed", top: 8, right: 8 }}>
                <Button onClick={() => setIsNavigationOpen((prev) => !prev)} Icon={HamburgerMenu} />
            </div>
            <Navigation
                {...props}
                open={isNavigationOpen}
                onOpenChange={onOpenChangeHandler}
                navigationData={navigationData}
                activePath={activePath}
                onClick={onClickHandler}
                navigationCreateData={navigationCreateData}
            />
        </div>
    );
};

type Story = StoryObj<INavigationProps>;

export const Default: Story = {
    render: (props) => <NavigationStoryComponent {...props} />
};

export const WithRender: Story = {
    render: (props) => <NavigationStoryComponent {...props} />,
    args: {
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render: (linkData) => <a aria-label={linkData.title} href={linkData.path ? "javascript:void(0)" : undefined} />
    }
};
