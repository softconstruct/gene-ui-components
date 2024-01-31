import React from 'react';

import WidgetComponent from 'src/lib/molecules/Widget';
import Button from 'src/lib/atoms/Button';
import { args, propCategory } from '../../assets/storybook.globals';
import { widgetConfig } from '../../../src/configs';

const keyValues = [
    { label: 'label 1', value: 'value 1' },
    { label: 'label 2', value: 'value 2' },
    { label: 'label 3', value: 'value 3' }
];

const headerActions = <Button appearance="minimal" size="default" color="default" icon="bc-icon-calendar" />;

export default {
    title: 'Molecules/Widget',
    component: WidgetComponent,
    argTypes: {
        img: args({ control: 'text', ...propCategory.content }),
        text: args({ control: 'text', ...propCategory.content }),
        title: args({ control: 'text', ...propCategory.content }),
        noData: args({ control: 'text', ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        color: args({ control: 'color', ...propCategory.appearance }),
        titleProps: args({ control: false, ...propCategory.content }),
        titleIcon: args({ control: 'text', ...propCategory.content }),
        noDataText: args({ control: 'text', ...propCategory.content }),
        keyValues: args({ control: 'object', ...propCategory.content }),
        headerActions: args({ control: 'text', ...propCategory.content }),
        comparisonText: args({ control: 'text', ...propCategory.content }),
        withShadow: args({ control: 'boolean', ...propCategory.appearance }),
        withBorder: args({ control: 'boolean', ...propCategory.appearance }),
        showComparisonIcons: args({ control: 'boolean', ...propCategory.content }),
        size: args({ control: 'select', options: widgetConfig.size, ...propCategory.appearance }),
        type: args({ control: 'select', options: widgetConfig.type, ...propCategory.appearance }),
        comparisonStatus: args({
            control: 'select',
            options: widgetConfig.comparisonStatus,
            ...propCategory.appearance
        })
    },
    args: {
        noData: false,
        withShadow: true,
        color: '#fdc624',
        withBorder: false,
        keyValues: keyValues,
        noDataText: 'No Data',
        comparisonText: '10%',
        text: 'AMD 120,500,770.00',
        title: 'Total of Deposits',
        type: widgetConfig.type[0],
        showComparisonIcons: false,
        size: widgetConfig.size[1],
        headerActions: headerActions,
        titleIcon: 'bc-icon-fantasy-sports',
        comparisonStatus: widgetConfig.comparisonStatus[0],
        img: 'https://www.svgrepo.com/show/244697/coins-money.svg'
    }
};

export const Widget = ({ ...args }) => <WidgetComponent {...args} />;
