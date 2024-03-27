import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Component
import ImageComponent from '.';
import Button from '../Button';

// Types
import { IImageProps } from '.';

const meta: Meta<typeof ImageComponent> = {
    title: 'Atoms/Image',
    component: ImageComponent,
    argTypes: {
        src: args({ control: 'text', ...propCategory.content }),
        withBorder: args({ control: 'boolean', defaultValue: 'true', ...propCategory.appearance }),
        selectMode: args({ control: 'boolean', defaultValue: 'false', ...propCategory.states }),
        title: args({ control: 'text', ...propCategory.content }),
        tooltipTitle: args({ control: 'text', ...propCategory.content }),
        actions: args({ control: 'text', ...propCategory.content }),
        checkboxProps: args({ control: false, ...propCategory.others }),
        imageProps: args({ control: false, ...propCategory.others }),
        className: args({ control: false, ...propCategory.others }),
        isValid: args({ control: 'boolean', ...propCategory.validation }),
        emptyText: args({ control: 'text', ...propCategory.content })
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
    tooltipTitle: '',
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
