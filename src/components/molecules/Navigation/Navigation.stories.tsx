import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { HamburgerMenu } from "@geneui/icons";

import Button from "@components/atoms/Button";

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
    // const [isNavigationOpen, setIsNavigationOpen] = useState(false);

    return (
        <div style={{ height: "97vh" }}>
            <div style={{ position: "fixed", top: 8, right: 8 }}>
                <Button onClick={() => {}} Icon={HamburgerMenu} />
            </div>
            <Navigation {...props} />
        </div>
    );
};
type Story = StoryObj<INavigationProps>;

export const Default: Story = {
    render: (props) => <NavigationStoryComponent {...props} />
};
