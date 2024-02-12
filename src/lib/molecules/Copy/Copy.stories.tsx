import React, { useRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Copy from './index';
import { args, category } from '../../../../stories/assets/storybook.globals';
import { Textarea } from '../../../index';

const meta = {
    component: Copy,
    title: 'Molecules/Copy',
    argTypes: {
        value: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        contentRef: args({ control: false, category: category.others }),
        size: args({ control: 'select', category: category.appearance }),
        isVisible: args({ control: 'boolean', category: category.appearance }),
        copyTooltipText: args({ control: 'text', category: category.content }),
        copiedTooltipText: args({ control: 'text', category: category.content }),
        displayOnHover: args({ control: 'boolean', category: category.functionality })
    }
} satisfies Meta<typeof Copy>;

export default meta;

type Story = StoryObj<typeof meta>;

const RefTemplate: Story = ({ ...args }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="wrapper" style={{ display: 'flex', marginBottom: '30px' }}>
                <p ref={textRef}>This is the text content you want to copy.</p>
                <Copy contentRef={textRef} {...args} />
            </div>
            <Textarea placeholder={'Past here for testing'} />
        </div>
    );
};

export const CopyWithRef = RefTemplate.bind({});
CopyWithRef.args = {
    displayOnHover: false,
    size: 'medium'
};

const ValueTemplate: Story = ({ ...args }) => {
    const textRef = useRef<HTMLParagraphElement>(null);
    return (
        <div>
            <Copy {...args} />
            <Textarea placeholder={'Past here for testing'} />
        </div>
    );
};

export const CopyWithValue = ValueTemplate.bind({});
CopyWithValue.args = {
    displayOnHover: false,
    value: 'Value for copy',
    size: 'big'
};
