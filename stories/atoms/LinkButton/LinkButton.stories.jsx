import React from 'react';

import LinkButtonComponent from 'src/lib/atoms/LinkButton/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Atoms/LinkButton',
    component: LinkButtonComponent,
    argTypes: {
        href: args({ control: 'text', category: category.content }),
        onClick: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        children: args({ control: 'text', category: category.content }),
        ariaLabel: args({ control: 'text', category: category.others }),
        onMouseDown: args({ control: false, category: category.action }),
        iconAfter: args({ control: 'text', category: category.content }),
        iconBefore: args({ control: 'text', category: category.content }),
        isDisabled: args({ control: 'boolean', category: category.states })
    },
    args: {
        iconAfter: 'bc-icon-arrow-down'
    }
};

export const LinkButton = (args) => <LinkButtonComponent {...args} />;
