import React from 'react';
// TODO: This object will be removed after refactoring
// all stories to use `propCategory` instead of `category`
export const category = {
    functionality: 'Functionality',
    validation: 'Validation',
    appearance: 'Appearance',
    content: 'Content',
    action: 'Actions',
    states: 'States',
    others: 'Others'
};

// TODO: This comment can be removed after refactoring
// all stories to use this object instead of `category`
export const propCategory = {
    functionality: { category: 'Functionality' },
    validation: { category: 'Validation' },
    appearance: { category: 'Appearance' },
    content: { category: 'Content' },
    action: { category: 'Actions' },
    states: { category: 'States' },
    others: { category: 'Others' }
};

export const args = (obj) => {
    const { control, options, category, condition, defaultValue, truthy, name, action, ...rest } = obj;
    const isDefaultProvided = 'defaultValue' in obj;
    const isControl = 'control' in obj;

    return {
        ...(isControl && { control }),
        ...(options && { options }),
        ...(name && { name }),
        ...((category || isDefaultProvided) && {
            table: {
                ...(category && { category }),
                ...(isDefaultProvided && { defaultValue: { summary: defaultValue } })
            }
        }),
        ...(condition && { if: { arg: condition, ...((truthy === false || truthy) && { truthy }) } }),
        ...(action && { action }),
        ...rest
    };
};
// control: 'text','boolean','number','select',

export const componentStage = {
    experimental: 'experimental',
    deprecated: 'deprecated'
};

export const SCREENSHOT_DELAY = 5000;

export function AllStoriesWrapper({ children }) {
    return <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>{children}</div>;
}
