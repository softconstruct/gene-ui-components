import React, { useRef, useState } from 'react';
import EditorComponent from 'src/lib/organisms/Editor';
import { Button, Tag } from '../../../src';
import { args, category } from '../../assets/storybook.globals';

const toolbarTextButtons = [
    {
        label: 'FirstName',
        value: '@Modal.FirstName'
    },
    {
        label: 'LastName',
        value: '@Modal.LastName'
    },
    {
        label: 'Amount',
        value: '@Modal.Amount'
    },
    {
        label: 'Currency',
        value: '@Modal.Currency'
    },
    {
        label: 'RequestID',
        value: '@Modal.RequestID'
    }
];
export default {
    title: 'Organisms/Editor',
    component: EditorComponent,
    argTypes: {
        onBlur: args({ control: false, category: category.action }),
        html: args({ control: 'text', category: category.content }),
        onFocus: args({ control: false, category: category.action }),
        getHTML: args({ control: false, category: category.action }),
        onChange: args({ control: false, category: category.action }),
        className: args({ control: false, category: category.others }),
        success: args({ control: 'boolean', category: category.states }),
        disabled: args({ control: 'boolean', category: category.states }),
        error: args({ control: 'boolean', category: category.validation }),
        defaultHTML: args({ control: 'text', category: category.content }),
        config: args({ control: false, category: category.functionality }),
        required: args({ control: 'boolean', category: category.validation }),
        isFieldValid: args({ control: false, category: category.validation }),
        toolbarConfig: args({ control: 'object', category: category.others }),
        toolbarOptions: args({ control: 'object', category: category.others }),
        informationMessage: args({ control: 'text', category: category.content }),
        toolbarTextButtons: args({ control: 'object', category: category.content })
    },
    args: {
        html: 'html',
        error: false,
        success: false,
        required: false,
        disabled: false,
        toolbarTextButtons,
        defaultHTML: 'default HTML',
        informationMessage: 'information Message'
    }
};

export const Editor = (args) => {
    const editorRef = useRef(null);

    const [html, setHtml] = useState('Editor Example');

    function handleChange({ target }) {
        setHtml(target.value);
    }

    function insertText(text) {
        editorRef.current.insertText(text);
    }

    function handleSubmit() {
        console.log('onSubmit', html);
    }

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <p style={{ lineHeight: 2 }}>
                    Our text editor is controllable and receives both HTML and defaultHTML props. You can receive editor
                    value during onChange and keep it in your component state. The changed state is not recommended to
                    send as an HTML prop every time because your editor body will be mounted every time, which will
                    bring cursor posting issues. That's why you can send default HTML as a default value, and the
                    changed HTML is in your state and sent to the backend(DB) if needed.
                    <br />
                </p>
            </div>
            <div style={{ width: '100%', margin: '10px 0' }}>
                <Tag
                    name="Hi my name is Bond"
                    appearance="light"
                    size="big"
                    cornerRadius="smooth-radius"
                    onClick={() => insertText('Hi my name is Bond')}
                />
                <Tag
                    name="James Bond"
                    appearance="light"
                    size="big"
                    cornerRadius="smooth-radius"
                    onClick={() => insertText('James Bond')}
                />
            </div>

            <EditorComponent ref={editorRef} defaultHTML={html} onChange={handleChange} {...args} />

            <Button onClick={handleSubmit}>Submit example</Button>
        </>
    );
};
