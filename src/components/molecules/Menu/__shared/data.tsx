import React from "react";

import { Globe, LightBulb } from "@geneui/icons";

import Checkbox from "../../Checkbox";

export const data = [
    { title: "item 1", selected: false, id: "1233", value: "name1", IconBefore: Globe, danger: true, divider: true },
    { title: "item 2", selected: false, id: "123fd343", value: "name3", IconAfter: LightBulb, danger: true },
    {
        title: "item 2ii",
        id: "123dsfd343",
        value: "name3",
        danger: true,
        ComponentRender: () => {
            return (
                <span>
                    <Checkbox label="test" name="test" value="test" />
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
            { title: "item 44sghdf", selected: false, id: "1d23s3", value: "namye55", disabled: true },
            { title: "item 44aghsf", selected: false, id: "dfds", value: "namey55" },
            { title: "item 44aghsf", selected: false, id: "ddfgf", value: "natme55" },
            { title: "item 4fv4eraf", selected: false, id: "wef", value: "namree55" },
            { title: "item 4fr4sdf", selected: false, id: "1d2sdd3s3", value: "sdf", disabled: true },
            { title: "item ggf44rasf", selected: false, id: "dfffds", value: "sdf" },
            { title: "item 4vb4asf", selected: false, id: "ddggddfgf", value: "namsdfe55" },
            { title: "item 44tytyaf", selected: false, id: "wsdasdef", value: "sdsdf" },
            {
                title: "item 555111",
                selected: false,
                id: "12as3343",
                value: "name355",
                // defaultOpened: true,
                isLoading: true,
                loadingText: "loading text",
                children: [
                    { title: "item 44", selected: false, id: "1s23s3", value: "name55" },
                    { title: "item 5553333", selected: false, id: "12as33f43", value: "name355" },
                    {
                        title: "item 35555",
                        selected: false,
                        id: "123sdsd6343",
                        value: "name4ff",
                        children: [
                            { title: "item 44", selected: false, id: "123s3", value: "name55" },
                            { title: "item 555888", selected: true, id: "1d2as3343", value: "name355" }
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
                    { title: "item 44sghdsdff", selected: false, id: "1d2xcv3s3", value: "ff", disabled: true },
                    { title: "item 44aghdfgsf", selected: false, id: "dfdegrds", value: "namefvy55" },
                    { title: "item 44agfhghsf", selected: false, id: "ddhhytfgf", value: "ffg" },
                    { title: "item 4fv4efghraf", selected: false, id: "wehhf", value: "fgfdg" },
                    { title: "item 4fr4fghsdf", selected: false, id: "1d2tsdd3s3", value: "ffg", disabled: true },
                    { title: "item ggf4tr4rasf", selected: false, id: "dfffsdcds", value: "fgfdg" },
                    { title: "item 4vbrt4asf", selected: false, id: "ddggdsdcdfgf", value: "ffdf" },
                    { title: "item 44ttytyaf", selected: false, id: "wsdcsdef", value: "erer" },
                    {
                        title: "item ewerwed",
                        selected: false,
                        id: "wedewwe",
                        value: "wedwed",
                        // defaultOpened: true,
                        isLoading: true,
                        loadingText: "loading text",
                        children: [
                            { title: "item wedwd", selected: false, id: "gth", value: "tyhrth" },
                            { title: "item scassa", selected: false, id: "yhrtg", value: "ergewrg" },
                            {
                                title: "item rtgrgr",
                                selected: false,
                                id: "rtgrwes",
                                value: "sdferf",
                                children: [
                                    { title: "item ergrgg", selected: false, id: "rrrth", value: "ergerg" },
                                    { title: "item reg4e44", selected: true, id: "regergsd", value: "ergerg" }
                                ]
                            }
                        ]
                    },
                    {
                        title: "erferf",
                        selected: false,
                        id: "erferf",
                        value: "efef",
                        children: [
                            { title: "erferg", selected: false, id: "erfergerg45", value: "45t4g" },
                            { title: "456455645", selected: true, id: "456455f4f", value: "45g4g" }
                        ]
                    },
                    { title: "erfr ewf", selected: false, id: "werfec", value: "ewrtwe", disabled: true },
                    { title: "erfergerg werf", selected: false, id: "ecerc", value: "ewrtewrt" },
                    { title: "erfef deccdecd", selected: false, id: "ercferc", value: "ergerg" },
                    { title: "erferf sdc", selected: false, id: "ecece", value: "erfgert" },
                    { title: "ergrtt sx", selected: false, id: "ecec", value: "ertret", disabled: true },
                    { title: "ergerg asd", selected: false, id: "ececr", value: "wergrth" },
                    { title: "rgeg dsc", selected: false, id: "ecerfre", value: "ergretg" },
                    { title: "ergeerr efc", selected: false, id: "ecec", value: "erferf" }
                ]
            },
            { title: "item 345", selected: false, id: "1d2345s3", value: "namree55", disabled: true },
            { title: "item 543", selected: false, id: "df55ds", value: "nareme55" },
            { title: "item 456", selected: false, id: "ddf555gf", value: "nreame55" },
            { title: "item 45646", selected: false, id: "w34ref", value: "namere55" },
            { title: "item 35556667655", selected: false, id: "435", value: "sdrtef", disabled: true },
            { title: "item 5464565", selected: false, id: "dff3ffds", value: "sderf" },
            { title: "item 36344434", selected: false, id: "ddrefggddfgf", value: "namsdfe55" },
            { title: "item 34545354", selected: false, id: "w4545sdasdef", value: "sdsdf" }
        ]
    }
];
