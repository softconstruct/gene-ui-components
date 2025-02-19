import React, { Dispatch, FC, SetStateAction, useMemo, useState } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import DataCardList, { IDataCardListProps } from "./index";

const totalCount = 100;

const meta: Meta<typeof DataCardList> = {
    title: "Organisms/DataCardList",
    component: DataCardList,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance, options: ["medium", "large"] }),
        data: args({ control: "false", ...propCategory.content }),
        hasNextPage: args({ control: "false", ...propCategory.others }),
        isNextPageLoading: args({ control: "false", ...propCategory.others }),
        loadNextPage: args({ control: "false", ...propCategory.action })
    },
    args: {
        size: "medium"
    } as IDataCardListProps
};

export default meta;

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

export const Default: FC<IDataCardListProps> = (props) => {
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

export const WithPillValue: FC<IDataCardListProps> = (props) => {
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

export const WithTextLink: FC<IDataCardListProps> = (props) => {
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
