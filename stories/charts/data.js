import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

/**
 * Example how to generate the test data
 * you can discover more functionality by
 * following the link https://github.com/faker-js/faker#readme
 */

const stackedBarDataCreator = (min, max) => {
    const stackedBarData = [];

    function createStackedBarData() {
        return {
            name: faker.name.firstName(),
            data: Array.from({ length: 5 }, () => faker.datatype.number({ min, max }))
        };
    }

    Array.from({ length: 4 }).forEach(() => {
        stackedBarData.push(createStackedBarData());
    });
    return stackedBarData;
};

export const stackedBarDataPositive = stackedBarDataCreator(0, 1000);
export const stackedBarDataNegative = stackedBarDataCreator(-1000, 1000);

// HeatMapChart story data
const getDate = (arr) => {
    for (let i = 0; i <= 6; i++) {
        for (let j = 0; j <= 12; j++) {
            const result = dayjs().day(i).hour(j).format('YYYY-MM-DDTHH:mm:ss');
            arr.push({
                x: dayjs(result).get('day'),
                y: dayjs(result).format('hh:mm'),
                value: Math.random() * 100
            });
        }
    }
    return arr;
};

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

export const HeatMapChartData = getDate([]).map((item) => [
    item.x,
    HeatMapChartAxisData.y.indexOf(item.y.split(':')[0]),
    item.value
]);

/**
 * ColumnRangeChart story data
 */
const columnRangeDataCreator = (min, max) =>
    Array.from({ length: 3 }, () => ({
        name: faker.name.firstName(),
        data: Array.from({ length: 4 }, () => Array.from({ length: 2 }, () => faker.datatype.number({ min, max })))
    }));

export const columnRangeData = columnRangeDataCreator(-1500, 1500).map((elem) => {
    elem.data.forEach((el) => {
        if (el[0] > el[1]) el.reverse();
    });
    return elem;
});

export const HeadMapChartIndAxesData = {
    YAxisData: HeatMapChartAxisData.y.map((el) => `${el}:00 AMT`),
    XAxisData: HeatMapChartAxisData.x
};

export const columnRangeDataFixed = [
    {
        data: [
            [10000, 15000],
            [8000, 12000],
            [7000, 10000],
            [7000, 9500]
        ],
        name: 'KO'
    },
    {
        data: [
            [7000, 10000],
            [6000, 8000],
            [0, 5000],
            [6500, 7000]
        ],
        name: 'RO'
    },
    {
        data: [
            [0, 7000],
            [3000, 6000],
            [5000, 7000],
            [5500, 6500]
        ],
        name: 'AM'
    }
];

export const dashStyles = [
    'Solid',
    'ShortDash',
    'ShortDot',
    'ShortDashDot',
    'ShortDashDotDot',
    'Dot',
    'Dash',
    'LongDash',
    'DashDot',
    'LongDashDot',
    'LongDashDotDot'
];

export const monthsList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const weekDaysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const weekDaysFullList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** DalColumnChart story data */

export const dalColumnData = [
    {
        name: 'Day 1',
        y: 75,
        drilldown: 'Day 1'
    },
    {
        y: 71,
        name: 'Day 2',
        drilldown: 'Day 2'
    },
    {
        y: 64,
        name: 'Day 3',
        drilldown: 'Day 3'
    },
    {
        y: 50,
        name: 'Day 4',
        drilldown: 'Day 4'
    },
    {
        y: 68,
        name: 'Day 5',
        drilldown: 'Day 5'
    },
    {
        y: 85,
        name: 'Day 6',
        drilldown: 'Day 6'
    },
    {
        y: 100,
        name: 'Day 7',
        drilldown: 'Day 7'
    }
];

export const drillDownData = [
    ['1', 15],
    ['2', 34],
    ['3', 40],
    ['4', 50],
    ['5', 60],
    ['6', 55],
    ['7', 40],
    ['8', 30],
    ['9', 28],
    ['10', 25],
    ['11', 28],
    ['12', 28],
    ['13', 32],
    ['14', 40],
    ['15', 45],
    ['16', 55],
    ['17', 60],
    ['18', 65],
    ['19', 70],
    ['20', 75],
    ['21', 85],
    ['22', 80],
    ['23', 70],
    ['24', 60]
];

/** DonutChart story data */

export const donutChartData = [
    {
        y: 200,
        color: '#ff92b4',
        name: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
    },
    {
        y: 300,
        color: '#d987de',
        name: 'Segment 2'
    },
    {
        y: 20,
        color: '#ffdc53',
        name: 'Segment 3'
    },
    {
        y: 50,
        color: '#5fde96',
        name: 'Segment 4'
    },
    {
        y: 0,
        color: '#4f96eb',
        name: 'Segment 5'
    },
    {
        y: 0,
        color: '#00c6db',
        name: 'Segment 6'
    },
    {
        y: 150,
        color: '#ffb95e',
        name: 'Segment 7'
    },
    {
        y: 50,
        color: '#cf8d8d',
        name: 'Segment 8'
    }
];

/** FunnelChart story data */

export const funnelChartData = [
    {
        y: 100,
        count: 300,
        percentage: 100,
        color: '#ff92b4',
        name: 'Segment 1'
    },
    {
        y: 100,
        count: 250,
        percentage: 50,
        color: '#00c6db',
        name: 'Segment 2'
    },
    {
        y: 100,
        count: 150,
        percentage: 40,
        color: '#ffdc53',
        name: 'Segment 3'
    },
    {
        y: 100,
        count: 120,
        percentage: 30,
        color: '#d987de',
        name: 'Segment 4'
    },
    {
        y: 100,
        count: 70,
        percentage: 10,
        color: '#4f96eb',
        name: 'Segment 5'
    },
    {
        y: 100,
        count: 10,
        percentage: 5,
        color: '#ff7a7a',
        name: 'Segment 6'
    }
];

/** PieChart story data */

export const pieChartData = [
    {
        y: 200,
        color: '#ff92b4',
        name: 'Segment 1'
    },
    {
        y: 300,
        color: '#d987de',
        name: 'Segment 2'
    },
    {
        y: 100,
        color: '#ffdc53',
        name: 'Segment 3'
    },
    {
        y: 50,
        color: '#5fde96',
        name: 'Segment 4'
    },
    {
        y: 150,
        color: '#4f96eb',
        name: 'Segment 5'
    },
    {
        y: 100,
        color: '#00c6db',
        name: 'Segment 6'
    },
    {
        y: 150,
        color: '#ffb95e',
        name: 'Segment 7'
    },
    {
        y: 50,
        color: '#cf8d8d',
        name: 'Segment 8'
    }
];

/** TreeMapChart story data */

export const treeMapChartData = [
    {
        value: 420,
        color: '#ff92b4',
        name: 'Buzzed Off',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 285,
        color: '#5fde96',
        name: 'About to Sleep',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 279,
        color: '#4febeb',
        name: 'Recently Active',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 200,
        color: '#ffdc53',
        name: 'Unsteady',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 73,
        color: '#98b8f8',
        name: 'Unsteady',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 42,
        color: '#ff81c0',
        name: 'Disappearing Core',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 41,
        color: '#4fbbeb',
        name: 'Lost',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 41,
        color: '#ffb95e',
        name: 'Lost',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    },
    {
        value: 22,
        color: '#77aceb',
        name: 'Cooled off...',
        infoText: 'It is a long established fact that a reader will be distracted by the readable.'
    }
];
