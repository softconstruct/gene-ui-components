import React from 'react';

import SearchComponent from 'src/lib/molecules/Search';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Search',
    component: SearchComponent,
    argTypes: {
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        canClear: args({ control: 'boolean', category: category.states }),
        placeholder: args({ control: 'text', category: category.content }),
        defaultValue: args({ control: 'text', category: category.content })
    },
    args: {
        canClear: false,
        defaultValue: 'search',
        placeholder: 'Some placeholder'
    }
};

export const Search = ({ ...args }) => <SearchComponent {...args} />;
