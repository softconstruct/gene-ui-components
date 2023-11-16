import React from 'react';

import CheckboxGroupWithSearchComponent from 'src/lib/organisms/CheckboxGroupWithSearch';
import { checkboxRadioSwitcherConfig } from '../../utils/propTables/CheckboxProp';
import { args, category } from '../../assets/storybook.globals';

const options = Array(100)
    .fill({})
    .map((item, index) => ({
        label: `Option ${index}`,
        value: index,
        className: 'custom-class'
    }));

export default {
    title: 'Organisms/CheckboxGroupWithSearch',
    component: CheckboxGroupWithSearchComponent,
    argTypes: {
        value: args({ control: false, category: category.content }),
        onSave: args({ control: false, category: category.action }),
        onSearch: args({ control: false, category: category.action }),
        onChange: args({ control: false, category: category.action }),
        onCancel: args({ control: false, category: category.action }),
        data: args({ control: 'object', category: category.content }),
        className: args({ control: false, category: category.others }),
        saveText: args({ control: 'text', category: category.content }),
        readOnly: args({ control: 'boolean', category: category.states }),
        cancelText: args({ control: 'text', category: category.content }),
        noDataText: args({ control: 'text', category: category.content }),
        description: args({ control: 'text', category: category.content }),
        checkAllText: args({ control: 'text', category: category.content }),
        errorText: args({ control: 'text', category: category.validation }),
        isValid: args({ control: 'boolean', category: category.validation }),
        noDataTypes: args({ control: false, category: category.appearance }),
        required: args({ control: 'boolean', category: category.validation }),
        defaultSelected: args({ control: 'object', category: category.states }),
        disabled: args({ control: 'boolean', category: category.functionality }),
        disableSave: args({ control: 'boolean', category: category.functionality }),
        noDataWithImage: args({ control: 'boolean', category: category.appearance }),
        showSelectAll: args({ control: 'boolean', category: category.functionality }),
        autofocusSearchField: args({ control: 'boolean', category: category.functionality }),
        isSaveButtonLoading: args({ control: 'boolean', category: category.states }),
        size: args({ control: 'select', options: checkboxRadioSwitcherConfig.size, category: category.appearance }),
        labelPosition: args({
            control: 'select',
            options: checkboxRadioSwitcherConfig.labelPosition,
            category: category.appearance
        }),
        labelAlignment: args({
            control: 'select',
            options: checkboxRadioSwitcherConfig.labelAlignment,
            category: category.appearance
        })
    },
    args: {
        errorText: '',
        data: options,
        isValid: false,
        disabled: false,
        readOnly: false,
        required: false,
        description: '',
        saveText: 'Save',
        disableSave: false,
        showSelectAll: true,
        noDataWithImage: true,
        autofocusSearchField: true,
        isSaveButtonLoading: false,
        noDataText: 'no Data Text',
        checkAllText: 'check All Text',
        size: checkboxRadioSwitcherConfig.size[0],
        defaultSelected: [options[1].value, options[0].value],
        labelPosition: checkboxRadioSwitcherConfig.labelPosition[0],
        labelAlignment: checkboxRadioSwitcherConfig.labelAlignment[0]
    }
};

export const CheckboxGroupWithSearch = ({ ...args }) => <CheckboxGroupWithSearchComponent {...args} />;
