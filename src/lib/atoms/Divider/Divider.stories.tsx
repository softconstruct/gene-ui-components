import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
// Components
import Divider, { IDividerProps } from './index';
import Button from '../Button/Button';

const meta: Meta<typeof Divider> = {
    title: 'Atoms/Divider',
    component: Divider,
    argTypes: {
        alignContentPosition: args({ control: 'select', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance }),
        isVertical: args({ control: 'boolean', ...propCategory.functionality }),
        Icon: args({ control: 'false', ...propCategory.others }),
        label: args({ control: 'text', ...propCategory.appearance }),
        labelPosition: args({ control: 'select', ...propCategory.appearance }),
        alignContent: args({ control: 'text', ...propCategory.functionality })
    },
    args: {
        alignContentPosition: 'left',
        appearance: 'brand',
        isVertical: false,
        label: 'test',
        labelPosition: 'before'
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
        <Divider
            {...args}
            alignContent={
                <Button
                    title="swap"
                    icon={'bc-icon-refresh'}
                    flexibility={'content-size'}
                    appearance="outline"
                    cornerRadius="smooth"
                >
                    Swap
                </Button>
            }
        />
    </div>
);
export const WithAlignContent = WithAlignContentComponent.bind({});

WithAlignContent.argTypes = {
    alignContent: args({ control: 'false', ...propCategory.functionality })
};
