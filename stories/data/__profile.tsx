import { Globe } from "@geneui/icons";

import { IProfileProps } from "@components/molecules/Profile";

export const profileData: IProfileProps["profileData"] = [
    {
        title: "My Account",
        id: "myAccount",
        IconAfter: Globe
    },
    {
        title: "Language",
        id: "language",
        divider: true,
        children: [
            {
                id: "EN",
                title: "english",
                selected: true
            },
            {
                id: "FR",
                title: "french"
            },
            {
                id: "DE",
                title: "deutsch"
            }
        ]
    },
    {
        title: "Wallet",
        id: "wallet",
        children: [
            {
                id: "wa",
                title: "wallet a",
                selected: true
            },
            {
                id: "wb",
                title: "wallet b"
            },
            {
                id: "wc",
                title: "wallet c"
            }
        ]
    },
    {
        title: "Reporting Currency",
        id: "reportingCurrency",
        children: [
            {
                id: "USD",
                title: "USD",
                selected: true
            },
            {
                id: "AED",
                title: "AED"
            },
            {
                id: "EUR",
                title: "EUR"
            }
        ]
    },
    {
        title: "Currency Converter",
        id: "currencyConverter"
    },
    {
        title: "Activity",
        id: "activity",
        divider: true,
        children: [
            {
                id: "Activity 1",
                title: "activity1",
                selected: true
            },
            {
                id: "Activity 2",
                title: "activity2"
            },
            {
                id: "Activity 3",
                title: "activity3"
            }
        ]
    },
    {
        title: "Add User",
        id: "addUser"
    },
    {
        title: "Withdrawal",
        id: "withdrawal",
        divider: true
    },
    {
        title: "Log Out",
        id: "logOut",
        danger: true
    }
];
