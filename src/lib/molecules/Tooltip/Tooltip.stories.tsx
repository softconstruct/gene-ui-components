import React, { useRef } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import TooltipComponent, { ITooltipProps } from './index';
import Button from '../../atoms/Button';

const meta: Meta<ITooltipProps> = {
    title: 'Molecules/Tooltip',
    component: TooltipComponent,
    argTypes: {
        text: args({ control: 'text', ...propCategory.content }),
        children: args({ control: 'text', ...propCategory.content }),
        style: args({ control: 'text', ...propCategory.appearance }),
        size: args({ control: 'select', ...propCategory.appearance }),
        padding: args({ control: 'number', ...propCategory.appearance }),
        alwaysShow: args({ control: 'boolean', ...propCategory.states }),
        customPosition: args({ control: 'object', ...propCategory.functionality }),
        isVisible: args({ control: 'boolean', ...propCategory.functionality }),
        position: args({ control: 'select', ...propCategory.appearance }),
        screenType: args({ control: 'select', ...propCategory.appearance })
    },
    args: {
        size: 'default',
        isVisible: true,
        alwaysShow: false,
        position: 'top-center',
        text: 'Tooltip some text',
        screenType: 'desktop'
    }
};

export default meta;

export const Tooltip = ({ ...args }) => {
    return (
        <div style={{ height: '200px', padding: '200px' }}>
            <TooltipComponent {...args}>
                <Button>Button with tooltip</Button>
            </TooltipComponent>{' '}
        </div>
    );
};
