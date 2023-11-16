import React from 'react';
import SkeletonLoaderComponent from 'src/lib/atoms/SkeletonLoader/index';
import { args, category, componentStage } from '../../assets/storybook.globals';
import './index.scss';
const data = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad asperiores consequuntur dignissimos ea esse
explicabo mollitia omnis, perferendis placeat quibusdam quis, quisquam voluptas? Accusamus, aliquid,
    soluta! Dolore ex fuga vel.`;

export default {
    title: 'Atoms/SkeletonLoader-d',
    component: SkeletonLoaderComponent,
    argTypes: {
        count: args({ control: 'number', category: category.content }),
        width: args({ control: 'text', category: category.appearance }),
        height: args({ control: 'text', category: category.appearance }),
        duration: args({ control: 'number', category: category.appearance }),
        circle: args({ control: 'boolean', category: category.appearance }),
        isBusy: args({ control: 'boolean', category: category.states }),
        wrapper: args({ control: false, category: category.content }),
        children: args({ control: 'text', category: category.content })
    },
    args: {
        count: 1,
        width: '100%',
        height: '20px',
        duration: 2,
        circle: false,
        isBusy: true,
        children: data,
        componentStage: {
            type: componentStage.deprecated
        }
    }
};

export const SkeletonLoader = ({ ...args }) => {
    return (
        <div className="skeleton-story-wrapper">
            <SkeletonLoaderComponent {...args}>{args.children}</SkeletonLoaderComponent>
        </div>
    );
};
