import React from 'react';

import ImageComponent from 'src/lib/atoms/Image/index';
import Button from 'src/lib/atoms/Button/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/Image',
    component: ImageComponent,
    argTypes: {
        src: args({ control: 'text', category: category.content }),
        withBorder: args({ control: 'boolean', defaultValue: 'true', category: category.appearance }),
        selectMode: args({ control: 'boolean', defaultValue: 'false', category: category.states }),
        title: args({ control: 'text', category: category.content }),
        tooltipTitle: args({ control: 'text', category: category.content }),
        actions: args({ control: 'text', category: category.content }),
        checkboxProps: args({ control: false, category: category.others }),
        imageProps: args({ control: false, category: category.others }),
        className: args({ control: false, category: category.others }),
        isValid: args({ control: 'boolean', category: category.validation }),
        emptyText: args({ control: 'text', category: category.content })
    },
    args: {
        src: 'https://picsum.photos/1920/1080',
        title: 'Placeholder Image'
    }
};

const Template = ({ ...args }) => <ImageComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    withBorder: true,
    selectMode: false,
    tooltipTitle: '',
    isValid: true,
    actions: (
        <>
            <Button icon="bc-icon-apps" appearance="minimal" />
            <Button icon="bc-icon-players" appearance="minimal" />
            <Button icon="bc-icon-trash" appearance="minimal" color="danger" />
        </>
    )
};
export const WithoutActions = Template.bind({});
