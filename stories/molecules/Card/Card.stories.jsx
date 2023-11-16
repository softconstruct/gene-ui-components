import React from 'react';

import CardComponent from 'src/lib/molecules/Card';
import Option from 'src/lib/atoms/Option';
import ExtendedInput from 'src/lib/molecules/ExtendedInput';
import { args, category } from '../../assets/storybook.globals';

const others = { category: category.others };
const action = { category: category.action };
const states = { category: category.states };
const content = { category: category.content };
const appearance = { category: category.appearance };
const functionality = { category: category.functionality };

const columns = [
    {
        text: 'User ID',
        dataKey: 'userId',
        formatter: () => {
            return new Promise((res, rej) => {
                res('test');
            });
        }
    },
    {
        text: 'Username',
        dataKey: 'username',
        sortable: false,
        formatter: () =>
            new Promise((res, rej) => {
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
        dataKey: 'winning'
    },
    {
        text: 'P/L (AMD)',
        dataKey: 'pl'
    },
    {
        text: 'Profitability',
        dataKey: 'profitability',
        colRenderer: (value, index, row) => <ExtendedInput value={value} key={row.data.lastName} />,
        sortFn: (prev, next, type, dataKey) => console.log({ prev, next, type, dataKey })
    },
    {
        text: 'Stakes (AMD)',
        dataKey: 'pla'
    }
];

const row = {
    onClick: (row, index) => console.log(`Clicked on ${index} row`),
    data: {
        userId: 'userId 10',
        username: 'User name',
        firstName: 'FirstName',
        lastName: 'lastName',
        stakes: 'Stakes',
        pla: 'Pla',
        pl: 'pl',
        status: 'Status',
        cacheDeskName: 'cach desk name cach desk name',
        winning: 'Winning',
        profitability: 'Some text'
    }
};

const getPopupProps = () => ({
    leftAction: {
        iconType: 'bc-icon-arrow-back',
        text: 'Back'
    },
    rightAction: {
        iconType: 'bc-icon-arrow-forward',
        text: 'All Details'
    },
    rightActionClick: (row, i) => console.log(`Row ${i} detailed vew`)
});

export default {
    title: 'Molecules/Card',
    component: CardComponent,
    argTypes: {
        index: args({ control: false, ...others }),
        row: args({ control: 'object', ...content }),
        className: args({ control: false, ...others }),
        onRowClick: args({ control: false, ...action }),
        cancelText: args({ control: 'text', ...content }),
        expandText: args({ control: 'text', ...content }),
        rowActionBar: args({ control: false, ...action }),
        getPopupProps: args({ control: false, ...action }),
        rowExtraClick: args({ control: false, ...action }),
        expandedText: args({ control: 'text', ...content }),
        border: args({ control: 'boolean', ...appearance }),
        columns: args({ control: false, ...functionality }),
        shadow: args({ control: 'boolean', ...appearance }),
        viewCardText: args({ control: 'text', ...content }),
        columnLimit: args({ control: 'number', ...appearance }),
        expandDisabled: args({ control: 'boolean', ...states }),
        hideMore: args({ control: 'boolean', ...functionality }),
        rowExtraClickNeeded: args({ control: false, ...action }),
        expandedCloseText: args({ control: 'text', ...content }),
        isEditMode: args({ control: 'boolean', ...functionality }),
        renderRowNestedChildren: args({ control: false, ...action }),
        rowExtraClickMenuTitle: args({ control: 'text', ...content }),
        closeWithOutsideClick: args({ control: 'boolean', ...functionality })
    },
    args: {
        border: true,
        shadow: true,
        hideMore: false,
        columnLimit: 11,
        isEditMode: false,
        closeWithOutsideClick: false,
        expandedCloseText: 'expandedCloseText'
    }
};

export const Card = ({ ...args }) => {
    return (
        <CardComponent
            getPopupProps={getPopupProps}
            row={row}
            columns={columns}
            rowActionBar={({ data }) => [
                {
                    title: data.firstName
                },
                {
                    icon: 'bc-icon-note',
                    color: 'hero',
                    title: data.lastName,
                    disabled: true
                },
                <Option title={'Note'} icon="bc-icon-note" screenType="mobile" color="hero" />,
                <Option title={'Send Message'} icon="bc-icon-message" screenType="mobile" color="hero" />,
                <Option title={'Split'} icon="bc-icon-resend" screenType="mobile" color="hero" disabled />,
                <Option title={'Confirm'} icon="bc-icon-selected" screenType="mobile" color="hero" disabled />,
                <Option title={'Reject'} icon="bc-icon-clear" screenType="mobile" color="hero" disabled />
            ]}
            {...args}
        />
    );
};
