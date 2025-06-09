import React, { FC, ReactNode } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";

import { Globe, IconProps } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";

type Cell = {
    type:
        | "graph"
        | "text"
        | "number"
        | "longText"
        | "dropdown"
        | "status"
        | "pill"
        | "icon"
        | "flag"
        | "checkbox"
        | "switch";
    data: string | number | boolean | IPillProps | FC<IconProps>;
    withCheckbox?: boolean;
    rowCellRenderer: (Element: ReactNode) => ReactNode;
};

export type Row = {
    [key: string]: Cell;
    rowStatus: "default" | "zebra" | "red" | "green" | "highlighted";
    expandedData: () => ReactNode | null;
};

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newRow = (): Row => {
    return {
        graph: {
            withCheckbox: true,
            type: "graph",
            data: faker.image.image(148, 28),
            rowCellRenderer: (element) => element
        },
        text: {
            withCheckbox: true,
            type: "text",
            data: faker.word.adjective(),
            rowCellRenderer: (element) => element
        },
        number: {
            withCheckbox: true,
            type: "number",
            data: faker.datatype.number({ min: 1000 }),
            rowCellRenderer: (element) => element
        },
        longText: {
            withCheckbox: true,
            type: "longText",
            data: faker.lorem.text(),
            rowCellRenderer: (element) => element
        },
        dropdown: {
            withCheckbox: true,
            type: "dropdown",
            data: faker.word.adjective(),
            rowCellRenderer: (element) => element
        },
        status: {
            withCheckbox: true,
            type: "status",
            data: faker.word.adjective(),
            rowCellRenderer: (element) => element
        },
        pill: { withCheckbox: true, type: "pill", data: {}, rowCellRenderer: (element) => element },
        icon: { withCheckbox: true, type: "icon", data: Globe, rowCellRenderer: (element) => element },
        flag: { withCheckbox: true, type: "flag", data: Globe, rowCellRenderer: (element) => element },
        checkbox: {
            withCheckbox: true,
            type: "checkbox",
            data: "value",
            rowCellRenderer: (element) => element
        },
        switch: {
            withCheckbox: true,
            type: "switch",
            data: true,
            rowCellRenderer: (element) => element
        },
        rowStatus: faker.helpers.shuffle<Row["rowStatus"]>([
            "default",
            "zebra",
            "red",
            "green",
            "highlighted"
        ])[0]! as Row["rowStatus"],
        expandedData: () => <h1>{faker.lorem.text()}</h1>
    };
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Row[] => {
        const len = lens[depth]!;
        return range(len).map((_, index): Row => {
            return {
                ...newRow(),
                expandedData: index % 2 === 0 && newRow().expandedData
            } as Row;
        });
    };

    return makeDataLevel();
}
