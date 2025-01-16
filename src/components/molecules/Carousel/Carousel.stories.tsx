import React, { FC } from "react";
import { Meta } from "@storybook/react";
import { Search } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Carousel, { ICarouselProps, CarouselItem } from "./index";

const texts = [
    { title: "Slot component", description: "Replace it with any component using the “Component Instance” swapper." },
    {
        title: "Curiosity",
        description: "A good headline should be specific enough to be intriguing."
    },
    {
        title: "Emotional Appeal",
        description: "A good headline captures the reader's attention."
    },
    {
        title: "Relevance",
        description: "A headline problems will generate higher engagement."
    },
    {
        title: "Top headlines",
        description: "These types of posts are easy-to-digest blog posts."
    },
    {
        title: "Blog guid",
        description: "“A guide to” headline offers readers a step-by-step approach."
    },
    {
        title: "Mistakes to Avoid",
        description: "These headlines highlight the common mistakes associated with a topic."
    }
];

const textContent = texts.map(({ title, description }) => (
    <CarouselItem key={title}>
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                padding: "0 16px",
                backgroundColor: "#F4E1EC",
                border: "1px solid #A60063",
                fontFamily: "var(--guit-sem-font-heading-medium-semibold-font-family)"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#A60063"
                }}
            >
                <Search color="#A60063" />
                <span style={{ marginTop: 16, fontSize: 20 }}>{title}</span>
                <span style={{ marginTop: 4, fontSize: 14, textAlign: "center" }}>{description}</span>
            </div>
        </div>
    </CarouselItem>
));

const meta: Meta<typeof Carousel> = {
    title: "Molecules/Carousel",
    component: Carousel,
    argTypes: {
        className: args({ control: false, ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        withSlideArrows: args({ control: "boolean", ...propCategory.appearance }),
        withIndicators: args({ control: "boolean", ...propCategory.appearance }),
        children: args({ control: false, ...propCategory.appearance })
    },
    args: {
        children: textContent,
        direction: "horizontal",
        size: "large",
        withSlideArrows: true,
        withIndicators: true
    } as ICarouselProps
};

export default meta;

const Template: FC<ICarouselProps> = (props) => <Carousel {...props} />;

export const Default = Template.bind({});

Default.args = {} as ICarouselProps;

export const WithImageContent = Template.bind({});

WithImageContent.args = {
    children: Array.from(Array(8).keys()).map((index) => (
        <CarouselItem>
            <img
                src={`https://picsum.photos/id/${index * 10}/800/500`}
                alt={`https://picsum.photos/id/${index * 10}/800/500`}
                width="100%"
                height="auto"
            />
        </CarouselItem>
    ))
} as ICarouselProps;
