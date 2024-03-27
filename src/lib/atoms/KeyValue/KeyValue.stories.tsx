import React, { FC } from 'react';
import { Meta } from '@storybook/react';
import { args, propCategory } from '../../../../stories/assets/storybook.globals';

// Components
import KeyValueComponent from '.';

// Types
import { IKeyValueProps } from '.';

const keyValueConfig = {
    appearance: ['horizontal', 'vertical']
};

const meta: Meta<typeof KeyValueComponent> = {
    title: 'Atoms/KeyValue',
    component: KeyValueComponent,
    argTypes: {
        label: args({ control: 'text', ...propCategory.content }),
        value: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        appearance: args({
            content: 'select',
            defaultValue: keyValueConfig.appearance[0],
            options: keyValueConfig.appearance,
            ...propCategory.appearance
        }),
        icon: args({ control: 'text', ...propCategory.content })
    },
    args: {
        label: 'Some label',
        value: 'Some value',
        icon: 'bc-icon-info',
        appearance: keyValueConfig.appearance[0] as IKeyValueProps['appearance']
    }
};

export default meta;

const Template: FC<IKeyValueProps> = ({ ...args }) => <KeyValueComponent {...args} />;

export const Default = Template.bind({});

export const Vertical = Template.bind({});
Vertical.args = {
    appearance: keyValueConfig.appearance[1]
};
