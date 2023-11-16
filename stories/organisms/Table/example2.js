import React, { useState, useCallback, useMemo } from 'react';

import { Time, Modal, Table, Button, ComboTable, ExtendedInput, Breadcrumb } from 'src';

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

const rowActionBar = (row, index) =>
    index % 5 === 0 ? (
        <>
            <Button icon="bc-icon-apps" size="big" appearance="minimal" color="primary" onClick={noop} />
            <Button icon="bc-icon-players" size="big" appearance="minimal" color="primary" onClick={noop} />
        </>
    ) : null;

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
                // canBeSticky: !!(index % 4),
                // children,
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

function ControlledComboTable({ exportedFileName }) {
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

    // const pageChange = (page, limit) => {
    //   loading && setIsLoading(true);
    //   setCurrentPage(page);
    //   setTimeout(() => {
    //     setIsLoading(false);
    //   }, 1000);
    // }

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
            // canBeSticky: !!(index % 4),
            // children,
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
                withSearch
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
                editApprovalText="Save"
                editRejectionText="Cancel"
                rowExtraClickIconTooltip="Extra click tooltip"
                hideSearchDropdown
                toggleTooltips={toggleTooltips}
                isEditable
                draggableColumns
                sortableColumns
                resizableColumns
                rowsHover={false}
                selectableRows
                showRefreshButton
                rowActionBar={rowActionBar}
                rowExtraClick={extraClickHandler}
                rowExtraClickNeeded
                renderRowNestedChildren={handleRenderChildren}
                getExpandIconDisableState={getExpandIconDisableState}
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
}

export default ControlledComboTable;
