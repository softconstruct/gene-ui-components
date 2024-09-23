import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

/**
 * Example how to generate the test data
 * you can discover more functionality by
 * following the link https://github.com/faker-js/faker#readme
 */

// StackedBarChart story data
export const stackedBarDataPositive = [
    {
        name: 'Sylvia',
        data: [-124, 639, 19, -269, -470]
    },
    {
        name: 'Judson',
        data: [-286, -870, 265, -487, -452]
    },
    {
        name: 'General',
        data: [716, -483, 419, -869, -639]
    },
    {
        name: 'Flavie',
        data: [145, -457, -916, 10, 30]
    }
];
export const stackedBarDataNegative = [
    {
        name: 'Sylvia',
        data: [-124, 639, 19, -269, -470]
    },
    {
        name: 'Judson',
        data: [-286, -870, 265, -487, -452]
    },
    {
        name: 'General',
        data: [716, -483, 419, -869, -639]
    },
    {
        name: 'Flavie',
        data: [145, -457, -916, 10, 30]
    }
];

// HeatMapChart story data
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

export const HeatMapChartData = [
    [0, 12, 21.792972414626234],
    [0, 1, 18.35941676981998],
    [0, 2, 48.56722823445925],
    [0, 3, 89.83254091245745],
    [0, 4, 41.82752309024711],
    [0, 5, 43.23497862834253],
    [0, 6, 75.00295367708631],
    [0, 7, 89.17347541564291],
    [0, 8, 2.1399155817883653],
    [0, 9, 91.54801421942149],
    [0, 10, 71.11083684390513],
    [0, 11, 94.83483650565316],
    [0, 12, 20.59221791472887],
    [1, 12, 85.26073825591757],
    [1, 1, 50.10299005955636],
    [1, 2, 46.94733778747029],
    [1, 3, 38.051660034014034],
    [1, 4, 25.68361277330673],
    [1, 5, 52.005345048224605],
    [1, 6, 82.40488870479108],
    [1, 7, 3.466467514411664],
    [1, 8, 14.802753916292822],
    [1, 9, 47.700790649070846],
    [1, 10, 89.516648408903],
    [1, 11, 95.17119436490775],
    [1, 12, 13.430323680856816],
    [2, 12, 94.72785160221953],
    [2, 1, 35.49973415212651],
    [2, 2, 53.85564722805696],
    [2, 3, 72.44661349272421],
    [2, 4, 73.74460158772673],
    [2, 5, 86.88900302228045],
    [2, 6, 44.56328231356104],
    [2, 7, 87.07786139864547],
    [2, 8, 72.03867531292518],
    [2, 9, 30.635025022792163],
    [2, 10, 48.89965705390755],
    [2, 11, 62.59815185373145],
    [2, 12, 55.078939368527834],
    [3, 12, 44.72634043760857],
    [3, 1, 89.45728663776971],
    [3, 2, 0.768656588221095],
    [3, 3, 8.669828752440267],
    [3, 4, 66.03569680797273],
    [3, 5, 71.01082852842298],
    [3, 6, 32.363883318157406],
    [3, 7, 42.04699456237082],
    [3, 8, 57.87094446646142],
    [3, 9, 27.13157809069657],
    [3, 10, 8.11617102405442],
    [3, 11, 86.03677218540555],
    [3, 12, 76.88132581945052],
    [4, 12, 21.09563567515602],
    [4, 1, 31.432052080157558],
    [4, 2, 76.02778248689323],
    [4, 3, 25.118027003883682],
    [4, 4, 25.893589884269396],
    [4, 5, 79.69685560145099],
    [4, 6, 45.91875056552721],
    [4, 7, 35.26062834122672],
    [4, 8, 20.88070040288126],
    [4, 9, 91.53623010008644],
    [4, 10, 62.068370066845134],
    [4, 11, 89.99435393243887],
    [4, 12, 28.945209952899887],
    [5, 12, 86.62704758908968],
    [5, 1, 78.45479692369386],
    [5, 2, 17.328634545208786],
    [5, 3, 28.538843129918124],
    [5, 4, 19.67821527271896],
    [5, 5, 93.48059390325388],
    [5, 6, 24.135468942066684],
    [5, 7, 75.88839608948454],
    [5, 8, 15.901575574103589],
    [5, 9, 10.711657330274061],
    [5, 10, 95.70493432102734],
    [5, 11, 92.7503706469504],
    [5, 12, 36.7320212756475],
    [6, 12, 6.731243536963216],
    [6, 1, 34.81839998009979],
    [6, 2, 86.44154767162344],
    [6, 3, 57.01538939742219],
    [6, 4, 72.99218945763175],
    [6, 5, 47.24817666523744],
    [6, 6, 15.795504035376373],
    [6, 7, 70.41882150200036],
    [6, 8, 8.341879092166371],
    [6, 9, 67.96075165726754],
    [6, 10, 57.52194132108252],
    [6, 11, 71.91163928424247],
    [6, 12, 94.18961827061125]
];

// ColumnRangeChart story data
export const columnRangeData = [
    {
        name: 'Lavinia',
        data: [
            [-565, 1456],
            [287, 1122],
            [-1161, -516],
            [-693, -604]
        ]
    },
    {
        name: 'Lawson',
        data: [
            [-239, 669],
            [596, 1006],
            [379, 1469],
            [-382, 943]
        ]
    },
    {
        name: 'Claudie',
        data: [
            [-1318, -1220],
            [-387, 1031],
            [-994, -755],
            [-1427, 401]
        ]
    }
];

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
