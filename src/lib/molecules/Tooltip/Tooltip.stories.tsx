import React from 'react';
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
        title: args({ control: 'text', ...propCategory.content }),
        children: args({ control: 'text', ...propCategory.content }),
        style: args({ control: 'text', ...propCategory.appearance }),
        size: args({ control: 'select', ...propCategory.appearance }),
        padding: args({ control: 'number', ...propCategory.appearance }),
        alwaysShow: args({ control: 'boolean', ...propCategory.states }),
        disableReposition: args({ control: 'boolean', ...propCategory.states }),
        customPosition: args({ control: 'object', ...propCategory.appearance }),
        isVisible: args({ control: 'boolean', ...propCategory.functionality }),
        position: args({ control: 'select', ...propCategory.appearance }),
        onClick: args({ control: false, ...propCategory.action })
    },
    args: {
        size: 'default',
        title: 'Title',
        isVisible: true,
        alwaysShow: false,
        position: 'top',
        disableReposition: false,
        text: 'Tooltip some text'
    } as ITooltipProps
};

export default meta;

export const Tooltip = ({ ...args }) => {
    return (
        <div style={{ height: '1000px', padding: '200px' }}>
            <TooltipComponent {...args}>
                {/**@ts-ignore */}
                <Button>Button with tooltip</Button>
            </TooltipComponent>
        </div>
    );
};
