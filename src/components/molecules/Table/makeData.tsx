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
        Graph: faker.image.image(148, 28),
        Title: faker.helpers.shuffle<Row["rowStatus"]>(["default", "zebra", "red", "green", "highlighted"])[0]!,
        Number: `${faker.datatype.number({ min: 1000 })}`,
        Description: faker.lorem.text(),
        Dropdown: {
            value: faker.helpers.shuffle<string>(["Value 1", "Value 2", "Value 3"])[0]!,
            options: ["Value 1", "Value 2", "Value 3"]
        } as any,
        Status: {
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
            ])[0]!
        },
        Pill: {
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
            ])[0]!
        },
        Icon: Globe,
        Flag: Globe,
        Checkbox: {
            value: faker.word.adjective(),
            checked: faker.helpers.shuffle<boolean>([true, false])[0]!
        } as ICheckboxProps,
        Switch: (() => {
            const checked = faker.helpers.shuffle<boolean>([true, false])[0]!;
            return {
                value: checked ? "On" : "Off",
                checked
            } as ISwitchProps;
        })(),
        isPinned: false,
        isSelected: faker.helpers.shuffle<boolean>([false, true])[0]!,
        rowStatus: faker.helpers.shuffle<Row["rowStatus"]>(["default", "zebra", "red", "green", "highlighted"])[0]!,
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
