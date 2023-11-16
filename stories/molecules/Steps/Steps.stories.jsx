import React, { useState, useCallback } from 'react';

import StepsComponent from 'src/lib/molecules/Steps/Steps';
import Step from 'src/lib/molecules/Steps/Step';
import { args, category } from '../../assets/storybook.globals';
import { stepsConfig } from '../../../src/configs';

export default {
    title: 'Molecules/Steps',
    component: StepsComponent,
    argTypes: {
        status1: args({
            control: 'select',
            name: 'step 1 status',
            options: stepsConfig.status,
            category: category.appearance
        }),
        status2: args({
            control: 'select',
            name: 'step 2 status',
            options: stepsConfig.status,
            category: category.appearance
        }),
        status3: args({
            control: 'select',
            name: 'step 3 status',
            options: stepsConfig.status,
            category: category.appearance
        }),
        className: args({ control: false, category: category.others }),
        current: args({ control: 'number', category: category.content }),
        Children: args({ control: 'object', category: category.content }),
        children: args({ control: 'object', category: category.content }),
        extraLines: args({ control: 'boolean', category: category.content }),
        highlightCurrent: args({ control: 'boolean', category: category.content }),
        icon2: args({ control: 'text', name: 'step 2 icon', category: category.appearance }),
        icon1: args({ control: 'text', name: 'step 1 icon', category: category.appearance }),
        icon3: args({ control: 'text', name: 'step 3 icon', category: category.appearance }),
        title3: args({ control: 'text', name: 'step 3 title', category: category.appearance }),
        label3: args({ control: 'text', name: 'step 3 label', category: category.appearance }),
        label2: args({ control: 'text', name: 'step 2 label', category: category.appearance }),
        label1: args({ control: 'text', name: 'step 1 label', category: category.appearance }),
        title1: args({ control: 'text', name: 'step 1 title', category: category.appearance }),
        title2: args({ control: 'text', name: 'step 2 title', category: category.appearance }),
        tooltip1: args({ control: 'text', name: 'step 1 tooltip', category: category.appearance }),
        tooltip3: args({ control: 'text', name: 'step 3 tooltip', category: category.appearance }),
        tooltip2: args({ control: 'text', name: 'step 2 tooltip', category: category.appearance }),
        size: args({ control: 'select', options: stepsConfig.size, category: category.appearance }),
        status: args({ control: 'select', options: stepsConfig.status, category: category.content }),
        direction: args({ control: 'select', options: stepsConfig.direction, category: category.content }),
        appearance: args({ control: 'select', options: stepsConfig.appearance, category: category.appearance })
    },
    args: {
        icon1: '',
        icon2: '',
        icon3: '',
        label1: '',
        label2: '',
        label3: '',
        tooltip1: '1',
        tooltip2: '2',
        tooltip3: '3',
        title2: 'step 2',
        title3: 'step 3',
        title1: 'step 1',
        extraLines: false,
        highlightCurrent: false,
        size: stepsConfig.size[0],
        status2: stepsConfig.status[0],
        status1: stepsConfig.status[0],
        status3: stepsConfig.status[0]
    },
    decorators: [
        (story, { args }) => {
            const {
                tooltip1,
                title1,
                label1,
                icon1,
                status1,
                tooltip2,
                title2,
                label2,
                icon2,
                status2,
                tooltip3,
                title3,
                label3,
                icon3,
                status3,
                ...restArgs
            } = args;
            const steps = [
                {
                    tooltip: tooltip1,
                    key: 1,
                    title: title1,
                    label: label1,
                    icon: icon1,
                    status: status1
                },
                {
                    tooltip: tooltip2,
                    key: 2,
                    title: title2,
                    label: label2,
                    icon: icon2,
                    status: status2
                },
                {
                    tooltip: tooltip3,
                    key: 3,
                    title: title3,
                    label: label3,
                    icon: icon3,
                    status: status3
                }
            ];
            return story({ args: { steps, ...restArgs } });
        }
    ]
};

const Template = ({ ...args }) => {
    const { steps } = args;
    return (
        <StepsComponent {...args}>
            {steps.map((step, i) => (
                <Step
                    tooltip={step.tooltip}
                    key={step.key}
                    title={step.title.toString()}
                    label={step.label.toString()}
                    icon={step.icon.toString()}
                    status={step.status}
                />
            ))}
        </StepsComponent>
    );
};

export let Default = Template.bind({});
Default.args = {
    direction: stepsConfig.direction[0],
    appearance: stepsConfig.appearance[0]
};

export let StepsVertical = Template.bind({});
StepsVertical.args = {
    direction: stepsConfig.direction[1],
    appearance: stepsConfig.appearance[0]
};

export let StepsHorizontalWithDots = Template.bind({});
StepsHorizontalWithDots.args = {
    direction: stepsConfig.direction[0],
    appearance: stepsConfig.appearance[1]
};
