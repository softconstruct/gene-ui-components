import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";

import { Globe } from "@geneui/icons";

import { IPillProps } from "@components/atoms/Pill";
import { ICheckboxProps } from "@components/molecules/Checkbox";
import { ISwitchProps } from "@components/molecules/Switch";
import { Row } from "@components/molecules/Table/type";

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newRow = (): Row => {
    return {
        id: faker.datatype.uuid(),
        Graph: {
            type: "Graph",
            data: faker.image.image(148, 28)
        },
        Text: {
            type: "Text",
            data: faker.helpers.shuffle<Row["rowStatus"]>(["default", "zebra", "red", "green", "highlighted"])[0]!
        },
        Number: {
            type: "Number",
            data: `${faker.datatype.number({ min: 1000 })}`
        },
        LongText: {
            type: "LongText",
            data: faker.lorem.text()
        },
        Dropdown: {
            type: "Dropdown",
            data: faker.helpers.shuffle<Row["rowStatus"]>(["default", "zebra", "red", "green", "highlighted"])[0]!
        },
        Status: {
            type: "Status",
            data: {
                text: faker.word.adjective(),
                appearance: faker.helpers.shuffle<IPillProps["appearance"]>([
                    "warning",
                    "error",
                    "inverse",
                    "informative",
                    "neutral",
                    "success",
                    "purple",
                    "lagoon",
                    "magenta",
                    "slate"
                ])[0]
            } as IPillProps
        },
        Pill: {
            type: "Pill",
            data: {}
        },
        Icon: {
            type: "Icon",
            data: Globe
        },
        Flag: {
            type: "Flag",
            data: Globe
        },
        Checkbox: {
            type: "Checkbox",
            data: {
                value: faker.word.adjective(),
                checked: faker.helpers.shuffle<boolean>([true, false])[0]!
            } as ICheckboxProps
        },
        Switch: {
            type: "Switch",
            data: {
                value: faker.word.adjective(),
                checked: faker.helpers.shuffle<boolean>([true, false])[0]!
            } as ISwitchProps
        },
        isPinned: faker.helpers.shuffle<boolean>([false, true])[0]!,
        rowStatus: faker.helpers.shuffle<Row["rowStatus"]>([
            "default",
            "zebra",
            "red",
            "green",
            "highlighted"
        ])[0]! as Row["rowStatus"],
        expandedData: () => <h1>Swap data</h1>
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
