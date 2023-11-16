import React from 'react';

import TagComponent from 'src/lib/molecules/Tag';
import Icon from 'src/lib/atoms/Icon';
import { args, category } from '../../assets/storybook.globals';

const tagConfig = {
    appearance: ['simple', 'minimal', 'outline', 'clean', 'light', 'colored'],
    size: ['small', 'medium', 'big'],
    flexibility: ['content-size', 'compact', 'full-width'],
    cornerRadius: ['full-radius', 'smooth-radius']
};
const icons = (
    <>
        <Icon type="bc-icon-clear-small" />
        <Icon type="bc-icon-selected" />
    </>
);

export default {
    title: 'Molecules/Tag',
    component: TagComponent,
    argTypes: {
        icons: args({ control: false, category: category.states }),
        name: args({ control: 'text', category: category.content }),
        label: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        cursor: args({ control: 'text', category: category.appearance }),
        color: args({ control: 'color', category: category.appearance }),
        selected: args({ control: 'boolean', category: category.states }),
        showIcons: args({ control: 'boolean', category: category.states }),
        size: args({ control: 'select', options: tagConfig.size, category: category.appearance }),
        appearance: args({ control: 'select', options: tagConfig.appearance, category: category.appearance }),
        flexibility: args({ control: 'select', options: tagConfig.flexibility, category: category.appearance }),
        cornerRadius: args({ control: 'select', options: tagConfig.cornerRadius, category: category.appearance })
    },
    args: {
        label: '',
        color: '',
        showIcons: true,
        selected: false,
        name: 'Tag name',
        cursor: 'pointer',
        size: tagConfig.size[1],
        appearance: tagConfig.appearance[0],
        flexibility: tagConfig.flexibility[0],
        cornerRadius: tagConfig.cornerRadius[0]
    }
};

const Template = (args) => <TagComponent icons={args.showIcons ? icons : ''} {...args} />;
export const Default = Template.bind({});

export const Minimal = Template.bind({});
Minimal.args = {
    appearance: tagConfig.appearance[1],
    showIcons: false
};
export const Outlined = Template.bind({});
// appearance="outline" icons={<Icon type="bc-icon-wallet" />}
Outlined.args = {
    appearance: tagConfig.appearance[2],
    icons: <Icon type="bc-icon-wallet" />
};
