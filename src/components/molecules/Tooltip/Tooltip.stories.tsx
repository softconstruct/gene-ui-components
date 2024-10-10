import React from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { InfoOutline } from '@geneui/icons';

// Components
import TooltipComponent, { ITooltipProps } from './index';
import Pill from '../../atoms/Pill';

const meta: Meta<ITooltipProps> = {
    title: 'Molecules/Tooltip',
    component: TooltipComponent,
    argTypes: {
        text: args({ control: 'text', ...propCategory.content }),
        children: args({ control: 'false', ...propCategory.content }),
        padding: args({ control: 'number', ...propCategory.appearance }),
        alwaysShow: args({ control: 'boolean', ...propCategory.states }),
        customPosition: args({ control: 'object', ...propCategory.functionality }),
        isVisible: args({ control: 'boolean', ...propCategory.functionality }),
        position: args({ control: 'select', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance }),
        Icon: args({ control: 'false', ...propCategory.content })
    },
    args: {
        isVisible: true,
        alwaysShow: false,
        position: 'top-center',
        text: 'Tooltip some text',
        appearance: 'default',
        padding: 10,
        Icon: <InfoOutline size={16} />
    }
};

export default meta;

export const Tooltip = ({ ...args }) => {
    return (
        <div style={{ height: '200px', padding: '200px' }}>
            <TooltipComponent {...args}>
                <Pill text={'tooltip target'} color={'warning'} isFill />
            </TooltipComponent>
        </div>
    );
};