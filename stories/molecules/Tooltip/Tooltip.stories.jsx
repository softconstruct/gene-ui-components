import React from 'react';

import TooltipComponent from 'src/lib/molecules/Tooltip';
import Button from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';
import { positions } from '../../../src/configs';

const sizes = ['default', 'small'];

export default {
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
        transitionDuration: args({ control: 'number', category: category.appearance }),
        isVisible: args({ control: 'boolean', category: category.functionality }),
        position: args({ control: 'select', options: positions, category: category.appearance })
    },
    args: {
        size: sizes[0],
        title: 'Title',
        isVisible: true,
        alwaysShow: false,
        transitionDuration: 0,
        position: positions[0],
        disableReposition: false,
        text: 'Tooltip some text'
    }
};

export const Tooltip = ({ ...args }) => {
    return (
        <div style={{ height: '100%', padding: '200px' }}>
            <TooltipComponent {...args}>
                <Button>Button with tooltip</Button>
            </TooltipComponent>
        </div>
    );
};
