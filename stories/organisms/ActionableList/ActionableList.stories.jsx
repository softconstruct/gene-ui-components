import React, { useEffect, useRef, useState } from 'react';

import { args, category, componentStage } from '../../assets/storybook.globals';
import ActionableListComponent from 'src/lib/organisms/ActionableList';
import { countries, countriesNotNested } from './data';
import { searchMethods } from '../../../src/lib/organisms/ActionableList/config';

export default {
    title: 'Organisms/ActionableList-e',
    component: ActionableListComponent,
    argTypes: {
        data: args({ control: false, category: category.content }),
        onChange: args({ control: false, category: category.action }),
        readOnly: args({ control: false, category: category.states }),
        titleText: args({ control: 'text', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        loadingText: args({ control: 'text', category: category.content }),
        selectionText: args({ control: false, category: category.content }),
        emptyDataText: args({ control: 'text', category: category.content }),
        totalNodesText: args({ control: 'text', category: category.content }),
        emptySearchText: args({ control: 'text', category: category.content }),
        filteredNodesText: args({ control: 'text', category: category.content }),
        selectAllLabelText: args({ control: false, category: category.content }),
        withSelection: args({ control: false, category: category.functionality }),
        withSearch: args({ control: 'boolean', category: category.functionality }),
        searchPlaceholderText: args({ control: 'text', category: category.content }),
        withSortable: args({ control: 'boolean', category: category.functionality }),
        withSearchHighlighting: args({ control: 'boolean', category: category.appearance }),
        searchMethod: args({ control: 'select', options: searchMethods, category: category.functionality })
    },
    args: {
        readOnly: false,
        withSearch: true,
        isLoading: false,
        withSortable: true,
        titleText: 'title text',
        searchMethod: 'startsWith',
        loadingText: 'loading text',
        withSearchHighlighting: true,
        selectionText: 'selection text',
        totalNodesText: 'total nodes text',
        emptySearchText: 'empty search text',
        filteredNodesText: 'filtered nodes text',
        selectAllLabelText: 'select all label text',
        searchPlaceholderText: 'search placeholder text',
        componentStage: {
            type: componentStage.experimental
        }
    }
};

export const ActionableList = ({ ...args }) => {
    const [data, setData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const actionableListRef = useRef();
    useEffect(() => {
        setIsDataLoading(true);
        setTimeout(() => {
            setData(countriesNotNested);
            setIsDataLoading(false);
        }, 3000);
    }, []);

    return (
        <div style={{ height: '595px', width: '100%' }}>
            <ActionableListComponent
                {...args}
                withSearch={false}
                data={data}
                isLoading={isDataLoading}
                ref={actionableListRef}
            />
        </div>
    );
};

export const ActionableListNested = ({ ...args }) => {
    const [data, setData] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const actionableListRef = useRef();
    useEffect(() => {
        setIsDataLoading(true);
        setTimeout(() => {
            setData(countries);
            setIsDataLoading(false);
        }, 3000);
    }, []);

    return (
        <div style={{ height: '600px', width: '100%' }}>
            <ActionableListComponent {...args} data={data} isLoading={isDataLoading} ref={actionableListRef} />
        </div>
    );
};
