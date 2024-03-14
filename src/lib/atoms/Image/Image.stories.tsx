import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, category } from '../../../../stories/assets/storybook.globals';

// Component
import ImageComponent, { IImageProps } from '.';
import Button from '../Button';

const meta: Meta<typeof ImageComponent> = {
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

const Template: FC<IImageProps> = ({ ...args }) => <ImageComponent {...args} />;

export default meta;

export const Default = Template.bind({});

Default.args = {
    withBorder: true,
    selectMode: false,
    tooltipTitle: '',
    isValid: true,
    actions: (
        <>
            {/**@ts-ignore */}
            <Button icon="bc-icon-apps" appearance="minimal" />
            {/**@ts-ignore */}
            <Button icon="bc-icon-players" appearance="minimal" />
            {/**@ts-ignore */}
            <Button icon="bc-icon-trash" appearance="minimal" color="danger" />
        </>
    )
};
export const WithoutActions = Template.bind({});
