import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { InfoOutline } from '@geneui/icons';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
// Components
import Divider, { IDividerProps } from './index';
import Button from '../Button/Button';

const meta: Meta<typeof Divider> = {
    title: 'Atoms/Divider',
    component: Divider,
    argTypes: {
        appearance: args({ control: 'select', ...propCategory.appearance }),
        isVertical: args({ control: 'boolean', ...propCategory.appearance }),
        Icon: args({ control: 'false', ...propCategory.content }),
        label: args({ control: 'text', ...propCategory.content }),
        labelPosition: args({ control: 'select', ...propCategory.appearance }),
        content: args({ control: 'false', ...propCategory.content }),
        inset: args({ control: 'boolean', ...propCategory.appearance })
    },
    args: {
        appearance: 'brand',
        isVertical: false,
        label: 'test',
        labelPosition: 'before',
        Icon: InfoOutline,
        //TODO: Add Button component (or any component) when finish refactoring

        content: (
            <Button
                title="swap"
                icon={'bc-icon-refresh'}
                flexibility={'content-size'}
                appearance="outline"
                cornerRadius="smooth"
            >
                Swap
            </Button>
        )
    }
};

export default meta;

const Template: FC<IDividerProps> = (args) => (
    <div style={{ height: 220 }}>
        <Divider {...args} />
    </div>
);

export const Default = Template.bind({});

const WithAlignContentComponent: FC<IDividerProps> = (args) => (
    <div style={{ height: 220 }}>
        <Divider {...args} />
    </div>
);
export const WithAlignContent = WithAlignContentComponent.bind({});

WithAlignContent.argTypes = {
    alignContent: args({ control: 'false', ...propCategory.content })
};

export const WithoutIconAndLabel = WithAlignContentComponent.bind({});

WithoutIconAndLabel.args = {
    Icon: null,
    label: undefined
} as IDividerProps;

WithoutIconAndLabel.argTypes = {
    label: args({ control: 'false', ...propCategory.appearance })
};
export const Solid = WithAlignContentComponent.bind({});

Solid.args = {
    Icon: null,
    label: undefined,
    content: undefined,
    labelPosition: 'after'
} as IDividerProps;

Solid.argTypes = {
    labelPosition: args({ control: 'false', ...propCategory.appearance })
};
