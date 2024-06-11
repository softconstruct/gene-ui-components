import React from 'react';
import { Meta } from '@storybook/react';
import { args, category } from '../../../../stories/assets/storybook.globals';

//Configs
import { positions } from '../../../configs';

// Components
import Button from '../../atoms/Button';
import TooltipComponent from './';

// Types
import { ITooltipProps } from './';

const sizes = ['default', 'small'] as const;

const meta: Meta<ITooltipProps> = {
    title: 'Molecules/Tooltip',
    component: TooltipComponent,
    argTypes: {
        text: args({ control: 'text', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        children: args({ control: 'text', category: category.content }),
        style: args({ control: 'text', category: category.appearance }),
        size: args({ control: 'select', category: category.appearance }),
        padding: args({ control: 'number', category: category.appearance }),
        alwaysShow: args({ control: 'boolean', category: category.states }),
        disableReposition: args({ control: 'boolean', category: category.states }),
        customPosition: args({ control: 'object', category: category.appearance }),
        isVisible: args({ control: 'boolean', category: category.functionality }),
        position: args({ control: 'select', options: positions, category: category.appearance })
    },
    args: {
        size: sizes[0],
        title: 'Title',
        isVisible: true,
        alwaysShow: false,
        position: positions[0] as ITooltipProps['position'],
        disableReposition: false,
        text: 'Tooltip some text'
    }
};
export default meta;
export const Tooltip = ({ ...args }) => {
    return (
        <div style={{ height: '100%', padding: '200px' }}>
            <TooltipComponent {...args}>
                {/**@ts-ignore */}
                <Button>Button with tooltip</Button>
            </TooltipComponent>
        </div>
    );
};
