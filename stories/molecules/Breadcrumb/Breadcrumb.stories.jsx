import React from 'react';

import BreadcrumbComponent from 'src/lib/molecules/Breadcrumb';
import { args, category } from '../../assets/storybook.globals';
import { data } from './data';

export default {
    title: 'Molecules/Breadcrumb',
    component: BreadcrumbComponent,
    argTypes: {
        data: args({ control: 'object', category: category.content }),
        className: args({ control: false, category: category.others }),
        onClick: args({ action: 'onClick', category: category.action }),
        separator: args({ control: 'text', category: category.content }),
        collapsed: args({ control: 'boolean', category: category.states })
    },
    args: {
        data: data,
        separator: '>',
        collapsed: true
    }
};

export const Breadcrumb = ({ ...args }) => <BreadcrumbComponent {...args} />;
