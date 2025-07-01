import { Copy, CurrencyGlobal, Globe, HamburgerMenu } from "@geneui/icons";

import { IProfileData } from "@components/molecules/Profile";
import { IProducts } from "@components/organisms/GlobalHeader/GlobalHeader";

export const partners = [
    { title: "Partner One", id: 1, selected: false },
    { title: "Partner Two", id: 2, selected: false },
    { title: "Partner Three", id: 3, selected: false },
    { title: "Partner Four", id: 4, selected: false },
    { title: "Partner Five", id: 5, selected: false },
    { title: "Partner Six", id: 6, selected: false },
    { title: "Partner Seven", id: 7, selected: false },
    { title: "Partner Eight", id: 8, selected: false },
    { title: "Partner Nine", id: 9, selected: false },
    { title: "Partner Ten", id: 10, selected: false },
    { title: "Partner Eleven", id: 11, selected: true },
    { title: "Partner Twelve", id: 12, selected: false },
    { title: "Partner Thirteen", id: 13, selected: false },
    { title: "Partner Fourteen", id: 14, selected: false },
    { title: "Partner Fifteen", id: 15, selected: false },
    { title: "Partner Sixteen", id: 16, selected: false },
    { title: "Partner Seventeen", id: 17, selected: false },
    { title: "Partner Eighteen", id: 18, selected: false },
    { title: "Partner Nineteen", id: 19, selected: false },
    { title: "Partner Twenty", id: 20, selected: false },
    { title: "Partner Twenty-One", id: 21, selected: false },
    { title: "Partner Twenty-Two", id: 22, selected: false },
    { title: "Partner Twenty-Three", id: 23, selected: false },
    { title: "Partner Twenty-Four", id: 24, selected: false },
    { title: "Partner Twenty-Five", id: 25, selected: false },
    { title: "Partner Twenty-Six", id: 26, selected: false },
    { title: "Partner Twenty-Seven", id: 27, selected: false },
    { title: "Partner Twenty-Eight", id: 28, selected: false },
    { title: "Partner Twenty-Nine", id: 29, selected: false },
    { title: "Partner Thirty", id: 30, selected: false }
];

export const products: IProducts = {
    mainSectionData: [
        {
            id: 1,
            title: "StarBase",
            withBadge: true,
            Icon: Globe,
            disabled: false
        },
        {
            id: 2,
            title: "Pixel Bank",
            withBadge: true,
            Icon: CurrencyGlobal
        },
        {
            id: 3,
            title: "Sky Link",
            Icon: Copy
        },
        {
            id: 4,
            title: "Polyglot Hub",
            Icon: HamburgerMenu
        }
    ],
    secondarySectionData: [
        {
            id: 5,
            title: "Content Forge",
            Icon: Globe
        },
        {
            id: 6,
            title: "Cloud Haven",
            withBadge: true,
            Icon: CurrencyGlobal
        }
    ]
};

export const languages: IProfileData[] = [
    { title: "English", id: "en", selected: false },
    { title: "Español", id: "es", selected: true },
    { title: "Français", id: "fr", selected: false },
    { title: "Deutsch", id: "de", selected: false },
    { title: "Русский", id: "ru", selected: false },
    { title: "中文", id: "zh", selected: false },
    { title: "العربية", id: "ar", selected: false },
    { title: "Português", id: "pt", selected: false },
    { title: "हिन्दी", id: "hi", selected: false },
    { title: "Հայերեն", id: "hy", selected: false }
];

export const webWallets: IProfileData[] = [
    { title: "MetaMask", id: "metamask", selected: true },
    { title: "Coinbase Wallet", id: "coinbase", selected: false },
    { title: "Trust Wallet", id: "trust", selected: false },
    { title: "Rainbow Wallet", id: "rainbow", selected: false },
    { title: "Binance Web Wallet", id: "binance", selected: false }
];
