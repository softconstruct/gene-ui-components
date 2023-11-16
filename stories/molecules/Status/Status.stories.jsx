import React from 'react';

import StatusComponent, { statusIconTypes } from 'src/lib/molecules/Status';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Status',
    component: StatusComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        label: args({ control: 'text', category: category.content }),
        onClick: args({ control: 'text', category: category.action }),
        className: args({ control: false, category: category.others }),
        color: args({ control: 'color', category: category.appearance }),
        hoverTitle: args({ control: 'text', category: category.content }),
        tooltipText: args({ control: 'text', category: category.content }),
        iconType: args({ control: 'select', options: statusIconTypes, category: category.appearance })
    },
    args: {
        label: '',
        color: '',
        title: 'In Progress',
        hoverTitle: 'Hover Title',
        tooltipText: 'Some tooltip',
        iconType: statusIconTypes[0]
    }
};

export const Status = ({ ...args }) => <StatusComponent {...args} />;
