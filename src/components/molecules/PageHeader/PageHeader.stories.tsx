import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Download, Globe, Heart, Magnifier } from "@geneui/icons";

// Components
import Button from "@components/atoms/Button";
import Breadcrumb from "@components/molecules/Breadcrumb";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import PageHeader, { IPageHeaderProps } from "./index";

const meta: Meta<IPageHeaderProps> = {
    title: "Molecules/PageHeader",
    component: PageHeader,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        breadcrumb: args({ control: "false", ...propCategory.content }),
        children: args({ control: "false", ...propCategory.content }),
        fixed: args({ control: "boolean", ...propCategory.appearance })
    },
    args: {
        fixed: false
    }
};

type Story = StoryObj<IPageHeaderProps>;

const breadcrumbElement = (
    <Breadcrumb
        items={[
            { title: "Home", path: "javascript:void(0)" },
            { title: "Design System", path: "javascript:void(0)" },
            { title: "UI Library", path: "javascript:void(0)" },
            { title: "Components", path: "javascript:void(0)" },
            { title: "Molecules", path: "javascript:void(0)" },
            { title: "Navigation Patterns", path: "javascript:void(0)" },
            { title: "Page Header", path: "javascript:void(0)" }
        ]}
    />
);

const iconActionsElement = (
    <>
        <Button layout="text" Icon={Magnifier} aria-label="Search" />
        <Button layout="text" Icon={Globe} aria-label="Language" />
        <Button layout="text" Icon={Heart} aria-label="Favorites" />
        <Button layout="text" Icon={Download} aria-label="Download" />
    </>
);

export default meta;

export const Default: Story = {
    args: {
        breadcrumb: breadcrumbElement,
        children: iconActionsElement
    }
};

export const WithBreadcrumb: Story = {
    args: {
        breadcrumb: breadcrumbElement
    }
};

export const WithContent: Story = {
    args: {
        children: iconActionsElement
    }
};

export const Fixed: Story = {
    args: {
        breadcrumb: breadcrumbElement,
        children: iconActionsElement,
        fixed: true
    }
};
