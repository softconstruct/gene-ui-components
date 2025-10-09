import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import { extendedActions } from "../../../../stories/data/__dataCard";
// Static data
import {
    longUniqueData,
    shortUniqueData,
    totalCount,
    uniqueActionsData
} from "../../../../stories/data/__dataCardList";
// Components
import DataCardList, { IDataCardListProps } from "./index";

const meta: Meta = {
    title: "Organisms/DataCardList",
    component: DataCardList
};

const TemplateHOC: FC<IDataCardListProps & { dataCount: number; setDataCount: Dispatch<SetStateAction<number>> }> = ({
    data,
    dataCount,
    setDataCount,
    ...rest
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const loadNextPage = async () => {
        setIsLoading(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(false);
                setDataCount((prev) => prev + 10);
            }, 3000);
        });
        setIsLoading(false);
    };

    return (
        <DataCardList
            {...rest}
            data={data}
            loadNextPage={loadNextPage}
            hasNextPage={dataCount < totalCount}
            isNextPageLoading={isLoading}
        />
    );
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
    const [dataCount, setDataCount] = useState(20);
    return (
        <TemplateHOC
            {...props}
            data={longUniqueData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
            actions={extendedActions}
        />
    );
};

export const Default: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: { size: "medium" },
    render: (props) => <LongUniqueDataComponent {...props} />
});

const ShortUniqueDataComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(40);
    return (
        <TemplateHOC
            {...props}
            data={shortUniqueData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
        />
    );
};

export const ShortData: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: { size: "medium" },
    render: (props) => <ShortUniqueDataComponent {...props} />
});

const UniqueActionsComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(20);
    return (
        <TemplateHOC
            {...props}
            data={uniqueActionsData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
        />
    );
};

export const UniqueActions: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: { size: "medium" },
    render: (props) => <UniqueActionsComponent {...props} />
});

export default meta;
