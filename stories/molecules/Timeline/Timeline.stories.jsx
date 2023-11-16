import React from 'react';

import {
    Timeline as TimelineComponent,
    TimelineItem,
    timelineColors,
    timelineAppearances
} from 'src/lib/molecules/Timeline/index';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Molecules/Timeline',
    component: TimelineComponent,
    argTypes: {
        title: args({ control: 'text', category: category.content }),
        className: args({ control: false, category: category.others }),
        children: args({ control: 'text', category: category.content }),
        description: args({ control: 'text', category: category.content }),
        isLoading: args({ control: 'boolean', category: category.states }),
        color: args({ control: 'select', options: timelineColors, category: category.appearance }),
        appearance: args({ control: 'select', options: timelineAppearances, category: category.appearance })
    },
    args: {
        isLoading: false,
        title: 'Some title',
        color: timelineColors[0],
        description: 'Some description',
        appearance: timelineAppearances[0]
    }
};

export const Timeline = ({ ...args }) => {
    return (
        <TimelineComponent>
            <TimelineItem {...args} />
            <TimelineItem {...args} />
        </TimelineComponent>
    );
};
