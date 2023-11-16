import React, { useState } from 'react';

import ProductsComponent from 'src/lib/molecules/Products';

const screenTypes = ['desktop', 'mobile'];
import { list, favoritesList } from './data';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Products',
    component: ProductsComponent,
    argTypes: {
        onClick: args({ control: false, category: category.action }),
        list: args({ control: 'array', category: category.content }),
        className: args({ control: false, category: category.others }),
        activeSlug: args({ control: false, category: category.states }),
        favorites: args({ control: 'object', category: category.content }),
        screenType: args({ control: false, options: screenTypes, category: category.states })
    },
    args: {
        list,
        favorites: favoritesList
    }
};

export const Products = ({ ...args }) => {
    const [activeSlug, setActiveSlug] = useState(list[0].slug);

    const onChange = (item) => {
        setActiveSlug(item.slug);
    };
    return <ProductsComponent activeSlug={activeSlug} onChange={onChange} {...args} />;
};
