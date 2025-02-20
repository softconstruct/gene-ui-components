import React from "react";

import { Globe, LightBulb } from "@geneui/icons";

import Checkbox from "../../Checkbox";

export const data = [
    { title: "item 1", selected: false, id: "1233", value: "name1", IconBefore: Globe, danger: true, divider: true },
    { title: "item 2", selected: false, id: "123fd343", value: "name3", IconAfter: LightBulb, danger: true },
    {
        title: "item 2",
        selected: false,
        id: "123dsfd343",
        value: "name3",
        ComponentRender: () => {
            return (
                <span>
                    <Checkbox label="test" />
                </span>
            );
        }
    },
    {
        title: "EMPTY",
        selected: false,
        id: "qwwqwe",
        value: "namesd3",
        IconAfter: LightBulb,
        divider: true,
        children: [],
        emptyText: "empty text"
    },
    {
        title: "item 3",
        selected: false,
        id: "1236343",
        value: "name4",
        IconBefore: Globe,
        children: [
            { title: "item 44", selected: false, id: "1d23s3", value: "name55", disabled: true },
            {
                title: "item 555",
                selected: false,
                id: "12as3343",
                value: "name355",
                // defaultOpened: true,
                isLoading: true,
                loadingText: "loading text",
                children: [
                    { title: "item 44", selected: false, id: "1s23s3", value: "name55" },
                    { title: "item 555", selected: false, id: "12as33f43", value: "name355" },
                    {
                        title: "item 35555",
                        selected: false,
                        id: "123sdsd6343",
                        value: "name4ff",
                        children: [
                            { title: "item 44", selected: false, id: "123s3", value: "name55" },
                            { title: "item 555", selected: true, id: "1d2as3343", value: "name355" }
                        ]
                    }
                ]
            },
            {
                title: "item 35555",
                selected: false,
                id: "123sdsd6343",
                value: "name4ff",
                children: [
                    { title: "item 44", selected: false, id: "1fgf23s3", value: "name55" },
                    { title: "item 555", selected: true, id: "12as334df3", value: "name355" }
                ]
            }
        ]
    }
];
