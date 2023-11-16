import React from 'react';

import Collapse from 'src/lib/molecules/Collapse/Collapse';
import Panel from 'src/lib/molecules/Collapse/Panel';
import Icon from 'src/lib/atoms/Icon/';
import { args, category } from '../../assets/storybook.globals';

const appearances = ['default', 'minimal'];

export default {
    title: 'Molecules/Collapse',
    component: Collapse,
    subcomponents: { Panel, Icon },
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        appearance: args({ control: 'select', options: appearances, category: category.appearance }),
        allActive: args({ control: 'boolean', category: category.states }),
        accordion: args({ control: 'boolean', category: category.states })
    },
    args: {
        allActive: false,
        accordion: false,
        appearance: appearances[0]
    }
};

const Template = (props) => {
    const { ...restProps } = props;
    const disabledPanels = '2, 4'.split(',').map((item) => item.trim());
    const showIconForPanel = '1, 2, 3, 4'.split(',').map((item) => item.trim());
    const count = 4;

    const expandIcon = (isActive) => (isActive ? <Icon type="bc-icon-apps" /> : <Icon type="bc-icon-plus" />);

    return (
        <>
            <Collapse {...{ expandIcon }} defaultActiveKeys={['1', '3']} {...restProps}>
                <Panel key="0" title="Title">
                    Content
                </Panel>
                {Array(count)
                    .fill()
                    .map((_, i) => (
                        <Panel
                            key={i + 1}
                            title={`Title ${i + 1}`}
                            disabled={disabledPanels.includes(`${i + 1}`)}
                            showIcon={showIconForPanel.includes(`${i + 1}`)}
                        >
                            <Collapse>
                                <Panel title="Nested">Content {i + 1}</Panel>
                            </Collapse>
                        </Panel>
                    ))}
            </Collapse>
        </>
    );
};

export const Default = Template.bind({});

export const CollapseControlled = ({ ...args }) => (
    <Collapse expandIcon={() => <Icon type="bc-icon-apps" />} activeKeys={['1']} {...args}>
        <Panel title="Title 1" disabled showIcon>
            <h3>Content 1</h3>
        </Panel>
        <Panel title="Title 2" showIcon={false}>
            <h3>Content 2</h3>
        </Panel>
        <Panel title="Title 3">
            <h3>Content 3</h3>
        </Panel>
    </Collapse>
);

export const ControlledAccordion = ({ ...args }) => (
    <Collapse accordion expandIcon={() => <Icon type="bc-icon-wallet" />} {...args}>
        <Panel key="1" title="Title 1">
            <h3>Content 1</h3>
        </Panel>
        <Panel key="2" title="Title 2">
            <h3>Content 2</h3>
        </Panel>
        <Panel key="3" title="Title 3">
            <h3>Content 3</h3>
        </Panel>
    </Collapse>
);
ControlledAccordion.args = { accordion: true };
