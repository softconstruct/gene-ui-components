import React from 'react';

import WidgetComponent from 'src/lib/molecules/Widget';
import Button from 'src/lib/atoms/Button';
import { args, category } from '../../assets/storybook.globals';
import { widgetConfig } from '../../../src/configs';

const keyValues = [
    { label: 'label 1', value: 'value 1' },
    { label: 'label 2', value: 'value 2' },
    { label: 'label 3', value: 'value 3' }
];
const headerActions = <Button appearance="minimal" size="default" color="default" icon="bc-icon-calendar" />;

const others = { category: category.others };
const content = { category: category.content };
const appearance = { category: category.appearance };

export default {
    title: 'Molecules/Widget',
    component: WidgetComponent,
    argTypes: {
        img: args({ control: 'text', ...content }),
        text: args({ control: 'text', ...content }),
        title: args({ control: 'text', ...content }),
        noData: args({ control: 'text', ...content }),
        className: args({ control: false, ...others }),
        color: args({ control: 'color', ...appearance }),
        titleProps: args({ control: false, ...content }),
        titleIcon: args({ control: 'text', ...content }),
        noDataText: args({ control: 'text', ...content }),
        keyValues: args({ control: 'object', ...content }),
        headerActions: args({ control: 'text', ...content }),
        comparisonText: args({ control: 'text', ...content }),
        withShadow: args({ control: 'boolean', ...appearance }),
        withBorder: args({ control: 'boolean', ...appearance }),
        showComparisonIcons: args({ control: 'boolean', ...content }),
        size: args({ control: 'select', options: widgetConfig.size, ...appearance }),
        type: args({ control: 'select', options: widgetConfig.type, ...appearance }),
        comparisonStatus: args({ control: 'select', options: widgetConfig.comparisonStatus, ...appearance })
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
