import React, { FC } from 'react';
import { Meta } from '@storybook/react';

// Helpers
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import InteractiveWidget, { IInteractiveWidgetProps } from './index';
import { Icon, Switcher, Tag } from '../../../index';

const meta: Meta<typeof InteractiveWidget> = {
    title: 'Molecules/InteractiveWidget',
    component: InteractiveWidget,
    subcomponents: { Switcher, Tag },
    argTypes: {
        title: args({ control: 'text', ...propCategory.content }),
        icon: args({ control: 'text', ...propCategory.appearance }),
        onClick: args({ control: 'false', ...propCategory.action }),
        titleInfo: args({ control: 'text', ...propCategory.content }),
        tagProps: args({ control: 'false', ...propCategory.content }),
        className: args({ control: 'false', ...propCategory.others }),
        disabled: args({ control: 'boolean', ...propCategory.states }),
        description: args({ control: 'text', ...propCategory.content }),
        iconColor: args({ control: 'color', ...propCategory.appearance }),
        appearance: args({ control: 'select', ...propCategory.appearance }),
        withBorder: args({ control: 'boolean', ...propCategory.appearance }),
        switcherProps: args({ control: 'false', ...propCategory.functionality }),
        iconBackground: args({ control: 'boolean', ...propCategory.appearance })
    },
    args: {
        tagProps: {
            appearance: 'outline',
            name: 'Tag Name',
            // @ts-ignore
            icons: <Icon type="bc-icon-publish-globe-48" />,
            size: 'small'
        },
        title: 'Interactive Widget',
        iconColor: '#15ab1b',
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        titleInfo: 'additional info for title',
        switcherProps: {}
    } as IInteractiveWidgetProps
};

export default meta;

const Template: FC<IInteractiveWidgetProps> = (args) => <InteractiveWidget icon={'bc-icon-user'} {...args} />;

const ListTemplate: FC<IInteractiveWidgetProps> = (args) => {
    return (
        <>
            <div style={{ display: 'flex', maxWidth: '100%', justifyContent: 'space-between', gap: '1rem' }}>
                <InteractiveWidget style={{ maxWidth: '50%' }} icon={'bc-icon-user'} {...args} />
                <InteractiveWidget style={{ maxWidth: '50%' }} icon={'bc-icon-product-48'} {...args} />
            </div>
            <div style={{ display: 'flex', maxWidth: '100%', margin: '1rem 0' }}>
                <InteractiveWidget icon={'bc-icon-codesandbox'} {...args} />
            </div>
            <div style={{ display: 'flex', maxWidth: '100%', justifyContent: 'space-between', gap: '1rem' }}>
                <InteractiveWidget style={{ maxWidth: '50%' }} icon={'bc-icon-user'} {...args} />
                <InteractiveWidget style={{ maxWidth: '50%' }} icon={'bc-icon-product-48'} {...args} />
            </div>
        </>
    );
};

export const Default = Template.bind({});

Default.args = { onClick: undefined };

export const Compact = Template.bind({});

Compact.args = {
    appearance: 'compact',
    description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    iconColor: '#3e00ff',
    tagProps: {
        appearance: 'outline',
        name: 'Tag',
        size: 'small'
    },
    withBorder: false,
    withSwitcher: false
};

export const Group = ListTemplate.bind({});
