import React, { useState, useMemo } from 'react';
import { action } from '@storybook/addon-actions';

import { Button, Checkbox, ComboTable, ExtendedInput } from 'src';

import { noop } from 'utils';

const onEditHandler = () => null;

const selectorData = [
    {
        label: '15',
        value: 15
    },
    {
        label: '30',
        value: 30,
        defaultSelected: true
    },
    {
        label: '100',
        value: 100
    },
    {
        label: 'All',
        value: 'all'
    }
];

const stopPropagation = (e) => e.stopPropagation();

const rowActionBar = (row, index) =>
    index % 5 === 0 ? (
        <>
            <Button icon="bc-icon-apps" size="big" appearance="minimal" color="primary" onClick={noop} />
            <Button icon="bc-icon-players" size="big" appearance="minimal" color="primary" onClick={noop} />
        </>
    ) : null;

function UncontrolledTable({ exportedFileName, rowsCount }) {
    const [text, setText] = useState({});

    const onChangeHandler = (e, index) => {
        e.stopPropagation();
        setText({ ...text, [index]: e.target.value });
    };

    const rows = Array(rowsCount)
        .fill(0)
        .map((_, index) => ({
            hasHover: true,
            dragDisable: true,
            disabled: !(index % 4),
            // children,
            onClick: () => console.log('row click'),
            data: {
                checkbox: index,
                userId: `userId ${index}`,
                username: `User ${index}`,
                firstName: `First name ${index}`,
                lastName: `lastName ${index}`,
                stakes: `Stakes ${index}`,
                amount: `$ ${Math.ceil(Math.random() * 1000)}`,
                pla: `Pla ${index}`,
                pl: `pl ${index}`,
                status: `Status ${index}`,
                cacheDeskName: `cach desk name cach desk name cach desk name cach desk name cach desk name ${index}`,
                winning: `Winning ${Math.random()}`,
                profitability: text[index]
            }
        }));

    const footerValues = useMemo(
        () => ({
            userId: 'Total',
            username: rowsCount,
            firstName: rowsCount,
            lastName: rowsCount,
            cacheDeskName: rowsCount,
            status: rowsCount,
            stakes: rowsCount,
            winning: rowsCount,
            pl: rowsCount,
            profitability: rowsCount,
            pla: rowsCount
        }),
        []
    );

    const columns = [
        {
            render: (...args) => <Checkbox onClick={() => action('Select all')(args)} />,
            colRenderer: (...args) => <Checkbox onClick={() => action('Select')(args)} />,
            dataKey: 'checkbox',
            hasOptions: false,
            sortable: false,
            resizable: false,
            draggable: false,
            sizeParams: {
                defaultCustomWidth: 50
            }
        },
        {
            text: 'User ID',
            dataKey: 'userId',
            copyable: true,
            copyTooltipText: 'Tooltip User ID'
        },
        {
            text: 'Username',
            dataKey: 'username',
            exportDisabled: true,
            sortable: false,
            formatter: () =>
                new Promise((res, rej) => {
                    const timerId = setTimeout(() => {
                        res('already loaded');
                        clearTimeout(timerId);
                    }, 2000);
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
            copyable: true,
            text: 'CashDesk Name',
            dataKey: 'cacheDeskName'
        },
        {
            text: 'Status',
            dataKey: 'status'
        },
        {
            text: 'Stakes (AMD)',
            dataKey: 'stakes',
            removeSymbol: true
        },
        {
            text: 'Amount (USD)',
            dataKey: 'amount',
            removeSymbol: true
        },
        {
            text: 'Winning (AMD)',
            dataKey: 'winning',
            removeSymbol: true
        },
        {
            text: 'P/L (AMD)',
            dataKey: 'pl',
            removeSymbol: true
        },
        {
            text: 'Profitability',
            dataKey: 'profitability',
            colRenderer: (value, index, row, isEditActive) =>
                isEditActive ? (
                    <ExtendedInput
                        value={value}
                        onClick={stopPropagation}
                        key={row.data.lastName}
                        onChange={(e) => onChangeHandler(e, index)}
                    />
                ) : (
                    text[index] || null
                ),
            sortFn: (prev, next, type, dataKey) => console.log({ prev, next, type, dataKey })
        },
        {
            text: 'Stakes (AMD)',
            dataKey: 'pla',
            removeSymbol: true
        }
    ];

    const getDataForExport = () => ({
        data: rows.map(({ data }, index) => ({
            ...data,
            custom: `Custom ${index}`
        })),
        columns: [
            ...columns,
            {
                text: 'Custom column',
                dataKey: 'custom'
            }
        ]
    });

    return (
        <ComboTable
            withExport
            getDataForExport={getDataForExport}
            rowKey="lastName"
            columnKey="dataKey"
            sortableColumns
            resizableColumns
            exportedFileName={exportedFileName}
            draggableColumns
            rows={rows}
            rowsCount={rowsCount}
            noDataWithImage
            withSearch
            columns={columns}
            footerValues={footerValues}
            onEdit={onEditHandler}
            selectorData={selectorData}
            name="Uncontrolled Table"
            editApprovalText="Save"
            editRejectionText="Cancel"
            rowActionBar={rowActionBar}
            onRowClick={console.log}
            hasDoubleHeader
            groups={[
                {
                    text: 'Group 1',
                    innerColCount: 3
                },
                {
                    text: 'Group 2',
                    innerColCount: 3
                },
                {
                    text: 'Group 3',
                    innerColCount: 7
                }
            ]}
        />
    );
}

export default UncontrolledTable;
