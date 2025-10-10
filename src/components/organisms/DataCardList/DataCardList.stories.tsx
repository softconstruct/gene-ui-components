import React, { FC, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import { extendedActions } from "../../../../stories/data/__dataCard";
// Static data
import {
    longUniqueData,
    pureVirtualizationData,
    shortUniqueData,
    uniqueActionsData
} from "../../../../stories/data/__dataCardList";
// Components
import DataCardList, { IDataCardListProps } from "./index";

const meta: Meta = {
    title: "Organisms/DataCardList",
    component: DataCardList
};

type Story = StoryObj<IDataCardListProps>;

const argTypes = {
    className: args({ control: "false", ...propCategory.appearance }),
    data: args({ control: "false", ...propCategory.content }),
    hasNextPage: args({ control: "false", ...propCategory.others }),
    isNextPageLoading: args({ control: "false", ...propCategory.others }),
    loadNextPage: args({ control: "false", ...propCategory.action })
};

const LongUniqueDataComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(10);
    const [data, setData] = useState(longUniqueData.slice(0, 10));
    const [isLoading, setIsLoading] = useState(false);

    const loadNextPage = async () => {
        setIsLoading(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                const newCount = dataCount + 10;
                setDataCount(newCount);
                setData(longUniqueData.slice(0, newCount));
                setIsLoading(false);
                resolve(true);
            }, 2000);
        });
    };

    return (
        <DataCardList
            {...props}
            data={data}
            loadNextPage={loadNextPage}
            hasNextPage={dataCount < longUniqueData.length}
            isNextPageLoading={isLoading}
            actions={extendedActions}
        />
    );
};

export const Default: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: {},
    render: (props) => <LongUniqueDataComponent {...props} />
});

const ShortUniqueDataComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(10);
    const [data, setData] = useState(shortUniqueData.slice(0, 10));
    const [isLoading, setIsLoading] = useState(false);

    const loadNextPage = async () => {
        setIsLoading(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                const newCount = dataCount + 10;
                setDataCount(newCount);
                setData(shortUniqueData.slice(0, newCount));
                setIsLoading(false);
                resolve(true);
            }, 2000);
        });
    };

    return (
        <DataCardList
            {...props}
            data={data}
            loadNextPage={loadNextPage}
            hasNextPage={dataCount < shortUniqueData.length}
            isNextPageLoading={isLoading}
        />
    );
};

export const ShortData: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: {},
    render: (props) => <ShortUniqueDataComponent {...props} />
});

const UniqueActionsComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(10);
    const [data, setData] = useState(uniqueActionsData.slice(0, 10));
    const [isLoading, setIsLoading] = useState(false);

    const loadNextPage = async () => {
        setIsLoading(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                const newCount = dataCount + 10;
                setDataCount(newCount);
                setData(uniqueActionsData.slice(0, newCount));
                setIsLoading(false);
                resolve(true);
            }, 2000);
        });
    };

    return (
        <DataCardList
            {...props}
            data={data}
            loadNextPage={loadNextPage}
            hasNextPage={dataCount < uniqueActionsData.length}
            isNextPageLoading={isLoading}
        />
    );
};

export const UniqueActions: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    render: (props) => <UniqueActionsComponent {...props} />
});

const PureVirtualizationComponent: FC = (props) => {
    return (
        <DataCardList
            {...props}
            data={pureVirtualizationData}
            // No loadNextPage, hasNextPage, or isNextPageLoading - pure virtualization only
        />
    );
};

export const PureVirtualization: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: {},
    render: (props) => <PureVirtualizationComponent {...props} />
});

export default meta;
