import React, { FC } from 'react';
import { args, componentStage, propCategory } from '../../../../stories/assets/storybook.globals';
import { Meta } from '@storybook/react';

//Styles
import './index.scss';

// Components
import SkeletonLoaderComponent, { ISkeletonProps, IData } from './index';

const data = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad asperiores consequuntur dignissimos ea esse
explicabo mollitia omnis, perferendis placeat quibusdam quis, quisquam voluptas? Accusamus, aliquid,
    soluta! Dolore ex fuga vel.`;

const configDrawData: IData[] = [
    {
        row: true,

        children: [
            {
                col: 2,
                children: [
                    {
                        className: 'content-center',
                        circleSize: 100
                    }
                ]
            },
            {
                gap: true,
                col: 1
            },

            {
                col: 9,
                className: 'align-self-center',
                children: [
                    {
                        row: true,
                        style: {
                            gap: 15
                        },
                        children: [
                            {
                                col: 12
                            },
                            {
                                col: 12
                            },
                            {
                                col: 12
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        row: true,
        style: {
            gap: 15,
            marginTop: 20
        },
        children: [
            {
                col: 12
            },
            {
                col: 12
            },
            {
                col: 12
            },
            {
                col: 12
            }
        ]
    }
];

const meta: Meta<typeof SkeletonLoaderComponent> = {
    title: 'Atoms/SkeletonLoader-d',
    component: SkeletonLoaderComponent,
    argTypes: {
        duration: args({ control: 'number', ...propCategory.appearance }),
        children: args({ control: 'text', ...propCategory.content }),
        data: args({ control: 'object', ...propCategory.content })
    },
    args: {
        isBusy: true,
        children: data,
        data: configDrawData,
        duration: 2,
        componentStage: {
            type: componentStage.deprecated
        }
    }
};

export const SkeletonLoader: FC<ISkeletonProps> = ({ ...args }) => {
    return (
        <div className="skeleton-story-wrapper">
            <SkeletonLoaderComponent {...args}>{args.children}</SkeletonLoaderComponent>
        </div>
    );
};
export default meta;
