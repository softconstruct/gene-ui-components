import React, { useState } from 'react';

import NavigationMenuComponent from 'src/lib/molecules/NavigationMenu';
import Divider from 'src/lib/atoms/Divider';
import Icon from 'src/lib/atoms/Icon';
import { args, category } from '../../assets/storybook.globals';
import { data } from './data';

export default {
    title: 'Molecules/NavigationMenu',
    component: NavigationMenuComponent,
    argTypes: {
        data: args({ control: false, category: category.content }),
        value: args({ control: false, category: category.content }),
        onChange: args({ control: false, category: category.action }),
        disabled: args({ control: 'boolean', category: category.states })
    },
    args: {
        disabled: false,
        data: data
    }
};

const Template = ({ onChange, ...args }) => {
    const [activePath, setActivePath] = useState('1/8');

    const handleChange = (path, item) => {
        onChange(path, item);
        setActivePath(path);
    };
    return (
        <header
            style={{
                width: '100%',
                height: 56,
                color: '#ffffff',
                backgroundColor: '#3d3d5f',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Icon type="bc-icon-publish" />
            <Divider type="vertical" size={32} />
            <NavigationMenuComponent {...args} value={activePath} onChange={handleChange} />
        </header>
    );
};

export const NavigationMenu = Template.bind({});
