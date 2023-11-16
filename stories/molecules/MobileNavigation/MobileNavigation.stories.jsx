import React, { useState } from 'react';

import MobileNavigationComponent from 'src/lib/molecules/MobileNavigation';

import { args, category } from '../../assets/storybook.globals';
import { list } from './data';

export default {
    title: 'Molecules/MobileNavigation',
    component: MobileNavigationComponent,
    argTypes: {
        list: args({ control: 'object', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        activeSlug: args({ control: 'text', category: category.content })
    },
    args: {
        activeSlug: list[1].slug,
        list: list
    }
};

export let MobileNavigation = ({ ...args }) => {
    const [selectedSlug, setSelectedSlug] = useState(args.activeSlug);
    return (
        <MobileNavigationComponent
            {...args}
            onChange={(e) => {
                setSelectedSlug(e.slug);
            }}
            activeSlug={selectedSlug}
        />
    );
};
