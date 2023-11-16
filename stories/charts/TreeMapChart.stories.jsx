import React from 'react';

import TreeMapChartComponent from 'src/lib/molecules/Charts/TreeMapChart';
import data from './treeMapData';
import { treeMapChartData } from './data';
import { args, category } from '../assets/storybook.globals';

const colors = ['#ff92b4', '#5fde96', '#98b8f8', '#4febeb', '#77aceb', '#ffb95e', '#4fbbeb', '#ff81c0'];
const points = [];
const causeName = {
    'Communicable & other Group I': 'Communicable diseases',
    'Noncommunicable diseases': 'Non-communicable diseases',
    Injuries: 'Injuries'
};

let regionP,
    regionVal,
    regionI = 0,
    countryP,
    countryI,
    causeP,
    causeI,
    region,
    country,
    cause;

const total = treeMapChartData.reduce((acc, item) => acc + item.value, 0);

const layoutAlgorithms = ['strip', 'stripes', 'squarified', 'sliceAndDice'];

for (region in data) {
    if (data.hasOwnProperty(region)) {
        regionVal = 0;
        regionP = {
            id: 'id_' + regionI,
            name: region,
            color: colors[Math.floor(Math.random() * colors.length)],
            infoText: 'It is a long established fact that'
        };
        countryI = 0;
        for (country in data[region]) {
            if (data[region].hasOwnProperty(country)) {
                countryP = {
                    id: regionP.id + '_' + countryI,
                    name: country,
                    infoText: 'It is a long established fact that',
                    parent: regionP.id,
                    value: 512
                };
                points.push(countryP);
                causeI = 0;
                for (cause in data[region][country]) {
                    if (data[region][country].hasOwnProperty(cause)) {
                        causeP = {
                            id: countryP.id + '_' + causeI,
                            infoText: causeName[cause],
                            parent: countryP.id,
                            value: Math.round(+data[region][country][cause])
                        };
                        regionVal += causeP.value;
                        points.push(causeP);
                        causeI = causeI + 1;
                    }
                }
                countryI = countryI + 1;
            }
        }
        regionP.value = Math.round(regionVal / countryI);
        points.push(regionP);
        regionI = regionI + 1;
    }
}

export default {
    title: 'Charts/TreeMapChart',
    component: TreeMapChartComponent,
    argTypes: {
        data: args({ control: 'array', category: category.content }),
        title: args({ control: 'text', category: category.content }),
        tooltip: args({ control: 'text', category: category.content }),
        dataName: args({ control: 'text', category: category.content }),
        withLegend: args({ control: 'boolean', category: category.states }),
        categories: args({ control: false, category: category.content }),
        pointWidth: args({ control: false, category: category.content }),
        plotOptions: args({ control: false, category: category.others }),
        subtitle: args({ control: 'text', category: category.content }),
        decimalNumberPrecision: args({ control: false, category: category.content }),
        layoutAlgorithm: args({ control: 'select', options: layoutAlgorithms, category: category.appearance }),
        series: args({ control: false, category: category.content }),
        total: args({ control: 'number', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        emptyText: args({ control: 'text', category: category.content })
    },
    args: {
        title: '',
        subtitle: '',
        isLoading: false,
        emptyText: 'No data to display'
    }
};

const Template = ({ ...args }) => <TreeMapChartComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    total: total,
    data: treeMapChartData
};
export const WithMoreData = Template.bind({});
WithMoreData.args = {
    total: 4,
    data: points
};
