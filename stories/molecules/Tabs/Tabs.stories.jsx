import React, { useState } from 'react';

import TabsComponent from 'src/lib/molecules/Tabs/Tabs';
import Tab from 'src/lib/molecules/Tabs/Tab';
import Icon from 'src/lib/atoms/Icon';
import './index.scss';
import { args, category } from '../../assets/storybook.globals';

const types = ['basic', 'box', 'button', 'text'];

const positions = ['top', 'left', 'right'];

export default {
    title: 'Molecules/Tabs',
    component: TabsComponent,
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        children: args({ control: false, category: category.content }),
        activeKey: args({ control: false, category: category.content }),
        actions: args({ control: false, category: category.appearance }),
        type: args({ control: 'select', category: category.appearance }),
        withIcons: args({ control: 'boolean', category: category.states }),
        allDisabled: args({ control: 'boolean', category: category.states }),
        contentClassName: args({ control: false, category: category.others }),
        fixedSize: args({ control: 'boolean', category: category.appearance }),
        defaultActiveKey: args({ control: 'text', category: category.content }),
        contentPadding: args({ control: 'text', category: category.appearance }),
        position: args({ control: 'select', options: positions, category: category.appearance })
    },
    args: {
        actions: true,
        type: types[0],
        fixedSize: true,
        withIcons: true,
        allDisabled: false,
        contentPadding: '19',
        defaultActiveKey: '1',
        position: positions[0]
    }
};

const Template = ({ ...args }) => {
    const [count, setCount] = useState(4);
    const { withIcons, actions, type, position, fixedSize, allDisabled, contentPadding, onChange, defaultActiveKey } =
        args;
    return (
        <TabsComponent
            type={type}
            actions={actions && <Icon type="bc-icon-edit" />}
            defaultActiveKey={defaultActiveKey}
            contentPadding={contentPadding}
            fixedSize={fixedSize}
            position={position}
            onChange={onChange}
        >
            {Array(count)
                .fill()
                .map((_, i) => (
                    <Tab
                        key={i + 1}
                        title={`Tab ${i + 1}`}
                        disabled={allDisabled}
                        icon={withIcons ? 'bc-icon-menu-collapsed' : ''}
                    >
                        {Array(20)
                            .fill()
                            .map((_, j) => (
                                <p>Tab {j + 1}</p>
                            ))}
                    </Tab>
                ))}
        </TabsComponent>
    );
};

export const Tabs = Template.bind({});
