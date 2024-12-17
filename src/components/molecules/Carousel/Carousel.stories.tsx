import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Carousel, { ICarouselProps } from "./index";

const textContent = Array.from(Array(10).keys()).map((index) => {
    const randomSize = () => `${70 + Math.random() * 30}%`;
    const randomColorNumber = () => Math.ceil(Math.random() * 255);
    const style = {
        with: randomSize(),
        height: randomSize(),
        backgroundColor: `rgb(${randomColorNumber()}, ${randomColorNumber()}, ${randomColorNumber()})`,
        color: "white",
        fontSize: 128,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };
    return <div style={style}>{index}</div>;
});

const meta: Meta<typeof Carousel> = {
    title: "Molecules/Carousel",
    component: Carousel,
    argTypes: {
        className: args({ control: false, ...propCategory.appearance }),
        direction: args({ control: "select", ...propCategory.appearance }),
        size: args({ control: "select", ...propCategory.appearance }),
        children: args({ control: false, ...propCategory.appearance })
    },
    args: {
        children: textContent,
        direction: "horizontal",
        size: "large"
    } as ICarouselProps
};

export default meta;

const Template: FC<ICarouselProps> = (props) => <Carousel {...props} />;

export const Default = Template.bind({});

Default.args = {} as ICarouselProps;

export const WithImageContent = Template.bind({});

WithImageContent.args = {
    children: Array.from(Array(8).keys()).map((index) => (
        <img
            src={`https://picsum.photos/id/${index * 10}/800/500`}
            alt={`https://picsum.photos/id/${index * 10}/800/500`}
            width={800}
            height={500}
        />
    ))
} as ICarouselProps;
