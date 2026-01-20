import React from "react";
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
        className: args({ control: "false", ...propCategory.appearance }),
        breadCrumbsData: args({ control: "false", ...propCategory.content }),
        iconOnly: args({ control: "boolean", ...propCategory.appearance }),
        render: args({ control: "false", ...propCategory.content }),
        onClick: args({ control: "false", ...propCategory.action })
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
        iconOnly: true,
        breadCrumbsData: [
            { title: "Home", path: "javascript:void(0)", Icon: Document },
            {
                title: "Products",
                path: "javascript:void(0)",
                Icon: Receipt
            },
            { title: "Current", path: "javascript:void(0)", Icon: ArrowBounceUp }
        ]
    }
};

export const WithRender: Story = {
    args: {
        breadCrumbsData: [
            { title: "Home", path: "javascript:void(0)" },
            {
                title: "Products",
                path: "javascript:void(0)",
                Icon: Receipt
            },
            { title: "Current Page 1", path: "javascript:void(0)" },
            { title: "Current Page 2", path: "javascript:void(0)" },
            { title: "Current Page 3", path: "javascript:void(0)", Icon: Receipt },
            { title: "Current Page 4", path: "javascript:void(0)" },
            { title: "Current Page 5", path: "javascript:void(0)" }
        ],
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render: (linkData) => <a aria-label={linkData.title} href={linkData.path} />
    },
    render: (props) => <Breadcrumb {...props} />
};
