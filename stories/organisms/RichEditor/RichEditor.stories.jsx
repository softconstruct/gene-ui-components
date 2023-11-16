import React, { useState } from 'react';

import Editor from 'src/lib/organisms/RichEditor/RichEditor';
import { toolbarTextButtons, defaultHTML } from './store';
import { args, category } from '../../assets/storybook.globals';

export default {
    title: 'Organisms/RichEditor',
    component: Editor,
    argTypes: {
        id: args({ control: 'text', category: category.content }),
        name: args({ control: 'text', category: category.content }),
        onBlur: args({ control: false, category: category.action }),
        value: args({ control: 'text', category: category.content }),
        onChange: args({ control: false, category: category.action }),
        config: args({ control: 'object', category: category.others }),
        success: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        readOnly: args({ control: 'boolean', category: category.states }),
        tabIndex: args({ control: 'number', category: category.content }),
        placeholder: args({ control: 'text', category: category.content }),
        error: args({ control: 'boolean', category: category.validation }),
        wrapperClassName: args({ control: false, category: category.others }),
        toolbarButtons: args({ control: 'text', category: category.content }),
        toolbarTextButtons: args({ control: 'object', category: category.content })
    },
    args: {
        error: false,
        success: false,
        disabled: false,
        readOnly: false,
        placeholder: 'placeholder'
    }
};

export const RichEditor = ({ ...args }) => {
    const [value, setValue] = useState(defaultHTML);
    return (
        <>
            <Editor
                {...args}
                toolbarTextButtons={toolbarTextButtons}
                value={value}
                onChange={(htmlString) => {
                    setValue(htmlString);
                }}
            />
            <Editor
                {...args}
                value={''}
                onChange={(htmlString) => {
                    setValue(htmlString);
                }}
                toolbarButtons={['bold', 'italic', 'underline']}
            />
        </>
    );
};
