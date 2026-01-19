import { Meta, StoryObj } from "@storybook/react";

import { ArrowBounceUp, Document, Receipt } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Breadcrumb, { IBreadcrumbProps } from "./index";

const meta: Meta<IBreadcrumbProps> = {
    title: "Molecules/Breadcrumb",
    component: Breadcrumb,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Breadcrumb component argTypes
    },
    args: {
        // fill Breadcrumb component args
    }
};

export default meta;

type Story = StoryObj<IBreadcrumbProps>;

export const Default: Story = {
    args: {
        breadCrumbsData: [
            { title: "Nav Item 1", path: "javascript:void(0)" },
            {
                title: "Nav Item 2",
                path: "javascript:void(0)",
                Icon: Receipt
            },
            { title: "Nav Item 3", path: "javascript:void(0)" }
        ]
    }
};

export const IconOnly: Story = {
    args: {
        breadCrumbsData: [
            { path: "javascript:void(0)", Icon: Document },
            {
                path: "javascript:void(0)",
                Icon: Receipt
            },
            { path: "javascript:void(0)", Icon: ArrowBounceUp }
        ]
    }
};
