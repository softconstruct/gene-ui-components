import React, { FC } from "react";
import { Meta } from "@storybook/react";

// Helpers
import { args, propCategory } from "../../../../stories/assets/storybook.globals";

// Components
import Carousel, { ICarouselProps } from "./index";

const meta: Meta<typeof Carousel> = {
    title: "Molecules/Carousel",
    component: Carousel,
    argTypes: {
        className: args({ control: "false", ...propCategory.appearance })
        // fill Carousel component argTypes
    },
    args: {
        children: [<span>1</span>, <span>2</span>, <span>3</span>, <span>4</span>, <span>5</span>, <span>6</span>]
        // fill Carousel component args
    } as ICarouselProps
};

export default meta;

const Template: FC<ICarouselProps> = (props) => <Carousel {...props} />;

export const Default = Template.bind({});

Default.args = {} as ICarouselProps;
