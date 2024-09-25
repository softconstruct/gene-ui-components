import { faker } from '@faker-js/faker';
import { LegendAppearances } from '../../../src/lib/molecules/Charts/HeatMapChartD3/Legend';

export const HeatMapChartAxisData = {
    x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    y: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24'
    ]
};

export const HeadMapChartIndAxesData = {
    YAxisData: HeatMapChartAxisData.y.map((el) => `${el}:00 AMT`),
    XAxisData: HeatMapChartAxisData.x
};

const generateData = () => {
    const data: number[][] = [];
    for (let i = 0; i <= 6; i++) {
        for (let j = 1; j <= 12; j++) {
            const randomValue = faker.datatype.float({ min: 0, max: 100 });
            data.push([i, j, randomValue]);
        }
    }
    return data;
};

export const data = generateData();

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
