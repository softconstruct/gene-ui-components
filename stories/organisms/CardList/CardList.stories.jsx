import React, { useState, useEffect } from 'react';

import WrappedCardList from 'src/lib/organisms/CardList/WrappedCardList';
import CardListComponent from 'src/lib/organisms/CardList/DefaultCardList';

import Breadcrumb from 'src/lib/molecules/Breadcrumb';
import Button from 'src/lib/atoms/Button';
import { generateRows, columns, totals, breadcrumbData } from './data';
import { args, category } from '../../assets/storybook.globals';

const breadCrumb = <Breadcrumb collapsed data={breadcrumbData} />;

const content = { category: category.content };
const functionality = { category: category.functionality };
const appearance = { category: category.appearance };
const others = { category: category.others };
const action = { category: category.action };
const states = { category: category.states };
export default {
    title: 'Organisms/CardList',
    component: CardListComponent,
    argTypes: {
        rows: args({ control: false, ...content }),
        totals: args({ control: false, ...content }),
        columns: args({ control: false, ...content }),
        className: args({ control: false, ...others }),
        columnCount: args({ control: false, ...others }),
        loading: args({ control: 'boolean', ...states }),
        rowClassName: args({ control: false, ...others }),
        expandText: args({ control: 'text', ...content }),
        sortByText: args({ control: 'text', ...content }),
        onSortChange: args({ control: false, ...action }),
        resultText: args({ control: 'text', ...content }),
        cancelText: args({ control: 'text', ...content }),
        rowKey: args({ control: false, ...functionality }),
        getPopupProps: args({ control: false, ...others }),
        expandedText: args({ control: 'text', ...content }),
        shadow: args({ control: 'boolean', ...appearance }),
        border: args({ control: 'boolean', ...appearance }),
        viewCardText: args({ control: 'text', ...content }),
        columnKey: args({ control: false, ...functionality }),
        customSubHeader: args({ control: 'text', ...content }),
        sortType: args({ control: 'select', ...functionality }),
        onPaginationChange: args({ control: false, ...action }),
        expandedCloseText: args({ control: 'text', ...content }),
        sortedColumn: args({ control: false, ...functionality }),
        rowsCount: args({ control: 'number', ...functionality }),
        rowActionBar: args({ control: false, ...functionality }),
        rowExtraClick: args({ control: false, ...functionality }),
        sortingPlaceholder: args({ control: 'text', ...content }),
        isEditMode: args({ control: 'boolean', ...functionality }),
        columnLimit: args({ control: 'number', ...functionality }),
        rowsPerPage: args({ control: 'number', ...functionality }),
        emptyContent: args({ control: 'boolean', ...functionality }),
        rowExtraClickMenuTitle: args({ control: 'text', ...content }),
        getExpandIconDisableState: args({ control: false, ...others }),
        defaultSortType: args({ control: 'select', ...functionality }),
        sortableColumns: args({ control: 'boolean', ...functionality }),
        rowExtraClickNeeded: args({ control: false, ...functionality }),
        renderRowNestedChildren: args({ control: false, ...functionality }),
        defaultSortedColumn: args({ control: 'boolean', ...functionality })
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
