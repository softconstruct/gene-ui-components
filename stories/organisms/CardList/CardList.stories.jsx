import React, { useState, useEffect } from 'react';

//Helpers
import { args, propCategory } from '../../assets/storybook.globals';

// Components
import WrappedCardList from 'src/lib/organisms/CardList/WrappedCardList';
import CardListComponent from 'src/lib/organisms/CardList/DefaultCardList';
import Breadcrumb from 'src/lib/molecules/Breadcrumb';
import Button from 'src/lib/atoms/Button';

// Data
import { generateRows, columns, totals, breadcrumbData } from './data';

const breadCrumb = <Breadcrumb collapsed data={breadcrumbData} />;

export default {
    title: 'Organisms/CardList',
    component: CardListComponent,
    argTypes: {
        rows: args({ control: false, ...propCategory.content }),
        totals: args({ control: false, ...propCategory.content }),
        columns: args({ control: false, ...propCategory.content }),
        className: args({ control: false, ...propCategory.others }),
        columnCount: args({ control: false, ...propCategory.others }),
        loading: args({ control: 'boolean', ...propCategory.states }),
        rowClassName: args({ control: false, ...propCategory.others }),
        expandText: args({ control: 'text', ...propCategory.content }),
        sortByText: args({ control: 'text', ...propCategory.content }),
        onSortChange: args({ control: false, ...propCategory.action }),
        resultText: args({ control: 'text', ...propCategory.content }),
        cancelText: args({ control: 'text', ...propCategory.content }),
        rowKey: args({ control: false, ...propCategory.functionality }),
        getPopupProps: args({ control: false, ...propCategory.others }),
        expandedText: args({ control: 'text', ...propCategory.content }),
        shadow: args({ control: 'boolean', ...propCategory.appearance }),
        border: args({ control: 'boolean', ...propCategory.appearance }),
        viewCardText: args({ control: 'text', ...propCategory.content }),
        columnKey: args({ control: false, ...propCategory.functionality }),
        customSubHeader: args({ control: 'text', ...propCategory.content }),
        sortType: args({ control: 'select', ...propCategory.functionality }),
        onPaginationChange: args({ control: false, ...propCategory.action }),
        expandedCloseText: args({ control: 'text', ...propCategory.content }),
        sortedColumn: args({ control: false, ...propCategory.functionality }),
        rowsCount: args({ control: 'number', ...propCategory.functionality }),
        rowActionBar: args({ control: false, ...propCategory.functionality }),
        rowExtraClick: args({ control: false, ...propCategory.functionality }),
        sortingPlaceholder: args({ control: 'text', ...propCategory.content }),
        isEditMode: args({ control: 'boolean', ...propCategory.functionality }),
        columnLimit: args({ control: 'number', ...propCategory.functionality }),
        rowsPerPage: args({ control: 'number', ...propCategory.functionality }),
        emptyContent: args({ control: 'boolean', ...propCategory.functionality }),
        rowExtraClickMenuTitle: args({ control: 'text', ...propCategory.content }),
        getExpandIconDisableState: args({ control: false, ...propCategory.others }),
        defaultSortType: args({ control: 'select', ...propCategory.functionality }),
        sortableColumns: args({ control: 'boolean', ...propCategory.functionality }),
        rowExtraClickNeeded: args({ control: false, ...propCategory.functionality }),
        renderRowNestedChildren: args({ control: false, ...propCategory.functionality }),
        defaultSortedColumn: args({ control: 'boolean', ...propCategory.functionality })
    },
    args: {
        shadow: true,
        border: true,
        loading: false,
        rowsCount: 200,
        rowsPerPage: 10,
        isEditMode: false,
        emptyContent: false,
        sortableColumns: false,
        cancelText: 'cancel Text',
        expandText: 'expand Text',
        resultText: 'result Text',
        defaultSortedColumn: false,
        sortByText: 'sort By Text',
        expandedText: 'expanded Text',
        viewCardText: 'view Card Text',
        customSubHeader: 'custom Sub Header',
        expandedCloseText: 'expanded Close Text',
        sortingPlaceholder: 'sorting Placeholder',
        rowExtraClickMenuTitle: 'row Extra Click Menu Title'
    }
};

export const CardList = ({ rowsCount, columnCount, loading: parentLoader, ...args }) => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState(generateRows(rowsCount));
    const [nestedRows, setNestedRows] = useState(generateRows(rowsCount));

    const getPopupProps = () => ({
        leftAction: {
            iconType: 'bc-icon-arrow-back',
            text: 'Back'
        },
        rightAction: {
            iconType: 'bc-icon-arrow-forward',
            text: 'All Details'
        },
        rightActionClick: (row, i) => console.log(`Row ${i} detailed vew`),
        title: 'Title'
    });

    useEffect(() => setRows(generateRows(rowsCount)), [rowsCount]);

    return (
        <>
            <WrappedCardList
                {...args}
                sortType="asc"
                sortedColumn="lastName"
                name={breadCrumb}
                withTitle
                columnKey="dataKey"
                rowKey="lastName"
                rowExtraClick={(e, row, index) => console.log(`Extra click on ${index} row`)}
                rowExtraClickNeeded={(row, index) => index % 2 === 0}
                onPaginationChange={() => {
                    setLoading(true);
                    setTimeout(() => {
                        setRows(generateRows(rows.length + 10));
                        setLoading(false);
                    }, 200);
                }}
                getExpandIconDisableState={(item, index) => index % 2}
                loading={loading || parentLoader}
                titleActions={<Button> Edit </Button>}
                getPopupProps={getPopupProps}
                columns={columnCount ? columns.slice(0, columnCount) : columns}
                rows={rows}
                totals={totals}
                renderRowNestedChildren={() => (row, index, parentRef) =>
                    (
                        <WrappedCardList
                            {...args}
                            name={breadCrumb}
                            scrollElement={parentRef}
                            withTitle
                            columnKey="dataKey"
                            rowKey="lastName"
                            rowsPerPage={10}
                            onPaginationChange={() => {
                                setLoading(true);
                                setTimeout(() => {
                                    setNestedRows(generateRows(rows.length + 10));
                                    setLoading(false);
                                }, 200);
                            }}
                            loading={loading}
                            titleActions={<Button> Edit </Button>}
                            getPopupProps={getPopupProps}
                            columns={columnCount ? columns.slice(0, columnCount) : columns}
                            rows={nestedRows}
                            totals={totals}
                        />
                    )}
            />
        </>
    );
};

CardList.args = {
    columnCount: ''
};
