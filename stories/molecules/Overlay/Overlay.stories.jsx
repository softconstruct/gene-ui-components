import React, { useState } from 'react';

import OverlayComponent from 'src/lib/molecules/Overlay';
import Divider from 'src/lib/atoms/Divider';
import Button from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';

const positions = ['top', 'right', 'bottom', 'left'];
const horizontalSizes = ['half', 'wide', 'minimal'];

const action = { category: category.action };
const states = { category: category.states };
const others = { category: category.others };
const content = { category: category.content };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };

export default {
    title: 'Molecules/Overlay',
    component: OverlayComponent,
    argTypes: {
        title: args({ control: 'text', ...content }),
        onClose: args({ control: false, ...action }),
        footer: args({ control: 'text', ...content }),
        content: args({ control: 'text', ...content }),
        className: args({ control: false, ...others }),
        children: args({ control: 'text', ...content }),
        closeText: args({ control: 'text', ...content }),
        extendText: args({ control: 'text', ...content }),
        reduceText: args({ control: 'text', ...content }),
        description: args({ control: 'text', ...content }),
        isExtended: args({ control: 'boolean', ...states }),
        onClickOutside: args({ control: false, ...action }),
        headerActions: args({ control: 'text', ...content }),
        withBackDrop: args({ control: 'boolean', ...appearance }),
        horizontalSize: args({ control: 'select', ...appearance }),
        withFooter: args({ control: 'boolean', ...functionality }),
        onToggle: args({ control: false, action: 'eeeeee', ...action }),
        withHeaderActions: args({ control: 'boolean', ...functionality }),
        position: args({ control: 'select', options: positions, ...appearance })
    },
    args: {
        title: 'Title',
        withFooter: true,
        content: 'Content text',
        withBackDrop: false,
        position: positions[2],
        closeText: 'Close Text',
        withHeaderActions: true,
        reduceText: 'Reduce Text',
        extendText: 'Extend Text',
        description: 'Small Title',
        horizontalSize: horizontalSizes[0]
    }
};

const headerActions = (
    <>
        <Button appearance="minimal" size="big" icon="bc-icon-arrow-down" />
        <Button appearance="minimal" size="big" icon="bc-icon-arrow-up" />
        <Divider type="vertical" />
        <Button appearance="minimal" size="big" icon="bc-icon-edit" />
        <Button appearance="minimal" size="big" icon="bc-icon-more-vertical" />
    </>
);
const footer = (
    <>
        <Button color="default" appearance="minimal">
            Manage
        </Button>
        <Button color="confirm">Apply</Button>
    </>
);
export const Overlay = (args) => {
    const { withHeaderActions, withFooter, content, ...rest } = args;
    const [close, setClose] = useState(false);
    return !close ? (
        <>
            <OverlayComponent
                {...rest}
                headerActions={withHeaderActions && headerActions}
                footer={withFooter && footer}
                onClose={() => {
                    setClose(true);
                }}
            >
                {content}
            </OverlayComponent>
        </>
    ) : (
        <></>
    );
};
