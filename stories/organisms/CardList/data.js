import React from 'react';
import ExtendedInput from '../../../src/lib/molecules/ExtendedInput';

export const generateRows = (rowsCount) =>
    Array(rowsCount || 10)
        .fill(0)
        .map((_, index) => ({
            onClick: (row, i) => console.log(`Clicked on ${i} row`),
            data: {
                userId: `userId ${index}`,
                username: `User ${index}`,
                firstName: `FirstName ${index}`,
                lastName: `lastName ${index}`,
                stakes: `Stakes ${index}`,
                pla: `Pla ${index}`,
                pl: `pl ${index}`,
                status: `Status ${index}`,
                deskName: `desk name ${index}`,
                winning: `Winning ${index}`,
                profitability: `${index}`
            }
        }));

export const columns = [
    {
        text: 'User ID',
        dataKey: 'userId',
        formatter: () =>
            new Promise((res) => {
                res('test');
            }),
        widgetColor: 'red'
    },
    {
        text: 'Username',
        dataKey: 'username',
        sortable: false,
        formatter: () =>
            new Promise((res) => {
                const timerId = setTimeout(() => {
                    res('already loaded');
                    clearTimeout(timerId);
                }, 4000);
            })
    },
    {
        text: 'First Name',
        dataKey: 'firstName'
    },
    {
        text: 'Last Name',
        dataKey: 'lastName'
    },
    {
        text: 'CashDesk Name',
        dataKey: 'cacheDeskName'
    },
    {
        text: 'Status',
        dataKey: 'status',
        hide: true
    },
    {
        text: 'Stakes (AMD)',
        dataKey: 'stakes'
    },
    {
        text: 'Winning (AMD)',
        dataKey: 'winning',
        widgetColor: '#f06464'
    },
    {
        text: 'P/L (AMD)',
        dataKey: 'pl'
    },
    {
        text: 'Profitability',
        dataKey: 'profitability',
        colRenderer: (value, index, row) => <ExtendedInput value={value} key={row.data.lastName} />
    },
    {
        text: 'Stakes (AMD)',
        dataKey: 'pla'
    }
];
export const totals = columns.reduce((acc, { dataKey }) => ({ ...acc, [dataKey]: 100 }), {});

export const breadcrumbData = [
    {
        title: 'Title 1',
        slug: 'title1'
    },
    {
        title: 'Title 2',
        slug: 'title2'
    },
    {
        title: 'Title 3',
        slug: 'title3'
    }
];
