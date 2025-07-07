import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Box, Messages } from "@geneui/icons";

import Text from "@components/atoms/Text";
import { IMenuItemProps } from "@components/molecules/Menu";
import { IProfileData } from "@components/molecules/Profile";
import {
    activities,
    currencies,
    languages,
    partners,
    products,
    webWallets
} from "@components/organisms/GlobalHeader/__shared/data";
import { IAction, IProducts } from "@components/organisms/GlobalHeader/GlobalHeader";
import { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import GlobalHeader, { IGlobalHeaderProps } from "./index";

const LeftContent = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", columnGap: 10, color: "#fff" }}>
                <Text as="span" variant="captionLargeMedium">
                    1FTN
                </Text>
                <Text as="span" variant="captionLargeMedium">
                    =
                </Text>
                <Text as="span" variant="captionLargeMedium">
                    2.3698
                </Text>
                <Text as="span" variant="captionLargeMedium">
                    USDT
                </Text>
            </div>
            <div className="globalHeader__domain">
                <Text as="span" variant="captionLargeMedium">
                    exchange.fastex.com
                </Text>
            </div>
        </div>
    );
};

const meta: Meta<IGlobalHeaderProps> = {
    title: "Organisms/GlobalHeader",
    component: GlobalHeader,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onNavigationButtonClick: args({ control: "false", ...propCategory.action }),
        onPartnerSelect: args({ control: "false", ...propCategory.action }),
        onProductSelect: args({ control: "false", ...propCategory.action }),
        onProfileItemSelect: args({ control: "false", ...propCategory.action }),
        onLanguageSelect: args({ control: "false", ...propCategory.action }),
        onWalletSelect: args({ control: "false", ...propCategory.action }),
        onCurrencySelect: args({ control: "false", ...propCategory.action }),
        onActivitySelect: args({ control: "false", ...propCategory.action }),
        onCurrencyConvertorSelect: args({ control: "false", ...propCategory.action }),
        onHelpActionSelect: args({ control: "false", ...propCategory.action }),
        partnersLoading: args({ control: "boolean", ...propCategory.states }),
        partnersDisabled: args({ control: "boolean", ...propCategory.states }),
        logoAs: args({ control: "false", ...propCategory.content }),
        leftContent: args({ control: "false", ...propCategory.content }),
        partners: args({ control: "false", ...propCategory.content }),
        partnersLoadingText: args({ control: "text", ...propCategory.content }),
        partnersSearchPlaceholder: args({ control: "text", ...propCategory.content }),
        partnersName: args({ control: "text", ...propCategory.content }),
        partnersIdName: args({ control: "text", ...propCategory.content }),
        products: args({ control: "false", ...propCategory.content }),
        limitLabel: args({ control: "text", ...propCategory.content }),
        limitUnit: args({ control: "text", ...propCategory.content }),
        timeZone: args({ control: "text", ...propCategory.content }),
        timeFormat: args({
            control: "select",
            options: ["24h", "12h"],
            ...propCategory.content
        }),
        timeLabel: args({ control: "text", ...propCategory.content }),
        logOutText: args({ control: "text", ...propCategory.content }),
        myAccountText: args({ control: "text", ...propCategory.content }),
        settingsText: args({ control: "text", ...propCategory.content }),
        languages: args({ control: "false", ...propCategory.content }),
        languageText: args({ control: "text", ...propCategory.content }),
        wallet: args({ control: "false", ...propCategory.content }),
        walletText: args({ control: "text", ...propCategory.content }),
        currency: args({ control: "false", ...propCategory.content }),
        currencyText: args({ control: "text", ...propCategory.content }),
        currencyConvertorText: args({ control: "text", ...propCategory.content }),
        activity: args({ control: "false", ...propCategory.content }),
        activityText: args({ control: "text", ...propCategory.content }),
        actions: args({ control: "false", ...propCategory.content })
    },
    args: {
        logoAs: <a href="/" aria-label="logo" />,
        limitUnit: "1234523",
        timeLabel: "Time",
        currencyConvertorText: "Currency Convertor"
    }
};

const Template = (props) => {
    const [partnerData, setPartnerData] = useState<IPartnerItemData[]>(partners);
    const [productsData, setProductsData] = useState<IProducts>(products);
    const [languagesData, setLanguagesData] = useState<IProfileData[]>(languages);
    const [walletData, setWalletData] = useState<IProfileData[]>(webWallets);
    const [currencyData, setCurrencyData] = useState<IProfileData[]>(currencies);
    const [activityData, setActivityData] = useState<IProfileData[]>(activities);

    const actions: IAction[] = [
        {
            title: "Test Action",
            Icon: Messages,
            onActionSelect: () => {},
            id: "test-action"
        },
        {
            title: "Test Action 2",
            Icon: Box,
            onActionSelect: () => {},
            id: "test-action2"
        }
    ];

    useEffect(() => {
        setPartnerData(partners);
        setProductsData(products);
        setLanguagesData(languages);
        setWalletData(webWallets);
        setCurrencyData(currencies);
        setActivityData(activities);
    }, []);

    const onPartnerSelect = (partner: IPartnerItemData) => {
        setPartnerData((prev) => {
            return prev.map((prevPartner) => {
                return {
                    ...prevPartner,
                    selected: prevPartner.id.toString() === partner.id.toString()
                };
            });
        });
    };

    const onProductSelect = (product) => {
        setProductsData((prev) => {
            return {
                mainSectionData: prev.mainSectionData?.map((item) => ({
                    ...item,
                    selected: item.id === product.id
                })),
                secondarySectionData: prev.secondarySectionData?.map((item) => ({
                    ...item,
                    selected: item.id === product.id
                }))
            };
        });
    };

    const onLanguageSelect = (language: IMenuItemProps) => {
        setLanguagesData((prev) => {
            return prev.map((prevLanguage) => {
                return {
                    ...prevLanguage,
                    selected: prevLanguage.id === language.id
                };
            });
        });
    };

    const onWalletSelect = (wallet: IMenuItemProps) => {
        setWalletData((prev) => {
            return prev.map((prevWallet) => {
                return {
                    ...prevWallet,
                    selected: prevWallet.id === wallet.id
                };
            });
        });
    };

    const onCurrencySelect = (currency: IMenuItemProps) => {
        setCurrencyData((prev) => {
            return prev.map((prevCurrency) => {
                return {
                    ...prevCurrency,
                    selected: prevCurrency.id === currency.id
                };
            });
        });
    };

    const onActivitiesSelect = (currency: IMenuItemProps) => {
        setActivityData((prev) => {
            return prev.map((prevActivity) => {
                return {
                    ...prevActivity,
                    selected: prevActivity.id === currency.id
                };
            });
        });
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <GlobalHeader
                {...props}
                onPartnerSelect={onPartnerSelect}
                onProductSelect={onProductSelect}
                onLanguageSelect={onLanguageSelect}
                onWalletSelect={onWalletSelect}
                partners={partnerData}
                products={productsData}
                languages={languagesData}
                wallet={walletData}
                currency={currencyData}
                onCurrencySelect={onCurrencySelect}
                activity={activityData}
                onActivitySelect={onActivitiesSelect}
                leftContent={<LeftContent />}
                actions={actions}
            />
        </div>
    );
};
export default meta;

type Story = StoryObj<IGlobalHeaderProps>;

export const Default: Story = {
    render: (props) => <Template {...props} />
};
