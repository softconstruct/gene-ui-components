import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
import { extendedActions } from "../../../../stories/data/__dataCard";
// Static data
import {
    defaultData,
    minimalTwoRowData,
    pillData,
    randomRichData,
    textLinkData,
    totalCount
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
    size: args({ control: "select", ...propCategory.appearance, options: ["medium", "large"] }),
    data: args({ control: "false", ...propCategory.content }),
    hasNextPage: args({ control: "false", ...propCategory.others }),
    isNextPageLoading: args({ control: "false", ...propCategory.others }),
    loadNextPage: args({ control: "false", ...propCategory.action })
};

const DefaultDataCardListComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(10);
    return (
        <TemplateHOC
            {...props}
            data={defaultData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
        />
    );
};

const DefaultDataCardListStory: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: {
        size: "medium"
    },
    render: (props) => <DefaultDataCardListComponent {...props} />
});

const DataCardListWithPillValueComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(10);
    return (
        <TemplateHOC {...props} data={pillData.slice(0, dataCount)} dataCount={dataCount} setDataCount={setDataCount} />
    );
};

const DataCardListWithPillValueStory: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: {
        size: "medium"
    },
    render: (props) => <DataCardListWithPillValueComponent {...props} />
});

const DataCardListWithTextLinkComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(10);
    return (
        <TemplateHOC
            {...props}
            data={textLinkData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
        />
    );
};

const DataCardListWithTextLinkStory: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: {
        size: "medium"
    },
    render: (props) => <DataCardListWithTextLinkComponent {...props} />
});

export default meta;
export {
    DefaultDataCardListStory as Default,
    DataCardListWithPillValueStory as WithPillValue,
    DataCardListWithTextLinkStory as WithTextLink
};

// New stories
const WithActionsAndShowMoreComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(20);
    return (
        <TemplateHOC
            {...props}
            data={randomRichData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
            actions={extendedActions}
            showMoreText="Show more"
            actionsText="Actions"
        />
    );
};

const WithActionsAndShowMoreStory: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: { size: "medium" },
    render: (props) => <WithActionsAndShowMoreComponent {...props} />
});

const WithoutActionsNoShowMoreComponent: FC = (props) => {
    const [dataCount, setDataCount] = useState(20);
    return (
        <TemplateHOC
            {...props}
            data={minimalTwoRowData.slice(0, dataCount)}
            dataCount={dataCount}
            setDataCount={setDataCount}
        />
    );
};

const WithoutActionsNoShowMoreStory: Story = storyObjBuilder({
    argTypes: { ...argTypes },
    args: { size: "medium" },
    render: (props) => <WithoutActionsNoShowMoreComponent {...props} />
});

export {
    WithActionsAndShowMoreStory as WithActionsAndShowMore,
    WithoutActionsNoShowMoreStory as WithoutActionsNoShowMore
};
