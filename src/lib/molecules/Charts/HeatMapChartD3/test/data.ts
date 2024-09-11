import { faker } from '@faker-js/faker';
import { LegendAppearances } from '../Legend';

const generateData = () => {
    const data: number[][] = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = 1; j <= 12; j++) {
            const randomValue = faker.datatype.number({ min: 0, max: 100 });
            data.push([i, j, randomValue]);
        }
    }
    return data;
};

export const data = generateData();
export const xAxisCategories = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const yAxisCategories = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
    (el) => `${el}:00 AMT`
);

export const colorBreakpoints = [
    { value: 0, color: '#fffed3' },
    { value: 50, color: '#ff8000' },
    { value: 100, color: '#ff0000' }
];

export const tooltipData = {
    x: 20,
    y: 20,
    text: '200'
};

export const legendData = {
    style: { width: 10 },
    min: 0,
    max: 100,
    currentNumber: 30,
    colorBreakpoints,
    legendThresholds: 5,
    legendLayout: LegendAppearances.Vertical,
    height: '50%'
};
