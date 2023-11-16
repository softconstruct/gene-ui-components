const defaultData = Array(10)
    .fill([])
    .map((_, i) => ({
        label: `Product${i}`,
        value: `value${i}`,
        tag: {
            name: 'Hello',
            color: '#47b4a9',
            size: 'small',
            appearance: 'light',
            cornerRadius: 'smooth-radius'
        }
    }));

const data = [
    {
        label: 'England football clubs',
        tooltip: {
            title: 'tooltip title',
            text: 'tooltip Text'
        },
        value: [
            {
                label: 'Arsenal',
                value: 'Arsenal'
            },
            {
                label: 'Chelsea',
                value: 'Chelsea'
            }
        ]
    },
    {
        label: 'Zimbabwe football clubs',
        value: []
    },
    {
        label: 'single data 01',
        value: 'single data 01'
    },
    {
        label: 'Italian football clubs',
        tooltip: {
            title: 'tooltip title',
            text: 'tooltip Text'
        },
        value: [
            {
                label: 'Juventus',
                value: 'Juventus'
            },
            {
                label: 'Inter',
                value: 'Inter',
                disabled: true
            },
            {
                label: 'Milan',
                value: 'Milan'
            }
        ]
    },
    {
        label: 'single data 02',
        value: 'single data 02'
    },
    {
        label: 'single data 03',
        value: 'single data 03',
        disabled: true
    },
    {
        label: 'Spain football clubs',
        value: [
            {
                label: 'Real Madrid',
                value: 'Real Madrid'
            },
            {
                label: 'FC Barcelona',
                value: 'FC Barcelona'
            }
        ]
    },
    ...defaultData,
    {
        label: 'France football clubs',
        value: [
            {
                label: 'Paris Saint-Germain',
                value: 'Paris Saint-Germain'
            }
        ]
    }
];

export default data;

export const dataForReadOnly = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
    { label: 'Option 4', value: 4 },
    { label: 'Option 5', value: 5 },
    { label: 'Option 6', value: 6 },
    { label: 'Option 7', value: 7 },
    { label: 'Option 8', value: 8 },
    { label: 'Option 9', value: 9 }
];
