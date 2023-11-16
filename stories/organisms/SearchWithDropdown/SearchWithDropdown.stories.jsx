import React from 'react';

import SearchWithDropdownComponent from 'src/lib/organisms/SearchWithDropdown';
import { args, category } from '../../assets/storybook.globals';

const data = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
];

export default {
    title: 'Organisms/SearchWithDropdown',
    component: SearchWithDropdownComponent,
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        dataKey: args({ control: 'text', category: category.others }),
        searchProps: args({ control: 'object', category: category.others }),
        dropdownProps: args({ control: 'object', category: category.others }),
        flexibility: args({ control: 'select', category: category.appearance }),
        hideDropdown: args({ control: 'boolean', category: category.functionality })
    },
    args: {
        hideDropdown: false
    }
};

export const SearchWithDropdown = ({ ...args }) => (
    <SearchWithDropdownComponent
        {...args}
        dropdownProps={{
            data,
            checkAllText: 'All',
            isMultiSelect: true
        }}
    />
);

SearchWithDropdown.args = {};
