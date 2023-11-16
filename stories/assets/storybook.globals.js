export const category = {
    functionality: 'Functionality',
    validation: 'Validation',
    appearance: 'Appearance',
    content: 'Content',
    action: 'Actions',
    states: 'States',
    others: 'Others'
};

export const args = (obj) => {
    const { control, options, category, condition, defaultValue, truthy, name, action, ...rest } = obj;
    return {
        control: {
            type: control,
            ...(options && { options })
        },
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
