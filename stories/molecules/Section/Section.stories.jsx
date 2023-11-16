import React from 'react';
import SectionComponent from 'src/lib/molecules/Section';
import Button from 'src/lib/atoms/Button';
import Title from 'src/lib/atoms/Title';
import { args, category } from '../../assets/storybook.globals';
import { titleConfig } from '../../../src/configs';

const others = { category: category.others };
const content = { category: category.content };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };

export default {
    title: 'Molecules/Section',
    component: SectionComponent,
    argTypes: {
        text: args({ control: 'text', ...content }),
        icon: args({ control: 'text', ...content }),
        className: args({ control: false, ...others }),
        actions: args({ control: 'text', ...content }),
        children: args({ control: 'text', ...content }),
        actionIcon: args({ control: 'text', ...content }),
        withLine: args({ control: 'boolean', ...appearance }),
        withActionIcon: args({ control: 'boolean', ...content }),
        withAction: args({ control: 'boolean', ...functionality }),
        color: args({ control: 'select', options: titleConfig.color, ...appearance })
    },
    args: {
        text: 'Hello',
        withLine: false,
        withAction: false,
        withActionIcon: false,
        icon: 'bc-icon-attachment',
        actionIcon: 'bc-icon-edit',
        color: titleConfig.color[0],
        children: 'Any content that is valid DOM node'
    }
};

const Template = ({ children, withActionIcon, actionIcon, withAction, ...args }) => {
    const action = (
        <Button size="medium" icon={withActionIcon ? actionIcon : ''} appearance="minimal">
            Edit
        </Button>
    );
    return (
        <SectionComponent actions={withAction ? action : ''} {...args}>
            {children}
        </SectionComponent>
    );
};

export const Default = Template.bind({});
export const Sections = ({ children, ...args }) => {
    const action = (
        <Button size="medium" icon={args.withActionIcon ? args.actionIcon : ''} appearance="minimal">
            Edit
        </Button>
    );
    return (
        <SectionComponent actions={args.withAction ? action : ''} {...args}>
            {[0, 0, 0, 0].map((item, index) => (
                <React.Fragment key={index}>
                    <Title text="Section with line" withLine />
                    <div className="section-sub-group" style={{ background: '#f2f2f2', padding: '6rem' }}>
                        {children}
                    </div>
                </React.Fragment>
            ))}
        </SectionComponent>
    );
};

Sections.args = {
    text: 'Hello',
    icon: 'bc-icon-attachment',
    color: titleConfig.color[0],
    withLine: false,
    withAction: false,
    withActionIcon: false,
    actionIcon: 'bc-icon-edit'
};
