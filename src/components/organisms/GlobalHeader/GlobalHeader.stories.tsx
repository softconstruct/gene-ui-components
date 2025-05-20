import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { partners } from "@components/organisms/GlobalHeader/__shared/data";
import { IPartnerItemData } from "@components/organisms/GlobalHeader/Partners/Partners";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import GlobalHeader, { IGlobalHeaderProps } from "./index";

const meta: Meta<IGlobalHeaderProps> = {
    title: "Organisms/GlobalHeader",
    component: GlobalHeader,

    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onNavigationButtonClick: args({ control: "false", ...propCategory.action }),
        partnersLoading: args({ control: "boolean", ...propCategory.states }),
        partnersDisabled: args({ control: "boolean", ...propCategory.states }),
        partnersLoadingText: args({ control: "text", ...propCategory.content }),
        partnersName: args({ control: "text", ...propCategory.content }),
        partnersIdName: args({ control: "text", ...propCategory.content })
    },
    args: {
        logoAs: <a href="/" aria-label="logo" />
    }
};

const Template = (props) => {
    const [partnerData, setPartnerData] = useState<IPartnerItemData[]>(partners);

    useEffect(() => {
        setPartnerData(partners);
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
    return <GlobalHeader {...props} onPartnerSelect={onPartnerSelect} partners={partnerData} />;
};
export default meta;

type Story = StoryObj<IGlobalHeaderProps>;

export const Default: Story = {
    render: (props) => <Template {...props} />
};
