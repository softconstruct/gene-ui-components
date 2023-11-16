import React from 'react';

import QRCodeComponent from 'src/lib/atoms/QRCode';
import { args, category } from '../../assets/storybook.globals';

const QRConfig = {
    level: ['L', 'M', 'Q', 'H']
};
export default {
    title: 'Atoms/QRCode',
    component: QRCodeComponent,
    darkMode: {
        stylePreview: true
    },
    // src, icon, size, color, shape, onClick, children
    argTypes: {
        value: args({ control: 'text', category: category.content }),
        maxSize: args({ control: 'number', category: category.appearance }),
        level: args({ control: 'select', category: category.appearance })
    },
    args: {
        value: 'https://en.wikipedia.org/wiki/QR_code',
        maxSize: 400,
        level: QRConfig.level[0]
    }
};

export let QRCode = ({ ...args }) => <QRCodeComponent {...args} />;
