import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Copy, CurrencyGlobal, Globe, HamburgerMenu } from "@geneui/icons";

import { partners } from "@components/organisms/GlobalHeader/__shared/data";
import { IProducts } from "@components/organisms/GlobalHeader/GlobalHeader";
import { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import GlobalHeader, { IGlobalHeaderProps } from "./index";

const products: IProducts = {
    mainSectionData: [
        {
            id: 1,
            title: "StarBase",
            withBadge: true,
            Icon: Globe,
            disabled: false,
            selected: true
        },
        {
            id: 2,
            title: "Pixel Bank",
            withBadge: true,
            Icon: CurrencyGlobal,
            disabled: false
        },
        {
            id: 3,
            title: "Sky Link",
            Icon: Copy,
            disabled: false
        },
        {
            id: 4,
            title: "Polyglot Hub",
            Icon: HamburgerMenu,
            disabled: true
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

const meta: Meta<IGlobalHeaderProps> = {
    title: "Organisms/GlobalHeader",
    component: GlobalHeader,

    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onNavigationButtonClick: args({ control: "false", ...propCategory.action }),
        onPartnerSelect: args({ control: "false", ...propCategory.action }),
        partnersLoading: args({ control: "boolean", ...propCategory.states }),
        partnersDisabled: args({ control: "boolean", ...propCategory.states }),
        partners: args({ control: "false", ...propCategory.content }),
        partnersLoadingText: args({ control: "text", ...propCategory.content }),
        partnersSearchPlaceholder: args({ control: "text", ...propCategory.content }),
        partnersName: args({ control: "text", ...propCategory.content }),
        partnersIdName: args({ control: "text", ...propCategory.content }),
        limitUnit: args({ control: "text", ...propCategory.content }),
        limitLabel: args({ control: "text", ...propCategory.content }),
        timeZone: args({ control: "text", ...propCategory.content }),
        timeFormat: args({ control: "select", ...propCategory.content }),
        logoAs: args({ control: "false", ...propCategory.content })
    },
    args: {
        logoAs: <a href="/" aria-label="logo" />,
        limitUnit: "1234523"
    }
};

const Template = (props) => {
    const [partnerData, setPartnerData] = useState<IPartnerItemData[]>(partners);
    const [productsData, setProductsData] = useState<IProducts>(products);

    useEffect(() => {
        setPartnerData(partners);
        setProductsData(products);
    }, []);

    const onPartnerSelect = (partner: IPartnerItemData) => {
        setPartnerData((prev) => {
            return prev.map((prevPartner) => {
                return {
                    ...prevPartner,
                    selected: prevPartner.id === partner.id
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

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <GlobalHeader
                {...props}
                onPartnerSelect={onPartnerSelect}
                onProductSelect={onProductSelect}
                partners={partnerData}
                products={productsData}
            />
        </div>
    );
};
export default meta;

type Story = StoryObj<IGlobalHeaderProps>;

export const Default: Story = {
    render: (props) => <Template {...props} />
};
