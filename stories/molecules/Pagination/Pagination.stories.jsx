import React from 'react';

import PaginationComponent from 'src/lib/molecules/Pagination';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Pagination',
    component: PaginationComponent,
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        count: args({ control: 'number', category: category.states }),
        errorText: args({ control: 'text', category: category.content }),
        selected: args({ control: 'number', category: category.states }),
        autoFocus: args({ control: 'boolean', category: category.states }),
        defaultSelected: args({ control: 'number', category: category.states }),
        supportedKeyCodes: args({ control: 'number', category: category.states }),
        nextIconTooltipText: args({ control: 'text', category: category.content }),
        previousIconTooltipText: args({ control: 'text', category: category.content })
    },
    args: {
        count: 50,
        autoFocus: false,
        defaultSelected: 1
    }
};

export const Pagination = ({ ...args }) => <PaginationComponent {...args} />;
