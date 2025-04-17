import React, { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Helpers
import { args, propCategory, storyObjBuilder } from "../../../../stories/assets/storybook.globals";
// Components
import DataCardList, { IDataCardListProps } from "./index";

const totalCount = 100;

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

    const data: IDataCardListProps["data"] = useMemo(
        () =>
            Array.from(Array(dataCount).keys()).map((index) =>
                Array.from(Array(8).keys()).map((rowIndex) => ({
                    key: `Card ${index} Row ${rowIndex}`,
                    value: { text: "Description", type: "text" }
                }))
            ),
        [dataCount]
    );
    return <TemplateHOC {...props} data={data} dataCount={dataCount} setDataCount={setDataCount} />;
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

    const data: IDataCardListProps["data"] = useMemo(
        () =>
            Array.from(Array(dataCount).keys()).map((index) =>
                Array.from(Array(8).keys()).map((rowIndex) => ({
                    infoText: "Info text",
                    key: `Card ${index} Row ${rowIndex}`,
                    value: { text: "Pill", type: "pill", isFill: true }
                }))
            ),
        [dataCount]
    );
    return <TemplateHOC {...props} data={data} dataCount={dataCount} setDataCount={setDataCount} />;
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

    const data: IDataCardListProps["data"] = useMemo(
        () =>
            Array.from(Array(dataCount).keys()).map((index) =>
                Array.from(Array(8).keys()).map((rowIndex) => ({
                    key: `Card ${index} Row ${rowIndex}`,
                    value: { text: "Text Link", type: "textLink", href: "#" }
                }))
            ),
        [dataCount]
    );
    return <TemplateHOC {...props} data={data} dataCount={dataCount} setDataCount={setDataCount} />;
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
