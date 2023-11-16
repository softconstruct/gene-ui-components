import React from 'react';

import TextLinkComponent from 'src/lib/atoms/TextLink/index';
import { args, category, componentStage } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/TextLink-d',
    component: TextLinkComponent,
    argTypes: {
        className: args({ control: false, category: category.others }),
        children: args({ control: 'text', category: category.content })
    },
    args: {
        componentStage: {
            type: componentStage.deprecated
        }
    }
};

const Template = ({ children, ...args }) => <TextLinkComponent {...args}>{children}</TextLinkComponent>;

export const TextLink = Template.bind({});
TextLink.args = {
    children: 'Some link'
};
