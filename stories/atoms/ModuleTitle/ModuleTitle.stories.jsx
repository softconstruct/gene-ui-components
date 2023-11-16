import React from 'react';

import ModuleTitleComponent from 'src/lib/atoms/ModuleTitle/index';
import Breadcrumb from 'src/lib/molecules/Breadcrumb/index';
import Button from 'src/lib/atoms/Button/index';
import Divider from 'src/lib/atoms/Divider/index';

import { args, category } from '../../assets/storybook.globals';
import { moduleTitleConfig } from 'configs';

import { data } from './data';

const actions = (
    <>
        <Button appearance="minimal" size="big" icon="bc-icon-arrow-down" />
        <Button appearance="minimal" size="big" icon="bc-icon-arrow-up" />
        <Divider type="vertical" />
        <Button appearance="minimal" size="big" icon="bc-icon-edit" />
        <Button appearance="minimal" size="big" icon="bc-icon-more-vertical" />
    </>
);

export default {
    title: 'Atoms/ModuleTitle',
    component: ModuleTitleComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        color: args({ control: 'color', category: category.appearance }),
        description: args({ control: 'text', category: category.content }),
        titleIconTooltip: args({ control: 'text', category: category.content }),
        size: args({
            control: 'select',
            options: moduleTitleConfig.size,
            defaultValue: moduleTitleConfig.size[1],
            category: category.appearance
        }),
        position: args({
            control: 'select',
            options: moduleTitleConfig.position,
            defaultValue: moduleTitleConfig.position[0],
            category: category.appearance
        }),
        cornerRadius: args({
            control: 'select',
            options: moduleTitleConfig.cornerRadius,
            defaultValue: moduleTitleConfig.cornerRadius[0],
            category: category.appearance
        }),
        hideBeforeBorder: args({ control: 'boolean', category: category.appearance }),
        headerBorder: args({ control: 'boolean', category: category.appearance }),
        children: args({ control: false, category: category.content }),
        className: args({ control: false, category: category.others }),
        titleIcon: args({ control: 'text', category: category.content }),
        onTitleIconClick: args({ control: false, category: category.action }),
        withActions: args({ control: 'boolean', category: category.functionality })
    },
    args: {
        title: 'Title',
        color: 'Color',
        description: 'Title Small',
        size: moduleTitleConfig.size[3],
        position: moduleTitleConfig.position[0],
        cornerRadius: moduleTitleConfig.cornerRadius[2],
        titleIcon: '',
        withActions: true
    }
};

const Template = ({ withActions, ...args }) => (
    <ModuleTitleComponent {...args}>{withActions && actions}</ModuleTitleComponent>
);

export const Default = Template.bind({});

export const WithCustomHeader = Template.bind({});
WithCustomHeader.args = {
    withActions: false,
    title: <Breadcrumb data={data} collapsed />
};
