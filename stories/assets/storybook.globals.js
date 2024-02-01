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
    return {
        ...(control && { control }),
        ...(options && { options }),
        ...(name && { name }),
        ...((category || defaultValue) && {
            table: {
                ...(category && { category }),
                ...(defaultValue && { defaultValue: { summary: defaultValue } })
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
