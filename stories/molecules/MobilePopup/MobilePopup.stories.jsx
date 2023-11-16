import React from 'react';

import MobilePopupComponent from 'src/lib/molecules/MobilePopup';
import { leftAction, rightAction } from './data';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/MobilePopup',
    component: MobilePopupComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        children: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.content }),
        isOpened: args({ control: 'boolean', category: category.states }),
        portalContainer: args({ control: false, category: category.content }),
        rightAction: args({ control: 'object', category: category.functionality }),
        leftAction: args({ control: 'object', action: 'leftAction', category: category.functionality }),
        leftActionClick: args({ control: false, action: 'leftActionClick', category: category.action }),
        onBackdropClick: args({ control: false, action: 'onBackdropClick', category: category.action }),
        rightActionClick: args({ control: false, action: 'rightActionClick', category: category.action })
    },
    args: {
        leftAction,
        rightAction,
        title: 'Title',
        isOpened: true
    }
};

export const MobilePopup = ({ ...args }) => <MobilePopupComponent {...args} />;
