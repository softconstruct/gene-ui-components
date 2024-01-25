import React, { useState, useMemo, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { convertToRaw, EditorState, ContentState, Modifier } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import clx from 'classnames';
import { Editor as DraftEditor } from 'react-draft-wysiwyg';

// Helpers
import { interceptValue, noop } from 'utils';
import { useMount, useDeviceType } from 'hooks';
import { defaultToolbarConfig, fullToolbarOptions } from './toolbarConfig';

// Components
import Button from '../../atoms/Button';

// Styles
import './index.scss';

const EDITOR_EMPTY_STATE = '<p></p>';

const Editor = forwardRef(
    (
        {
            html,
            config,
            toolbarOptions,
            toolbarConfig,
            onChange,
            onBlur,
            onFocus,
            required,
            isFieldValid,
            getHTML,
            toolbarTextButtons,
            defaultHTML,
            error,
            success,
            disabled,
            className,
            screenType,
            informationMessage,
            ...restProps
        },
        ref
    ) => {
        const { isMobile } = useDeviceType(screenType);

        const [validationState, setValidationState] = useState(true);
        const [editorState, setEditorSate] = useState(createContentWithHTML(defaultHTML));

        const validationHandler = useCallback(
            (inputValue) => {
                setValidationState(!required || (inputValue && inputValue.trim() !== EDITOR_EMPTY_STATE));
            },
            [required]
        );

        const handleChange = useCallback(
            (e) => {
                if (!disabled) {
                    const draftedHtml = draftToHtml(convertToRaw(e.getCurrentContent()));

                    setEditorSate(e);

                    getHTML(draftedHtml);
                    onChange(interceptValue(e, draftedHtml));

                    validationHandler(draftedHtml);
                }
            },
            [getHTML, onChange, validationHandler, disabled]
        );

        const toolbar = useMemo(() => {
            if (config) return config;

            const disabledToolbarConfig = Object.entries(toolbarOptions)
                .filter(([key, value]) => !value && key)
                .map(([key, value]) => key);

            return fullToolbarOptions(isMobile).filter((item) => !disabledToolbarConfig.includes(item));
        }, [config, toolbarOptions]);

        const editorToolbarConfig = useMemo(() => {
            const editorConfig = {
                ...defaultToolbarConfig(isMobile),
                ...toolbarConfig
            };
            editorConfig.options = toolbar;
            return editorConfig;
        }, [toolbar, toolbarConfig]);

        function insertText(text) {
            if (!disabled) {
                const newContent = Modifier.insertText(
                    editorState.getCurrentContent(),
                    editorState.getSelection(),
                    text,
                    editorState.getCurrentInlineStyle()
                );

                setEditorSate((editorState) =>
                    EditorState.forceSelection(
                        EditorState.push(editorState, newContent),
                        newContent.getSelectionAfter()
                    )
                );
            }
        }

        const customButtons = useMemo(
            () =>
                Array.isArray(toolbarTextButtons) &&
                toolbarTextButtons.map((button, index) => (
                    <Button
                        key={index}
                        type="button"
                        color="default"
                        appearance="minimal"
                        flexibility="content-size"
                        onClick={() => insertText(button.value)}
                    >
                        {button.label}
                    </Button>
                )),
            [toolbarTextButtons, insertText]
        );

        useEffect(() => validationHandler(html), [html]);

        // call function when validation state changes
        useEffect(() => {
            isFieldValid(validationState);
        }, [validationState]);

        useMount(validationHandler);

        useEffect(() => {
            if (html) {
                const state = createContentWithHTML(html);
                setEditorSate(EditorState.moveFocusToEnd(state));
            }
        }, [html]);

        useImperativeHandle(ref, () => ({
            insertText
        }));

        return (
            <div
                className={clx('wrapped-editor', className, {
                    error,
                    success,
                    disabled,
                    mobile: isMobile
                })}
            >
                <DraftEditor
                    {...restProps}
                    editorState={editorState}
                    onEditorStateChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    toolbar={editorToolbarConfig}
                    toolbarCustomButtons={customButtons}
                />
                {informationMessage && (
                    <div className="editor-information-message">
                        <p>{informationMessage}</p>
                    </div>
                )}
            </div>
        );
    }
);

function createContentWithHTML(html) {
    if (html) {
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            return EditorState.createWithContent(ContentState.createFromBlockArray(contentBlock.contentBlocks));
        }
    }

    return EditorState.createEmpty();
}

Editor.propTypes = {
    /**
     * If true, the label will be displayed in an error state.
     */
    error: PropTypes.boolean,
    /**
     * If true, the label will be displayed in an success state.
     */
    success: PropTypes.boolean,
    /**
     * If true, the editor will be disabled.
     */
    disabled: PropTypes.boolean,
    /**
     * Styles applied to the wrapper element.
     */
    className: PropTypes.string,
    /**
     * The helper text content.
     */
    informationMessage: PropTypes.node,
    /**
     * Fires callback when field's validation state changes
     * (isValid: boolean) => void
     */
    isFieldValid: PropTypes.func,
    /**
     * Content for editor
     */
    html: PropTypes.string,
    /**
     * default content for editor
     */
    defaultHTML: PropTypes.string,
    /**
     * Define is field required
     */
    required: PropTypes.bool,
    /**
     * Configurations for editor
     */
    config: PropTypes.arrayOf(PropTypes.string),
    /**
     * Fires event when editor's value changes
     * (event: SyntheticEvent) => void
     */
    onChange: PropTypes.func,
    /**
     * Fires callback when editor's value changes, and return content of editor
     * (content: HTML) => void
     */
    getHTML: PropTypes.func,
    /**
     * Fires event when editor get focused
     * (event: SyntheticEvent) => void
     */
    onFocus: PropTypes.func,
    /**
     * Fires event when editor loose focused
     * (event: SyntheticEvent) => void
     */
    onBlur: PropTypes.func,
    /**
     * Control toolbar options, see draft-js for more detailed info
     */
    toolbarOptions: PropTypes.shape({
        inline: PropTypes.bool,
        blockType: PropTypes.bool,
        fontSize: PropTypes.bool,
        fontFamily: PropTypes.bool,
        list: PropTypes.bool,
        textAlign: PropTypes.bool,
        colorPicker: PropTypes.bool,
        link: PropTypes.bool,
        embedded: PropTypes.bool,
        emoji: PropTypes.bool,
        image: PropTypes.bool,
        remove: PropTypes.bool,
        history: PropTypes.bool
    }),
    /**
     * Control toolbar configs, see draft-js for more detailed info
     */
    toolbarConfig: PropTypes.shape({
        inline: PropTypes.shape({
            inDropdown: PropTypes.bool,
            className: PropTypes.string,
            dropdownClassName: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string),
            bold: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            italic: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            underline: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            strikethrough: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            monospace: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            superscript: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            subscript: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            })
        }),
        textAlign: PropTypes.shape({
            inDropdown: PropTypes.bool,
            className: PropTypes.string,
            dropdownClassName: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string),
            left: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            center: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            right: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            justify: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            })
        }),
        link: PropTypes.shape({
            inDropdown: PropTypes.bool,
            className: PropTypes.string,
            popupClassName: PropTypes.string,
            dropdownClassName: PropTypes.string,
            showOpenOptionOnHover: PropTypes.bool,
            defaultTargetOption: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string),
            link: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            unlink: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            })
        }),
        image: PropTypes.shape({
            icon: PropTypes.string,
            className: PropTypes.string,
            popupClassName: PropTypes.string,
            inputAccept: PropTypes.string,
            urlEnabled: PropTypes.bool,
            uploadEnabled: PropTypes.bool,
            alignmentEnabled: PropTypes.bool,
            previewImage: PropTypes.bool,
            uploadCallback: PropTypes.func,
            alt: PropTypes.shape({
                present: PropTypes.bool,
                mandatory: PropTypes.bool
            }),
            defaultSize: PropTypes.shape({
                width: PropTypes.string,
                height: PropTypes.string
            })
        }),
        history: PropTypes.shape({
            inDropdown: PropTypes.bool,
            className: PropTypes.string,
            dropdownClassName: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string),
            undo: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            }),
            redo: PropTypes.shape({
                icon: PropTypes.string,
                className: PropTypes.string
            })
        }),
        emoji: PropTypes.shape({
            icon: PropTypes.string,
            className: PropTypes.string,
            popupClassName: PropTypes.string,
            emojis: PropTypes.arrayOf(PropTypes.string)
        }),
        colorPicker: PropTypes.shape({
            icon: PropTypes.string,
            className: PropTypes.string,
            popupClassName: PropTypes.string,
            colors: PropTypes.arrayOf(PropTypes.string)
        }),
        embedded: PropTypes.shape({
            icon: PropTypes.string,
            className: PropTypes.string,
            popupClassName: PropTypes.string,
            embedCallback: PropTypes.func,
            defaultSize: PropTypes.shape({
                width: PropTypes.string,
                height: PropTypes.string
            })
        }),
        blockType: PropTypes.shape({
            inDropdown: PropTypes.bool,
            dropdownClassName: PropTypes.string,
            className: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string)
        }),
        fontSize: PropTypes.shape({
            icon: PropTypes.string,
            inDropdown: PropTypes.bool,
            dropdownClassName: PropTypes.string,
            className: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.number)
        }),
        fontFamily: PropTypes.shape({
            className: PropTypes.string,
            options: PropTypes.arrayOf(PropTypes.string)
        }),
        remove: PropTypes.shape({
            icon: PropTypes.string,
            className: PropTypes.string
        })
    }),
    /**
     * Custom text buttons that display the text that you sent as value of button
     */
    toolbarTextButtons: PropTypes.arrayOf(PropTypes.object)
};

Editor.defaultProps = {
    getHTML: noop,
    onChange: noop,
    required: false,
    isFieldValid: noop,
    toolbarOptions: {},
    toolbarConfig: {}
};
export default Editor;
