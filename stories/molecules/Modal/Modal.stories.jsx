import React, { useState } from 'react';

import ModalComponent from 'src/lib/molecules/Modal';
import Button from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';

const sizes = ['default', 'content-size'];
const backgrounds = ['transparent', 'light-background', 'dark-background'];
const appearances = ['default', 'compact'];
const positions = ['center', 'top', 'bottom'];

const states = { category: category.states };
const others = { category: category.others };
const action = { category: category.action };
const content = { category: category.content };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };
export default {
    title: 'Molecules/Modal',
    component: ModalComponent,
    argTypes: {
        title: args({ control: 'text', ...content }),
        okText: args({ control: 'text', ...content }),
        footer: args({ control: 'text', ...content }),
        className: args({ control: false, ...others }),
        children: args({ control: 'text', ...content }),
        width: args({ control: 'text', ...appearance }),
        size: args({ control: 'select', ...appearance }),
        visible: args({ control: 'boolean', ...states }),
        cancelText: args({ control: 'text', ...content }),
        zIndex: args({ control: 'number', ...appearance }),
        needEnter: args({ control: 'boolean', ...states }),
        isOkActive: args({ control: 'boolean', ...states }),
        withPortal: args({ control: 'boolean', ...states }),
        position: args({ control: 'select', ...appearance }),
        customActions: args({ control: 'text', ...content }),
        portalContainer: args({ control: false, ...content }),
        background: args({ control: 'select', ...appearance }),
        appearance: args({ control: 'select', ...appearance }),
        disableFooter: args({ control: 'boolean', ...content }),
        closable: args({ control: 'boolean', ...functionality }),
        onOK: args({ control: false, action: 'onOk', ...action }),
        isOkButtonLoading: args({ control: 'boolean', ...states }),
        onClose: args({ control: false, action: 'onClose', ...action }),
        onCancel: args({ control: false, action: 'onCancel', ...action }),
        closeOnClickOutside: args({ control: 'boolean', ...functionality })
    },
    args: {
        zIndex: 1000,
        okText: 'OK',
        visible: true,
        size: sizes[0],
        closable: true,
        title: 'Modal',
        width: 'Width',
        withPortal: true,
        cancelText: 'Cancel',
        position: positions[0],
        closeOnClickOutside: true,
        appearance: appearances[0],
        background: backgrounds[0],
        children: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
    }
};

export const Center = ({ visible, ...args }) => {
    const [isOpen, setIsOpen] = useState(visible);
    return (
        <ModalComponent
            {...args}
            visible={isOpen}
            onClose={() => {
                args.onClose();
                setIsOpen(false);
            }}
        />
    );
};

export const Top = ({ visible, ...args }) => {
    const [isOpen, setIsOpen] = useState(visible);
    return (
        <ModalComponent
            {...args}
            visible={isOpen}
            onClose={() => {
                args.onClose();
                setIsOpen(false);
            }}
        />
    );
};

Top.args = {
    position: positions[1]
};

export const Bottom = ({ visible, ...args }) => {
    const [isOpen, setIsOpen] = useState(visible);
    return (
        <ModalComponent
            {...args}
            visible={isOpen}
            onClose={() => {
                args.onClose();
                setIsOpen(false);
            }}
        />
    );
};

Bottom.args = {
    position: positions[2]
};
