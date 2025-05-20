import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";

export type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: "relationship" | "complicated" | "single";
    subRows?: React.ReactNode;
};

const range = (len: number) => {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(i);
    }
    return arr;
};

const newPerson = (): Person => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: +faker.random.numeric(),
        visits: +faker.random.numeric(),
        progress: +faker.random.numeric(),
        status: faker.helpers.shuffle<Person["status"]>(["relationship", "complicated", "single"])[0]!
    };
};

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!;
        return range(len).map((_, i): Person => {
            return {
                ...newPerson(),
                subRows: i !== 2 ? <div>AKM | AR-15 </div> : undefined
            };
        });
    };

    return makeDataLevel();
}
