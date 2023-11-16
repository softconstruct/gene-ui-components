import React from 'react';

import NotificationComponent from 'src/lib/molecules/Notification';
import { screenTypes } from '../../../src/configs';
import { args, category } from '../../assets/storybook.globals';

const notificationTypes = ['default', 'clean'];

export default {
    title: 'Molecules/Notification',
    component: NotificationComponent,
    argTypes: {
        onClose: args({ control: false, category: category.action }),
        title: args({ control: 'text', category: category.content }),
        content: args({ control: 'text', category: category.content }),
        heading: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        type: args({ control: 'select', category: category.appearance }),
        closable: args({ control: 'boolean', category: category.states }),
        description: args({ control: 'text', category: category.content }),
        onContentClick: args({ control: false, category: category.action }),
        screenType: args({ control: false, category: category.appearance }),
        notificationIcon: args({ control: 'text', category: category.content }),
        additionalHeading: args({ control: 'text', category: category.content }),
        additionalDescription: args({ control: 'text', category: category.content })
    },
    args: {
        title: 'Title',
        closable: true,
        heading: 'First Title',
        type: notificationTypes[0],
        screenType: screenTypes[0],
        description: 'First Description',
        additionalHeading: 'Second Title',
        notificationIcon: 'bc-icon-success-fill',
        additionalDescription: 'Second Description'
    }
};

export const Notification = ({ ...args }) => <NotificationComponent {...args} />;
