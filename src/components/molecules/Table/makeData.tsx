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
        graph: {
            type: "graph",
            data: faker.image.image(148, 28)
        },
        text: {
            type: "text",
            data: faker.helpers.shuffle<Row["rowStatus"]>(["default", "zebra", "red", "green", "highlighted"])[0]!
        },
        number: {
            type: "number",
            data: `${faker.datatype.number({ min: 1000 })}`
        },
        longText: {
            type: "longText",
            data: faker.lorem.text()
        },
        dropdown: {
            type: "dropdown",
            data: faker.helpers.shuffle<Row["rowStatus"]>(["default", "zebra", "red", "green", "highlighted"])[0]!
        },
        status: {
            type: "status",
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
        pill: {
            type: "pill",
            data: {}
        },
        icon: {
            type: "icon",
            data: Globe
        },
        flag: {
            type: "flag",
            data: Globe
        },
        checkbox: {
            type: "checkbox",
            data: {
                value: faker.helpers.shuffle(["default", "zebra"])[0]!,
                checked: faker.helpers.shuffle<boolean>([true, false])[0]!
            } as ICheckboxProps
        },
        switch: {
            type: "switch",
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
