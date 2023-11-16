import React, { useState, useCallback, useMemo } from 'react';

import { args, category, componentStage } from '../../assets/storybook.globals';

import { action } from '@storybook/addon-actions';

import { Button, Checkbox, ComboTable, ExtendedInput, Breadcrumb, Modal, Time, Table } from 'src';

import { noop } from 'utils';

export default {
    title: 'Organisms/Table-d',
    component: ComboTable,
    argTypes: {
        onEdit: args({ control: false, category: category.action }),
        name: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        onSaveChanges: args({ control: false, category: category.action }),
        onRefreshClick: args({ control: false, category: category.action }),
        editButtonText: args({ control: 'text', category: category.content }),
        editApprovalText: args({ control: 'text', category: category.content }),
        exportedFileName: args({ control: 'text', category: category.content }),
        editActiveOutside: args({ control: 'text', category: category.content }),
        editRejectionText: args({ control: 'text', category: category.content }),
        withSearch: args({ control: 'boolean', category: category.functionality }),
        withExport: args({ control: 'boolean', category: category.functionality }),
        titleActions: args({ control: 'object', category: category.functionality }),
        headerActions: args({ control: 'object', category: category.functionality }),
        isSaveActive: args({ control: 'boolean', category: category.functionality }),
        getDataForExport: args({ control: false, category: category.functionality }),
        defaultSortedColumn: args({ control: false, category: category.functionality }),
        refreshButtonTooltipText: args({ control: 'text', category: category.content }),
        showRefreshButton: args({ control: 'boolean', category: category.functionality }),
        hideSearchDropdown: args({ control: 'boolean', category: category.functionality }),
        fabricateSelectorLabel: args({ control: false, category: category.functionality }),
        defaultSortType: args({ control: 'select', options: ['asc', 'desc'], category: category.functionality })
    },
    args: {
        name: 'name',
        withSearch: true,
        withExport: true,
        isSaveActive: true,
        defaultSortType: 'asc',
        showRefreshButton: true,
        editActiveOutside: false,
        hideSearchDropdown: false,
        editButtonText: 'editButtonText',
        editApprovalText: 'editApprovalText',
        exportedFileName: 'exportedFileName',
        editRejectionText: 'editRejectionText',
        refreshButtonTooltipText: 'refreshButtonTooltipText',
        titleActions: (
            <div>
                <Button>titleActions</Button>
            </div>
        ),
        headerActions: (
            <div>
                <Button>headerActions</Button>
            </div>
        )
    }
};

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

export const UncontrolledTable = ({ rowsCount, ...args }) => {
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
            getDataForExport={getDataForExport}
            rowKey="lastName"
            columnKey="dataKey"
            sortableColumns
            resizableColumns
            draggableColumns
            rows={rows}
            rowsCount={rowsCount}
            noDataWithImage
            columns={columns}
            footerValues={footerValues}
            onEdit={onEditHandler}
            selectorData={selectorData}
            name="Uncontrolled Table"
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
            {...args}
        />
    );
};

const breadcrumbData = [
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

const breadCrumb = <Breadcrumb collapsed data={breadcrumbData} />;

const handleRenderChildren = () =>
    function (row, index) {
        const rowsCount = 10000;
        const pageRowsCount = 20;
        const currentPage = 1;
        const neededRowsCount =
            pageRowsCount * currentPage > rowsCount ? rowsCount - pageRowsCount * (currentPage - 1) : pageRowsCount;
        const rows = Array(neededRowsCount)
            .fill(0)
            .map((_, index) => ({
                hasHover: true,
                dragDisable: false,
                onClick: () => null,
                data: {
                    userId: `userId ${index + pageRowsCount * (currentPage - 1)}`,
                    username: `User ${index + pageRowsCount * (currentPage - 1)}`,
                    firstName: `FirstName ${index + pageRowsCount * (currentPage - 1)}`,
                    lastName: `LastName ${index + pageRowsCount * (currentPage - 1)}`,
                    stakes: `Stakes ${index + pageRowsCount * (currentPage - 1)}`,
                    pla: `Pla ${index + pageRowsCount * (currentPage - 1)}`,
                    pl: `pl ${index + pageRowsCount * (currentPage - 1)}`,
                    status: `Status ${index + pageRowsCount * (currentPage - 1)}`,
                    cacheDeskName: `cach desk name cach desk name cach desk name cach desk name cach desk name ${
                        index + pageRowsCount * (currentPage - 1)
                    }`,
                    winning: `Winning ${index + pageRowsCount * (currentPage - 1)}`,
                    profitability: `Text ${index}`
                }
            }));
        const columns = [
            {
                text: 'User ID',
                resizable: false,
                draggable: false,
                dataKey: 'userId',
                formatter: () =>
                    new Promise((res, rej) => {
                        res('test');
                    })
            },
            {
                text: 'Username',
                sortable: false,
                dataKey: 'username',
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
                dataKey: 'firstName',
                hasOptions: false
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
                dataKey: 'status'
            },
            {
                text: 'Stakes (AMD)',
                dataKey: 'stakes'
            },
            {
                text: 'Winning (AMD)',
                dataKey: 'winning'
            },
            {
                text: 'P/L (AMD)',
                dataKey: 'pl'
            },
            {
                text: 'Profitability',
                dataKey: 'profitability',
                sortFn: (prev, next, type, dataKey) => console.log({ prev, next, type, dataKey })
            },
            {
                text: 'Stakes (AMD)',
                dataKey: 'pla'
            }
        ];
        return <Table rowKey="lastName" columns={columns} rows={rows} />;
    };

const toggleTooltips = ['Open Details', 'Close Details'];

export const ControlledComboTable = ({ ...args }) => {
    const [text, setText] = useState({});
    const [modalData, setModalData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageRowsCount, setPageRowsCount] = useState(100);
    const [selectedRow, setSelectedRow] = useState('LastName 1');
    const onChangeHandler = (e, index) => {
        e.stopPropagation();
        setText({ ...text, [index]: e.target.value });
    };

    const extraClickHandler = (event, data, index, row) => {
        setIsModalOpen(true);
        setModalData(data);
    };

    const onPaginationChange = useCallback((page, selectorValue) => {
        setIsLoading(true);
        setCurrentPage(page);
        setPageRowsCount(selectorValue);
        setTimeout(() => {
            setIsLoading(false);
        }, 10);
    }, []);

    const onSelectorChange = (count) => {
        setCurrentPage(1);
        setPageRowsCount(count === 'all' ? 10000 : count);
    };

    const rowsCount = 10000;
    const neededRowsCount =
        pageRowsCount * currentPage > rowsCount ? rowsCount - pageRowsCount * (currentPage - 1) : pageRowsCount;
    const rows = Array(neededRowsCount)
        .fill(0)
        .map((_, index) => ({
            hasHover: true,
            dragDisable: false,
            disabled: !(index % 10),
            onClick: () => null,
            data: {
                userId: `userId ${index + pageRowsCount * (currentPage - 1)}`,
                username: `User ${index + pageRowsCount * (currentPage - 1)}`,
                firstName: `FirstName ${index + pageRowsCount * (currentPage - 1)}`,
                lastName: `LastName ${index + pageRowsCount * (currentPage - 1)}`,
                stakes: `Stakes ${index + pageRowsCount * (currentPage - 1)}`,
                pla: `Pla ${index + pageRowsCount * (currentPage - 1)}`,
                pl: `pl ${index + pageRowsCount * (currentPage - 1)}`,
                status: `Status ${index + pageRowsCount * (currentPage - 1)}`,
                cacheDeskName: `cach desk name cach desk name cach desk name cach desk name cach desk name ${
                    index + pageRowsCount * (currentPage - 1)
                }`,
                winning: `Winning ${index + pageRowsCount * (currentPage - 1)}`,
                profitability: text[index]
            }
        }));

    const handleRowSelect = (_, ignore, rowKey) => {
        setSelectedRow((prev) => (prev === rowKey ? null : rowKey));
    };
    const totalcount = rows.length;

    const footerValues = useMemo(
        () => ({
            userId: 'Total',
            username: totalcount,
            firstName: totalcount,
            lastName: totalcount,
            cacheDeskName: totalcount,
            status: totalcount,
            stakes: totalcount,
            winning: totalcount,
            pl: totalcount,
            profitability: totalcount,
            pla: totalcount
        }),
        [totalcount]
    );

    const columns = [
        {
            text: 'User ID',
            resizable: false,
            draggable: false,
            dataKey: 'userId',
            formatter: () =>
                new Promise((res, rej) => {
                    res('test');
                })
        },
        {
            copyable: true,
            text: 'Username',
            sortable: false,
            dataKey: 'username',
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
            dataKey: 'firstName',
            hasOptions: false
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
            dataKey: 'status'
        },
        {
            text: 'Stakes (AMD)',
            dataKey: 'stakes',
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
                        key={row.data.lastName}
                        onClick={stopPropagation}
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

    function getExpandIconDisableState(row, index) {
        return !(index % 5);
    }

    return (
        <>
            <ComboTable
                rows={rows}
                rowKey="lastName"
                columnKey="dataKey"
                handleRowSelect={handleRowSelect}
                selectedRow={selectedRow}
                noDataWithImage
                columns={columns}
                loading={isLoading}
                onEdit={onEditHandler}
                rowsCount={rowsCount}
                currentPage={currentPage}
                footerValues={footerValues}
                selectorData={selectorData}
                selectorValue={pageRowsCount}
                name={breadCrumb}
                onSaveChanges={noop}
                onSelectorChange={onSelectorChange}
                onPaginationChange={onPaginationChange}
                rowExtraClickIconTooltip="Extra click tooltip"
                toggleTooltips={toggleTooltips}
                isEditable
                draggableColumns
                sortableColumns
                resizableColumns
                rowsHover={false}
                selectableRows
                rowActionBar={rowActionBar}
                rowExtraClick={extraClickHandler}
                rowExtraClickNeeded
                renderRowNestedChildren={handleRenderChildren}
                getExpandIconDisableState={getExpandIconDisableState}
                {...args}
            />
            <Modal closeOnClickOutside visible={isModalOpen} onCancel={() => setIsModalOpen(false)}>
                <Time />
                {Object.keys(modalData).map((item, index) => (
                    <div key={index}>
                        {item} / {typeof modalData[item] !== 'function' && modalData[item]}
                    </div>
                ))}
            </Modal>
        </>
    );
};
