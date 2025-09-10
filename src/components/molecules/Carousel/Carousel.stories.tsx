import React from "react";
import { Meta, StoryObj } from "@storybook/react";

// Icons
import { Magnifier } from "@geneui/icons";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";
// Components
import Carousel, { CarouselItem, ICarouselProps } from "./index";

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
        <div className="carouselStory__content">
            <div className="carouselStory__inner">
                <Magnifier className="carouselStory__icon" color="#A60063" />
                <span className="carouselStory__title">{title}</span>
                <span className="carouselStory__description">{description}</span>
            </div>
        </div>
    </CarouselItem>
));

const meta: Meta<typeof Carousel> = {
    title: "Molecules/Carousel",
    component: Carousel,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        withSlideArrows: args({ control: "boolean", ...propCategory.appearance }),
        withIndicators: args({ control: "boolean", ...propCategory.appearance }),
        children: args({ control: "false", ...propCategory.appearance })
    },
    args: {
        children: textContent,
        direction: "horizontal",
        withSlideArrows: true,
        withIndicators: true
    } as ICarouselProps
};

export default meta;

type Story = StoryObj<ICarouselProps>;

export const Default: Story = {
    args: {}
};

export const WithImageContent: Story = {
    args: {
        children: Array.from({ length: 8 }, (_, index) => (
            <CarouselItem key={index}>
                <img
                    src={`https://picsum.photos/id/${index * 10}/800/500`}
                    alt={`https://picsum.photos/id/${index * 10}/800/500`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                    }}
                />
            </CarouselItem>
        ))
    }
};
