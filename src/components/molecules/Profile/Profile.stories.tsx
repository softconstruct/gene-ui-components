import React, { useEffect, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

// Components
import Profile, { IProfileProps } from "@components/molecules/Profile";
import { IProfileData } from "@components/molecules/Profile/Profile";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
import { profileData } from "../../../../stories/data/__profile";

const meta: Meta<typeof Profile> = {
    title: "Molecules/Profile",
    component: Profile,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        onToggle: args({ control: "false", ...propCategory.action }),
        fullName: args({ control: "text", ...propCategory.content }),
        src: args({ control: "text", ...propCategory.content }),
        onProfileItemSelect: args({ control: "false", ...propCategory.action }),
        profileData: args({ control: "false", ...propCategory.content })
    },
    args: {
        fullName: "User Name",
        src: "https://picsum.photos/id/64/200/300"
    }
};

export default meta;

type Story = StoryObj<IProfileProps>;

const ProfileComponentStory = (props: IProfileProps) => {
    const [data, setData] = useState<IProfileData[]>([]);

    useEffect(() => {
        setData(profileData);
    }, [profileData]);
    const onProfileItemSelect = (item: IProfileData) => {
        const currentPath = item?.paths;
        if (currentPath && currentPath?.length > 0) {
            const currentIndex = currentPath[0];
            setData((prev) => {
                const updatedData = {
                    ...prev[currentIndex],
                    children: prev[currentIndex].children?.map((el) => ({ ...el, selected: el.id === item.id }))
                };

                return prev.map((el, index) => (index.toString() === currentIndex ? updatedData : el));
            });
        }
    };

    return (
        <div
            style={{
                width: "100%",
                background: "var(--guit-sem-color-background-neutral-5)",
                padding: "5px 10px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center"
            }}
        >
            <Profile {...props} profileData={data} onProfileItemSelect={onProfileItemSelect} />
        </div>
    );
};

export const Default: Story = {
    render: (props) => <ProfileComponentStory {...props} />
};
