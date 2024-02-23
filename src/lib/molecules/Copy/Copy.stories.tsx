import React, { useRef } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Copy, { ICopyProps } from './index';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';
import { Textarea } from '../../../index';

const meta: Meta<typeof Copy> = {
    component: Copy,
    title: 'Molecules/Copy',
    argTypes: {
        contentRef: args({ ...propCategory.content }),
        value: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        size: args({ control: 'select', ...propCategory.appearance }),
        copyTooltipText: args({ control: 'text', ...propCategory.content }),
        copiedTooltipText: args({ control: 'text', ...propCategory.content }),
        isVisible: args({ control: 'boolean', ...propCategory.functionality }),
        showOnHover: args({ control: 'boolean', ...propCategory.functionality })
    }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithRef: Story = (args: ICopyProps) => {
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

export const WithValue: Story = (args: ICopyProps) => {
    return (
        <div>
            <Copy {...args} />
            <Textarea placeholder={'Past here for testing'} />
        </div>
    );
};

WithValue.args = {
    value: 'Value for copy',
    size: 'big'
};

export const ShowOnHover: Story = (args: ICopyProps) => {
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

ShowOnHover.args = {
    showOnHover: true
};
